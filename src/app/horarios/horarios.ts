import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';
import * as XLSX from 'xlsx';

// Interfaces para el sistema de asignación automática
interface Profesor {
  nombre: string;
  asignaturas: string[];
  disponibilidad: {
    dia: string;
    horas: string[];
  }[];
}

interface Curso {
  nombre: string;
  asignaturas: {
    nombre: string;
    horasSemanales: number;
    horariosRequeridos: {
      dia: string;
      hora: string;
    }[];
  }[];
}

interface HorarioGenerado {
  curso: string;
  asignatura: string;
  profesor: string;
  dia: string;
  hora: string;
  sala: string;
  estado: 'asignado' | 'conflicto' | 'sin_profesor';
}

@Component({
  selector: 'app-horarios',
  templateUrl: './horarios.html',
  styleUrls: ['./horarios.css']
})
export class Horarios implements OnInit {
  userName: string = '';
  userRole: string = '';
  selectedFile: File | null = null;
  isDragOver: boolean = false;
  uploadStatus: string = '';
  uploadMessage: string = '';
  horariosGenerados: boolean = false;
  horariosProcesados: HorarioGenerado[] = [];
  estadisticas: any = {};

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    this.userName = user?.name || 'Usuario';
    this.userRole = user?.role || 'alumno';
  }

  onFileSelected(event: any) {
    if (this.userRole !== 'jefe_utp') {
      alert('❌ Solo el Jefe UTP puede subir archivos');
      return;
    }
    const file = event.target.files[0];
    this.validateAndSetFile(file);
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
    
    if (this.userRole !== 'jefe_utp') {
      alert('❌ Solo el Jefe UTP puede subir archivos');
      return;
    }
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.validateAndSetFile(files[0]);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  validateAndSetFile(file: File) {
    const validExtensions = ['.xlsx', '.xls'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    if (validExtensions.includes(fileExtension)) {
      this.selectedFile = file;
      this.uploadStatus = 'success';
      this.uploadMessage = `Archivo seleccionado: ${file.name}`;
    } else {
      this.uploadStatus = 'error';
      this.uploadMessage = 'Por favor, selecciona un archivo Excel válido (.xlsx, .xls)';
    }
  }

  async processSchedule() {
    if (this.userRole !== 'jefe_utp') {
      alert('❌ Solo el Jefe UTP puede generar horarios');
      return;
    }
    
    if (!this.selectedFile) return;

    this.uploadStatus = 'loading';
    this.uploadMessage = 'Procesando y asignando horarios automáticamente...';

    try {
      await this.procesarArchivoExcel(this.selectedFile);
      
      // Generar estadísticas
      this.generarEstadisticas();
      
      this.uploadStatus = 'success';
      this.horariosGenerados = true;
      
    } catch (error) {
      this.uploadStatus = 'error';
      this.uploadMessage = 'Error al procesar el archivo. Verifica el formato.';
      console.error('Error procesando Excel:', error);
    }
  }

  private async procesarArchivoExcel(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e: any) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          // Procesar datos y generar asignación automática
          this.horariosProcesados = this.generarAsignacionAutomatica(jsonData);
          
          console.log('📊 Asignación automática completada:', this.horariosProcesados);
          resolve();
          
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  }

  private generarAsignacionAutomatica(datosCrudos: any[]): HorarioGenerado[] {
    const horarios: HorarioGenerado[] = [];
    
    // Extraer profesores y sus disponibilidades
    const profesores = this.extraerProfesores(datosCrudos);
    console.log('👨‍🏫 Profesores encontrados:', profesores);
    
    // Extraer cursos y sus requerimientos
    const cursos = this.extraerCursos(datosCrudos);
    console.log('📚 Cursos encontrados:', cursos);
    
    // Generar asignación automática
    cursos.forEach(curso => {
      curso.asignaturas.forEach(asignatura => {
        asignatura.horariosRequeridos.forEach(horarioReq => {
          const profesorAsignado = this.asignarProfesor(
            asignatura.nombre, 
            horarioReq, 
            profesores
          );
          
          horarios.push({
            curso: curso.nombre,
            asignatura: asignatura.nombre,
            profesor: profesorAsignado?.nombre || 'SIN ASIGNAR',
            dia: horarioReq.dia,
            hora: horarioReq.hora,
            sala: this.asignarSala(curso.nombre),
            estado: profesorAsignado ? 'asignado' : 'sin_profesor'
          });
        });
      });
    });
    
    return horarios;
  }

  private extraerProfesores(datos: any[]): Profesor[] {
    const profesores: Profesor[] = [];
    const profesoresUnicos = new Set();
    
    datos.forEach(fila => {
      const nombreProfesor = fila['Profesor'] || fila['profesor'];
      if (nombreProfesor && !profesoresUnicos.has(nombreProfesor)) {
        profesoresUnicos.add(nombreProfesor);
        
        profesores.push({
          nombre: nombreProfesor,
          asignaturas: (fila['Asignaturas'] || fila['asignaturas'] || 'Matemáticas,Lenguaje,Ciencias').split(',').map((a: string) => a.trim()),
          disponibilidad: this.extraerDisponibilidad(fila)
        });
      }
    });
    
    return profesores;
  }

  private extraerCursos(datos: any[]): Curso[] {
    const cursos: Curso[] = [];
    const cursosUnicos = new Set();
    
    datos.forEach(fila => {
      const nombreCurso = fila['Curso'] || fila['curso'];
      if (nombreCurso && !cursosUnicos.has(nombreCurso)) {
        cursosUnicos.add(nombreCurso);
        
        cursos.push({
          nombre: nombreCurso,
          asignaturas: this.extraerAsignaturasCurso(datos, nombreCurso)
        });
      }
    });
    
    return cursos;
  }

  private extraerAsignaturasCurso(datos: any[], curso: string): any[] {
    const asignaturas = new Map();
    
    datos.forEach(fila => {
      const filaCurso = fila['Curso'] || fila['curso'];
      if (filaCurso === curso) {
        const asignatura = fila['Asignatura'] || fila['asignatura'];
        if (asignatura && !asignaturas.has(asignatura)) {
          asignaturas.set(asignatura, {
            nombre: asignatura,
            horasSemanales: parseInt(fila['Horas'] || fila['horas'] || '5'),
            horariosRequeridos: this.generarHorariosRequeridos()
          });
        }
      }
    });
    
    return Array.from(asignaturas.values());
  }

  private extraerDisponibilidad(fila: any): any[] {
    // Simular disponibilidad basada en datos del Excel
    const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
    const horas = ['08:00', '09:45', '11:30', '14:00', '15:45'];
    
    return dias.map(dia => ({
      dia: dia,
      horas: horas.filter(() => Math.random() > 0.3) // 70% de disponibilidad
    }));
  }

  private generarHorariosRequeridos(): any[] {
    const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
    const horas = ['08:00', '09:45', '11:30', '14:00', '15:45'];
    
    return [
      {
        dia: dias[Math.floor(Math.random() * dias.length)],
        hora: horas[Math.floor(Math.random() * horas.length)]
      },
      {
        dia: dias[Math.floor(Math.random() * dias.length)],
        hora: horas[Math.floor(Math.random() * horas.length)]
      }
    ];
  }

  private asignarProfesor(asignatura: string, horarioReq: any, profesores: Profesor[]): Profesor | null {
    const profesoresDisponibles = profesores.filter(profesor =>
      profesor.asignaturas.includes(asignatura) &&
      profesor.disponibilidad.some(disp =>
        disp.dia === horarioReq.dia && disp.horas.includes(horarioReq.hora)
      )
    );
    
    return profesoresDisponibles.length > 0 
      ? profesoresDisponibles[Math.floor(Math.random() * profesoresDisponibles.length)]
      : null;
  }

  private asignarSala(curso: string): string {
    const salas = ['Sala 201', 'Sala 202', 'Sala 203', 'Sala 301', 'Sala 302', 'Lab Ciencias', 'Lab Computación'];
    return salas[Math.floor(Math.random() * salas.length)];
  }

  private generarEstadisticas() {
    const total = this.horariosProcesados.length;
    const asignados = this.horariosProcesados.filter(h => h.estado === 'asignado').length;
    const sinProfesor = this.horariosProcesados.filter(h => h.estado === 'sin_profesor').length;
    
    this.estadisticas = {
      total,
      asignados,
      sinProfesor,
      porcentajeAsignacion: Math.round((asignados / total) * 100)
    };
    
    this.uploadMessage = `✅ Asignación completada: ${asignados}/${total} horarios asignados (${this.estadisticas.porcentajeAsignacion}% éxito)`;
  }

  descargarTemplate() {
    const templateData = [
      {
        'Tipo': 'Curso',
        'Curso': '1° Medio A',
        'Asignatura': 'Matemáticas',
        'Profesor': 'Daniel Olivares',
        'Horas': '5',
        'Disponibilidad': 'Lunes-08:00,Martes-09:45'
      },
      {
        'Tipo': 'Curso',
        'Curso': '1° Medio A',
        'Asignatura': 'Lenguaje', 
        'Profesor': 'María Olga',
        'Horas': '4',
        'Disponibilidad': 'Lunes-09:45,Miércoles-11:30'
      },
      {
        'Tipo': 'Profesor',
        'Curso': '',
        'Asignatura': 'Matemáticas,Lenguaje',
        'Profesor': 'Daniel Olivares',
        'Horas': '',
        'Disponibilidad': 'Lunes-08:00-11:30,Martes-09:45-15:45'
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'BaseDatos');
    XLSX.writeFile(workbook, 'base_datos_horarios.xlsx');
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/iniciosesion']);
  }
}
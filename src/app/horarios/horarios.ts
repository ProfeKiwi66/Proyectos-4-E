import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-horarios',
  templateUrl: './horarios.html',
  styleUrls: ['./horarios.css']
})
export class Horarios implements OnInit { // ← Exportado como "Horarios"
  userName: string = '';
  selectedFile: File | null = null;
  isDragOver: boolean = false;
  uploadStatus: string = '';
  uploadMessage: string = '';
  horariosGenerados: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    this.userName = user?.name || 'Usuario';
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.validateAndSetFile(file);
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
    
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
    if (!this.selectedFile) return;

    this.uploadStatus = 'loading';
    this.uploadMessage = 'Procesando horarios...';

    try {
      await this.procesarArchivoExcel(this.selectedFile);
      
      this.uploadStatus = 'success';
      this.uploadMessage = '¡Horarios generados exitosamente!';
      this.horariosGenerados = true;
      
    } catch (error) {
      this.uploadStatus = 'error';
      this.uploadMessage = 'Error al procesar el archivo. Intenta nuevamente.';
    }
  }

  private async procesarArchivoExcel(file: File) {
    console.log('Procesando archivo:', file.name);
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/iniciosesion']);
  }
}
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,  // ← DEBE SER true
  imports: [CommonModule,],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer {

}

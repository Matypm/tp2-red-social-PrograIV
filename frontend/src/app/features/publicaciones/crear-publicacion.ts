import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PublicacionesService } from '../../core/services/publicaciones-service';

@Component({
  imports: [RouterLink, ReactiveFormsModule],
  selector: 'app-crear-publicacion',
  styleUrl: './crear-publicacion.css',
  templateUrl: './crear-publicacion.html',
})
export class CrearPublicacion {
  
  private router = inject(Router);
  private publicacionesService = inject(PublicacionesService);

  errorImagen = signal('');
  errorGeneral = signal('');
   publicando = signal(false);

  imagenSeleccionada: File | null = null;

  publicacionForm = new FormGroup({
    titulo: new FormControl('', [
      Validators.required,
      Validators.maxLength(100)
    ]),

    descripcion: new FormControl('', [
      Validators.required,
      Validators.maxLength(2000)
    ])
  });

  get f() {
    return this.publicacionForm.controls;
  }

  seleccionarImagen(event: Event): void {
    const input = event.target as HTMLInputElement;
    const archivo = input.files?.[0];

    this.errorImagen.set('');
    this.imagenSeleccionada = null;

    if (!archivo) return;

    if (!archivo.type.startsWith('image/')) {
      this.errorImagen.set('El archivo debe ser una imagen.');
      input.value = '';
      return;
    }

    if (archivo.size > 5 * 1024 * 1024) {
      this.errorImagen.set('La imagen no puede superar los 5 MB.');
      input.value = '';
      return;
    }

    this.imagenSeleccionada = archivo;
  }

  onSubmit(): void {
    this.publicacionForm.markAllAsTouched();
    this.errorGeneral.set('');

    if (this.publicacionForm.invalid) return;

    const datos = this.publicacionForm.getRawValue();

    this.publicando.set(true);

    this.publicacionesService.crear(
      datos.titulo!.trim(),
      datos.descripcion!.trim(),
      this.imagenSeleccionada ?? undefined
    ).subscribe({
      next: () => {
        this.router.navigate(['/publicaciones']);
      },
      error: (error) => {
        console.error('Error al crear la publicación:', error);
        this.errorGeneral.set('No se pudo crear la publicación. Intentá nuevamente.');
        this.publicando.set(false);
      }
    });
  }

  volver(): void {
    this.router.navigate(['/publicaciones']);
  }
}

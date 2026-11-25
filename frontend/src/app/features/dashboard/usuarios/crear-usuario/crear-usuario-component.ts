import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../../core/services/api-service';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-crear-usuario-component',
  styleUrl: './crear-usuario-component.css',
  templateUrl: './crear-usuario-component.html',
})
export class CrearUsuarioComponent {

  private fb = inject(FormBuilder).nonNullable;
  private router = inject(Router);
  private apiService = inject(ApiService);

  errorMensaje = signal('');

  meses = [
    { valor: '01', nombre: 'Enero' },
    { valor: '02', nombre: 'Febrero' },
    { valor: '03', nombre: 'Marzo' },
    { valor: '04', nombre: 'Abril' },
    { valor: '05', nombre: 'Mayo' },
    { valor: '06', nombre: 'Junio' },
    { valor: '07', nombre: 'Julio' },
    { valor: '08', nombre: 'Agosto' },
    { valor: '09', nombre: 'Septiembre' },
    { valor: '10', nombre: 'Octubre' },
    { valor: '11', nombre: 'Noviembre' },
    { valor: '12', nombre: 'Diciembre' }
  ];

  anioActual = new Date().getFullYear();

  crearUsuarioForm = this.fb.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
    nombre_usuario: ['', Validators.required],
    contrasenia: ['', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[A-Z])(?=.*\d).*$/)
    ]],
    repetir_contrasenia: ['', Validators.required],
    dia: ['', [Validators.required, Validators.min(1), Validators.max(31)]],
    mes: ['', Validators.required],
    anio: ['', [
      Validators.required,
      Validators.min(1910),
      Validators.max(this.anioActual)
    ]],
    descripcion: ['', Validators.maxLength(250)],
    img_perfil: this.fb.control<File | null>(null),
    perfil: this.fb.control<'usuario' | 'administrador'>('usuario')
  });

  cargando = signal(false);

  volverAUsuarios() {
    this.router.navigate(['/dashboard/usuarios']);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const archivo = input.files?.[0] ?? null;

    if (!archivo) {
      this.crearUsuarioForm.controls.img_perfil.setValue(null);
      return;
    }

    const formatosValidos = ['image/jpeg', 'image/png', 'image/webp'];

    if (!formatosValidos.includes(archivo.type)) {
      this.errorMensaje.set('Solo se admiten imágenes JPEG, PNG o WebP.');
      input.value = '';
      this.crearUsuarioForm.controls.img_perfil.setValue(null);
      return;
    }

    if (archivo.size > 5 * 1024 * 1024) {
      this.errorMensaje.set('La imagen no puede superar los 5 MB.');
      input.value = '';
      this.crearUsuarioForm.controls.img_perfil.setValue(null);
      return;
    }

    this.errorMensaje.set('');
    this.crearUsuarioForm.controls.img_perfil.setValue(archivo);
  }

  onSubmit() {
    this.errorMensaje.set('');

    if (this.crearUsuarioForm.invalid) {
      this.crearUsuarioForm.markAllAsTouched();
      this.errorMensaje.set('Completá correctamente todos los campos obligatorios.');
      return;
    }

    const formulario = this.crearUsuarioForm.getRawValue();

    if (formulario.contrasenia !== formulario.repetir_contrasenia) {
      this.errorMensaje.set('Las contraseñas ingresadas no coinciden.');
      return;
    }

    if (!this.validarFecha()) {
      this.errorMensaje.set('Ingresá una fecha de nacimiento válida.');
      return;
    }

    const datos = new FormData();

    datos.append('nombre', formulario.nombre);
    datos.append('apellido', formulario.apellido);
    datos.append('correo', formulario.correo);
    datos.append('nombre_usuario', formulario.nombre_usuario);
    datos.append('contrasenia', formulario.contrasenia);
    datos.append('repetir_contrasenia', formulario.repetir_contrasenia);

    datos.append(
      'fecha_nacimiento',
      `${formulario.anio}-${formulario.mes}-${String(formulario.dia).padStart(2, '0')}`
    );

    datos.append('descripcion', formulario.descripcion);
    datos.append('perfil', formulario.perfil);

    if (formulario.img_perfil) {
      datos.append('archivo', formulario.img_perfil);
    }

    this.cargando.set(true);

    this.apiService.post('usuarios', datos).subscribe({
      next: (respuesta) => {
        console.log('Usuario creado correctamente:', respuesta);

        this.cargando.set(false);
        this.router.navigate(['/dashboard/usuarios']);
      },
      error: (error) => {
        console.error('Error al crear usuario:', error);

        this.cargando.set(false);

        if (error.status === 409) {
          this.errorMensaje.set('El correo electrónico o nombre de usuario ya están en uso.');
        } else if (error.status === 400) {
          this.errorMensaje.set('Los datos ingresados no son válidos.');
        } else {
          this.errorMensaje.set('Ocurrió un error al crear el usuario. Intentá nuevamente.');
        }
      }
    });
  }

  validarFecha(): boolean {
    const { dia, mes, anio } = this.crearUsuarioForm.getRawValue();

    const diaNumero = Number(dia);
    const mesNumero = Number(mes);
    const anioNumero = Number(anio);

    const diasPorMes = [
      31,
      this.esBisiesto(anioNumero) ? 29 : 28,
      31, 30, 31, 30,
      31, 31, 30, 31, 30, 31
    ];

    if (mesNumero < 1 || mesNumero > 12) {
      return false;
    }

    const fechaIngresada = new Date(anioNumero, mesNumero - 1, diaNumero);

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    return (
      diaNumero >= 1 &&
      diaNumero <= diasPorMes[mesNumero - 1] &&
      fechaIngresada <= hoy
    );
  }

  esBisiesto(anio: number): boolean {
    return (anio % 4 === 0 && anio % 100 !== 0) || anio % 400 === 0;
  }


}

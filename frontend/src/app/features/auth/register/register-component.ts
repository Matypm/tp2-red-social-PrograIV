import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth-service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Modal } from '../../../shared/components/modal';
import { form } from '@angular/forms/signals';

@Component({
  imports: [ReactiveFormsModule, RouterLink, Modal],
  selector: 'app-register-component',
  styleUrl: './register-component.css',
  templateUrl: './register-component.html',
})
export class RegisterComponent {
  private fb = inject(FormBuilder).nonNullable;
  private authService = inject(AuthService);
  private router = inject(Router);

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

  registerForm = this.fb.group({
    nombre: ['', [Validators.required]],
    apellido: ['', [Validators.required]],
    correo: ['', [Validators.required, Validators.email]],
    nombre_usuario: ['', [Validators.required]],
    contrasenia: ['', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[A-Z])(?=.*\d).*$/)
    ]],
    repetir_contrasenia: ['', [Validators.required]],
    dia: ['', [Validators.required, Validators.min(1), Validators.max(31)]],
    mes: ['', [Validators.required]],
    anio: ['', [Validators.required, Validators.min(1910), Validators.max(this.anioActual)]],
    descripcion: ['', [Validators.maxLength(250)]],
    img_perfil: this.fb.control<File | null>(null)
  });

  cargando = signal(false);

  modalVisible = signal(false);
  modalTitulo = signal('');
  modalMsj = signal('');
  modalTipo = signal<'error' | 'exito' | 'info'>('info');

  mostrarModal(titulo: string, msj: string, tipo: 'error' | 'exito' | 'info') {
    this.modalTitulo.set(titulo);
    this.modalMsj.set(msj);
    this.modalVisible.set(true);
    this.modalTipo.set(tipo);
  }

  cerrarModal() {
    this.modalVisible.set(false);

    if (this.modalTipo() === 'exito') {
      this.router.navigate(['/publicaciones']);
    }
  }

  validarContrasenias(): boolean {
    const contrasenia = this.registerForm.controls.contrasenia.value;
    const repetir = this.registerForm.controls.repetir_contrasenia.value;

    return contrasenia === repetir;
  }

  validarFecha(): boolean {
    const { dia, mes, anio } = this.registerForm.getRawValue();

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

    return (diaNumero >= 1 &&
      diaNumero <= diasPorMes[mesNumero - 1] &&
      fechaIngresada <= hoy);
  }

  esBisiesto(anio: number): boolean {
    return (anio % 4 === 0 && anio % 100 !== 0) || anio % 400 === 0;
  }


  onSubmit() {

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();

      const contrasenia = this.registerForm.controls.contrasenia;

      if (contrasenia.hasError('required')) {
        this.mostrarModal(
          'Contraseña requerida',
          'Ingresá una contraseña.',
          'error'
        );
      } else if (contrasenia.hasError('minlength') || contrasenia.hasError('pattern')) {
        this.mostrarModal(
          'Contraseña inválida',
          'Debe tener al menos 8 caracteres, una mayúscula y un número.',
          'error'
        );
      }

      return;
    }

    if (!this.validarContrasenias()) {
      this.mostrarModal(
        'Contraseñas diferentes',
        'Las contraseñas ingresadas no coinciden.',
        'error'
      );
      return;
    }

    if (!this.validarFecha()) {
      this.mostrarModal(
        'Fecha inválida',
        'Ingresá una fecha de nacimiento válida.',
        'error'
      );
      return;
    }

    const formulario = this.registerForm.getRawValue();

    const datos = {
      nombre: formulario.nombre,
      apellido: formulario.apellido,
      correo: formulario.correo,
      nombre_usuario: formulario.nombre_usuario,
      contrasenia: formulario.contrasenia,
      repetir_contrasenia: formulario.repetir_contrasenia,
      // padStart(2, '0') sirve para garantizar que el día tenga dos dígitos. Si ingresás 5, lo transforma en 05.
      fecha_nacimiento: `${formulario.anio}-${formulario.mes}-${String(formulario.dia).padStart(2, '0')}`,
      descripcion: formulario.descripcion,
      img_perfil: formulario.img_perfil
    };

    this.cargando.set(true);

    this.authService.signUp(datos).subscribe({
      next: (response) => {
        console.log('Registro exitoso!', response);
        this.cargando.set(false);

        this.mostrarModal('¡Cuenta creada!', 'Su cuenta se creo correctamente.', 'exito');

      },
      error: (error) => {
        console.error('Error al ingresar: ', error)
        this.cargando.set(false);

        if (error.status === 409) {
          this.mostrarModal(
            'Datos ya registrados',
            'El correo electrónico o nombre de usuario ya están en uso.',
            'error'
          );
        } else if (error.status === 400) {
          this.mostrarModal(
            'Datos inválidos',
            'Revisá los datos ingresados e intentá nuevamente.',
            'error'
          );
        } else {
          this.mostrarModal(
            'Error al registrarse',
            'Ocurrió un problema al intentar crear la cuenta. Intentá nuevamente.',
            'error'
          );
        }


      }
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const archivo = input.files?.[0] ?? null;

    if (!archivo) {
      this.registerForm.controls.img_perfil.setValue(null);
      return;
    }

    const formatosValidos = ['image/jpeg', 'image/png', 'image/webp'];

    if (!formatosValidos.includes(archivo.type)) {
      this.mostrarModal(
        'Formato inválido',
        'Solo se admiten imágenes JPEG, PNG o WebP.',
        'error'
      );

      input.value = '';
      this.registerForm.controls.img_perfil.setValue(null);
      return;
    }

    if (archivo.size > 5 * 1024 * 1024) {
      this.mostrarModal(
        'Imagen demasiado grande',
        'La imagen no puede superar los 5 MB.',
        'error'
      );

      input.value = '';
      this.registerForm.controls.img_perfil.setValue(null);
      return;
    }

    this.registerForm.controls.img_perfil.setValue(archivo);
  }

}

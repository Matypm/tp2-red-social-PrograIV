import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth-service';
import { Router, RouterLink } from '@angular/router';
import { Modal } from '../../../shared/components/modal';

@Component({
  imports: [ReactiveFormsModule, RouterLink, Modal],
  selector: 'app-login-component',
  styleUrl: './login-component.css',
  templateUrl: './login-component.html',
})
export class LoginComponent {

  private fb = inject(FormBuilder).nonNullable;
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm = this.fb.group({
    identificador: ['', [Validators.required]],
    contrasenia: ['', [
      Validators.required, 
      Validators.minLength(8), 
      Validators.pattern(/^(?=.*[A-Z])(?=.*\d).*$/) // Valida q tenga una Mayuscula y un número
    ]]
  })
  
  cargando = signal(false);
  msjError = signal(null);

  modalVisible = signal(false);
  modalTitulo = signal('');
  modalMsj = signal('');
  modalTipo = signal<'error' | 'exito' | 'info'>('info');

  mostrarModal(titulo: string, msj: string, tipo: 'error' | 'exito' | 'info'){
    this.modalTitulo.set(titulo);
    this.modalMsj.set(msj);
    this.modalVisible.set(true);
    this.modalTipo.set(tipo);
  }

  cerrarModal(){
    this.modalVisible.set(false);
  }

  onSubmit() {

    if (this.loginForm.invalid) {
        this.loginForm.markAllAsTouched();
        return;
    }

    const datos = this.loginForm.getRawValue();

    this.cargando.set(true);

    this.authService.signIn(datos).subscribe({
      next: (response) => {
        console.log('Login exitoso!', response);
        this.cargando.set(false);
      },
      error: (error) => {
        console.error('Error al ingresar: ', error)
        this.cargando.set(false);
      }
    })

    }

}

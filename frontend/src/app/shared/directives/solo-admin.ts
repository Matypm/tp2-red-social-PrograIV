import { Directive, effect, ElementRef, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth-service';

@Directive({
  selector: '[appSoloAdmin]',
  standalone: true
})
export class SoloAdminDirective {

  private authService = inject(AuthService);
  private elemento = inject(ElementRef<HTMLElement>);

  constructor() {
    effect(() => {
      const esAdmin = this.authService.currentPerfil() === 'administrador';

      this.elemento.nativeElement.hidden = !esAdmin;
    });
  }
}

import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appResaltar]',
  standalone: true
})
export class ResaltarDirective {

  constructor(
    private elemento: ElementRef,
    private renderer: Renderer2
  ) {}

  @HostListener('mouseenter')
  alEntrar() {
    const tarjeta = this.elemento.nativeElement;

    this.renderer.setStyle(tarjeta, 'borderColor', 'var(--admin-accent)');
    this.renderer.setStyle(tarjeta, 'transform', 'translateY(-4px)');
    this.renderer.setStyle(tarjeta, 'boxShadow', '0 18px 40px -18px rgba(0, 0, 0, 0.7)');

    this.renderer.setStyle(tarjeta, '--resplandor', '1');
  }

  @HostListener('mouseleave')
  alSalir() {
    const tarjeta = this.elemento.nativeElement;

    this.renderer.removeStyle(tarjeta, 'borderColor');
    this.renderer.removeStyle(tarjeta, 'transform');
    this.renderer.removeStyle(tarjeta, 'boxShadow');

    this.renderer.removeStyle(tarjeta, '--resplandor');
  }
}

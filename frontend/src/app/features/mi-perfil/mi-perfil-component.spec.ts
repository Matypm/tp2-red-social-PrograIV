import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MiPerfilComponent } from './mi-perfil-component';

describe('MiPerfilComponent', () => {
  let component: MiPerfilComponent;
  let fixture: ComponentFixture<MiPerfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiPerfilComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MiPerfilComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

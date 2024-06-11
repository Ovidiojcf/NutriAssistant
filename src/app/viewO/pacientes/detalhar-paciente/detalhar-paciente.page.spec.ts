import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalharPacientePage } from './detalhar-paciente.page';

describe('DetalharPacientePage', () => {
  let component: DetalharPacientePage;
  let fixture: ComponentFixture<DetalharPacientePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalharPacientePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

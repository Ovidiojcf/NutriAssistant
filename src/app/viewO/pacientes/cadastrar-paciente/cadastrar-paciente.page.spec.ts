import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CadastrarPacientePage } from './cadastrar-paciente.page';

describe('CadastrarPacientePage', () => {
  let component: CadastrarPacientePage;
  let fixture: ComponentFixture<CadastrarPacientePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CadastrarPacientePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

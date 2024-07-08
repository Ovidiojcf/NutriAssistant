import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListaPacientePage } from './lista-paciente.page';

describe('ListaPacientePage', () => {
  let component: ListaPacientePage;
  let fixture: ComponentFixture<ListaPacientePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaPacientePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

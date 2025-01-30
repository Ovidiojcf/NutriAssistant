import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CadastrarFichaPage } from './cadastrar-ficha.page';

describe('CadastrarFichaPage', () => {
  let component: CadastrarFichaPage;
  let fixture: ComponentFixture<CadastrarFichaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CadastrarFichaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

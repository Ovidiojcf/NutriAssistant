import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListaPdfsPacienteComponent } from './lista-pdfs-paciente.component';

describe('ListaPdfsPacienteComponent', () => {
  let component: ListaPdfsPacienteComponent;
  let fixture: ComponentFixture<ListaPdfsPacienteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaPdfsPacienteComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListaPdfsPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ListaPdfsPacienteComponent } from './lista-pdfs-paciente.component';

@NgModule({
  declarations: [ListaPdfsPacienteComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [ListaPdfsPacienteComponent]
})
export class ListaPdfsPacienteModule { }
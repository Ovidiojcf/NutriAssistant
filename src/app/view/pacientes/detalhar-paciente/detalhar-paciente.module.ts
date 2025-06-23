import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetalharPacientePageRoutingModule } from './detalhar-paciente-routing.module';

import { DetalharPacientePage } from './detalhar-paciente.page';
import { ListaPdfsPacienteModule } from '../lista-pdfs-paciente/lista-pdfs-paciente.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalharPacientePageRoutingModule,
    ReactiveFormsModule,
    ListaPdfsPacienteModule
  ],
  declarations: [DetalharPacientePage],
})
export class DetalharPacientePageModule {}

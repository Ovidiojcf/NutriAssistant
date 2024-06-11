import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetalharPacientePageRoutingModule } from './detalhar-paciente-routing.module';

import { DetalharPacientePage } from './detalhar-paciente.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalharPacientePageRoutingModule
  ],
  declarations: [DetalharPacientePage]
})
export class DetalharPacientePageModule {}

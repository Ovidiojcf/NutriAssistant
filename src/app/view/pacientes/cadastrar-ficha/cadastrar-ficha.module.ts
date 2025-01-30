import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CadastrarFichaPageRoutingModule } from './cadastrar-ficha-routing.module';

import { CadastrarFichaPage } from './cadastrar-ficha.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CadastrarFichaPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [CadastrarFichaPage],
  providers:[DatePipe]
})
export class CadastrarFichaPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TestePdfPageRoutingModule } from './teste-pdf-routing.module';

import { TestePdfPage } from './teste-pdf.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestePdfPageRoutingModule
  ],
  declarations: [TestePdfPage]
})
export class TestePdfPageModule {}

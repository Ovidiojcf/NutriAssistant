import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TestePdfPage } from './teste-pdf.page';

const routes: Routes = [
  {
    path: '',
    component: TestePdfPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestePdfPageRoutingModule {}

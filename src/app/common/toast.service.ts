import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  
  constructor(private toastController: ToastController) {}

  async show(message: string, color: 'success' | 'danger' | 'warning' | 'primary' = 'primary', duration = 3000) {
    const toast = await this.toastController.create({
      message,
      duration,
      color,
      position: 'top'
    });
    toast.present();
  }
}
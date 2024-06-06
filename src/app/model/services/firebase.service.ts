import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private PATH : string = 'pacientes';

  constructor(private firestore : AngularFireS) { }
}

import { Injectable, NgZone } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithPopup, browserPopupRedirectResolver, GoogleAuthProvider } from 'firebase/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private firebase: FirebaseService,
    private fireAuth: AngularFireAuth,
    private router: Router,
    private ngZone: NgZone,
    private firestore: AngularFirestore
  ) {}

  public signIn(email: string, password: string) {
    return this.fireAuth.signInWithEmailAndPassword(email, password);
  }

  public signUpWithEmailAndPassword(email: string, password: string) {
    return this.fireAuth.createUserWithEmailAndPassword(email, password);
  }

  public recoverPassword(email: string) {
    return this.fireAuth.sendPasswordResetEmail(email);
  }

  public signOut() {
    return this.fireAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['signin']);
    });
  }

  public signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    return signInWithPopup(auth, provider, browserPopupRedirectResolver);
  }

  getUserDataFromFirestore(uid: string): Observable<any> {
    return this.firestore.collection('usuarios').doc(uid).valueChanges();
  }

  // Use este método para obter todos os dados do usuário (Auth + Firestore)
  getUserFullData(): Observable<any> {
    return this.fireAuth.authState.pipe(
      switchMap(authUser => {
        if (authUser && authUser.uid) {
          return this.getUserDataFromFirestore(authUser.uid).pipe(
            map(firestoreUser => ({
              // Extrai explicitamente os campos do Auth
              email: authUser.email,
              uid: authUser.uid,
              emailVerified: authUser.emailVerified,
              // ...adicione outros campos do Auth que quiser...
              ...firestoreUser // Campos personalizados do Firestore
            }))
          );
        } else {
          return of(null);
        }
      })
    );
  }

  // Opcional: método para saber se está logado
  public isLoggedIn(): boolean {
    return !!this.fireAuth.currentUser;
  }
}

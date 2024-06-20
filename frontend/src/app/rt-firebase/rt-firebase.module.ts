import {NgModule} from '@angular/core';
import {initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {getAuth, provideAuth} from '@angular/fire/auth';

const firebaseConfig = {};

@NgModule({
  providers: [provideFirebaseApp(() => initializeApp(firebaseConfig)), provideAuth(() => getAuth())],
})
export class RtFirebaseModule {}

import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import {provideRouter} from '@angular/router';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {provideClientHydration} from '@angular/platform-browser';
import {NgxsModule} from '@ngxs/store';
import {routes} from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideClientHydration(), importProvidersFrom(NgxsModule.forRoot()), provideAnimationsAsync()],
};

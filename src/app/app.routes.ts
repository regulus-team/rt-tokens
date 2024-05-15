import {Routes} from '@angular/router';
import {GeneralNotFoundComponent} from './general/components/general-not-found/general-not-found.component';
import {RtWalletConnectedGuard} from './rt-wallet/guards/rt-wallet-connected.guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./public/public.module').then(m => m.PublicModule),
    title: 'Public | Solana',
  },
  {
    path: 'auth',
    loadChildren: () => import('./rt-wallet-auth/rt-wallet-auth.module').then(m => m.RtWalletAuthModule),
    title: 'Authentication | Solana',
  },
  // Dashboard is the private route, but we cannot use the guards here.
  // Apply the guards to its children's routes instead.
  // Because otherwise, we will have to load the `RtWalletModule` on application start.
  // It is bad for performance, and it causes problems with prerender (as the public routes will have the logic from the private routes).
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
    title: 'Dashboard | Solana',
  },
  {
    path: '**',
    component: GeneralNotFoundComponent,
  },
];

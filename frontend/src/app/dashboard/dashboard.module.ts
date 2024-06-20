import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DashboardRootComponent} from './components/dashboard-root/dashboard-root.component';
import {DashboardRoutingModule} from './dashboard-routing.module';
import {DashboardDetailsComponent} from './components/dashboard-details/dashboard-details.component';
import {RtWalletModule} from '../rt-wallet/rt-wallet.module';
import {HttpClientModule} from '@angular/common/http';
import {MatCardModule} from '@angular/material/card';
import {RtFirebaseModule} from '../rt-firebase/rt-firebase.module';

@NgModule({
  declarations: [DashboardRootComponent, DashboardDetailsComponent],
  imports: [CommonModule, DashboardRoutingModule, RtWalletModule, HttpClientModule, MatCardModule, RtFirebaseModule],
})
export class DashboardModule {}

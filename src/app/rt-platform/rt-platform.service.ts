import {Inject, Injectable, Optional, PLATFORM_ID} from '@angular/core';
import {Settings} from '../../conf/settings';
import {isPlatformBrowser, isPlatformServer} from '@angular/common';
import {BASE_URL} from './models';

@Injectable({
  providedIn: 'root',
})
export class RtPlatformService {
  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private settings: Settings,
    @Optional() @Inject(BASE_URL) private serverBaseUrl: any,
  ) {}

  get baseUrl(): string {
    // settings BASE URL should have higher priority because we may run build on a local machine
    if (this.settings.coreBaseUrl) {
      return this.settings.coreBaseUrl;
    }
    if (this.serverBaseUrl) {
      return this.serverBaseUrl;
    }
    return '';
  }

  get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  get isServer(): boolean {
    return isPlatformServer(this.platformId);
  }
}

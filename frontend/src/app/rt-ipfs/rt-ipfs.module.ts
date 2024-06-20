import {ModuleWithProviders, NgModule} from '@angular/core';
import {RtIpfsService} from './services/rt-ipfs/rt-ipfs.service';
import {defaultRtIpfsModuleConfig, RtIpfsModuleConfig, RtIpfsModuleConfigToken} from './symbols';

@NgModule({
  providers: [RtIpfsService],
})
export class RtIpfsModule {
  static forRoot(config?: RtIpfsModuleConfig): ModuleWithProviders<RtIpfsModule> {
    return {
      ngModule: RtIpfsModule,
      providers: [
        {
          provide: RtIpfsModuleConfigToken,
          useValue: {...defaultRtIpfsModuleConfig, ...config},
        },
      ],
    };
  }
}

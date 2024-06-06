import {TestBed} from '@angular/core/testing';
import {TransferState} from '@angular/platform-browser';
import {Settings} from 'src/conf/settings';
import {RtPlatformService} from './rt-platform.service';

import {RtTransferStateService} from './rt-transfer-state.service';

describe('RtTransferStateService', () => {
  let service: RtTransferStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RtPlatformService, Settings, TransferState],
    });
    service = TestBed.inject(RtTransferStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

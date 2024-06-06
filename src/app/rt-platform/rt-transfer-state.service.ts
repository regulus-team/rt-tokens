import {Injectable} from '@angular/core';
import {RtPlatformService} from './rt-platform.service';
import {StateKey, TransferState} from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class RtTransferStateService {
  constructor(private platform: RtPlatformService, private transfer: TransferState) {}

  private getKey(name: string): StateKey<string> {
    return `state-${name}` as StateKey<string>;
  }

  setState(name: string, state: any) {
    const key = this.getKey(name);
    this.transfer.set(key, state);
  }

  getState(name) {
    const key = this.getKey(name);
    return this.transfer.get(key, null);
  }
}

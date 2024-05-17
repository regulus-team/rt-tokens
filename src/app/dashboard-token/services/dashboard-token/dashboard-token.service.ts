import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {TokenListRPCResponse} from '../../symbols';
import {devNetRPCApi} from '../../../shared/symbols/solana.symbols';

@Injectable()
export class DashboardTokenService {

  constructor(private http: HttpClient) {
  }

  /**
   * Load all associated tokens for a given account.
   * @param publicKeyString - a string representation of the public key.
   */
  public loadAllAccountTokens(publicKeyString: PublicKeyString): Observable<TokenListRPCResponse> {
    return this.http.post(devNetRPCApi, {
      jsonrpc: '2.0',
      id: 1,
      method: 'getProgramAccounts',
      params: [
        'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
        {
          encoding: 'jsonParsed',
          filters: [
            {
              dataSize: 165,
            },
            {
              memcmp: {
                offset: 32,
                bytes: publicKeyString,
              },
            },
          ],
        },
      ],
    });
  }
}

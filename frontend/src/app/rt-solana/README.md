# RT Solana

## About

Data on Solana blockchain are usually accessed through the Solana RPC API.
This package provides a set of utilities to access the data on Solana blockchain in a more convenient way.

## Usage

Import `RtSolanaModule` into your module and provide the configs:

```ts

import {RtSolanaModule} from './rt-solana/rt-solana.module';

@NgModule({  
  imports: 
    // ...,
    RtSolanaModule,
  ...
})
export class SomeModule {}
```

Use `currentWalletAdapter` and `currentClusterConnection` from its service to access the data on Solana blockchain:

```
import {RtSolanaService} from './rt-solana/rt-solana.service';

...

/**
 * The current wallet adapter.
 * Used for all wallet-related operations.
 */
public readonly currentWalletAdapter = this.rtSolana.currentWalletAdapter;

/**
 * Connection to the current Solana network cluster.
 */
public readonly currentClusterConnection = this.rtSolana.currentClusterConnection;

...

constructor(private rtSolanaService: RtSolanaService) {}
```

Use `waitForTransactionBySignature` to wait for a transaction to be confirmed:
(Note: sending transaction usually returns 200 OK instantly, but the transaction may not be published on a chain yet.)

```
...
this.rtSolana.waitForTransactionBySignature(transactionSignature).then(isConfirmed => {
  if (isConfirmed) {
    ctx.dispatch(new CustomActionCalled());
  } else {
    ctx.dispatch(new CustomActionFailed());
  }
});
...
```


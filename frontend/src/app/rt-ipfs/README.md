# RT IPFS

## About

Token metadata, like image and description, is stored on IPFS.
This is a decentralized storage solution that allows us to store large amounts of data without having to worry about the cost of storage.
The module provides a way to interact with IPFS from the runtime.

## Usage

### Import

Import `RtIpfsModule` into your module and provide the configs:

```ts

import {RtIpfsModule} from './rt-ipfs/rt-ipfs.module';

@NgModule({  
  imports: 
    // ...,
    RtIpfsModule.forRoot({
      ipfsPublicDataGatewayUrl: settings.yourIpfsPublicDataGatewayUrl,
      ipfsApiUrl: settings.yourIpfsApiUrl,
      ipfsApiKey: settings.yourIpfsApiKey,
      ipfsApiKeySecret: settings.yourIpfsApiKeySecret,
    }),
  ...
})
export class SomeModule {}
```


### Usage

Call the `uploadTokenMetadata` method to upload the token metadata to IPFS:

```
import {RtIpfsModule} from './rt-ipfs/rt-ipfs.module';

...
constructor(private rtIpfsService: RtIpfsService) {}
...

...
this.rtIpfsService.uploadTokenMetadata(tokenMetadata).subscribe((fileIpfsUrl) => {
  console.log('Token metadata uploaded to IPFS with hash:', fileIpfsUrl);
});
...
```

It can be used to attach metadata to a token when creating it

```
...
const createMetadata = createAndMint(umi, {
  mint: umiSigner,
  name: 'muName',
  uri: fileIpfsUrl, // extracted from the previous example
  sellerFeeBasisPoints: percentAmount(5.5),
  decimals: some(3),
  tokenStandard: TokenStandard.Fungible,
}).sendAndConfirm(umi);
...
```



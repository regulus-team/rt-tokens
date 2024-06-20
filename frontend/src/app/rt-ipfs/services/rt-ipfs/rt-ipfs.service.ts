import {map, Observable, switchMap} from 'rxjs';
import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AssetMetadata, IpfsUploadResponse, RtIpfsModuleConfig, RtIpfsModuleConfigToken, RtTokenMetadata} from '../../symbols';

@Injectable()
export class RtIpfsService {
  /** IPFS public data gateway URL. */
  private readonly ipfsPublicDataGatewayUrl = this.config.ipfsPublicDataGatewayUrl;

  /** IPFS API URL. */
  // private readonly ipfsApiUrl = this.config.ipfsApiUrl;
  private readonly ipfsApiUrl = 'magenta-automatic-anglerfish-836.mypinata.cloud';

  /** IPFS API URL key. */
  private readonly ipfsApiKey = this.config.ipfsApiKey;

  /** IPFS API URL secret. */
  private readonly ipfsApiKeySecret = this.config.ipfsApiKeySecret;

  constructor(
    private http: HttpClient,
    @Inject(RtIpfsModuleConfigToken) private config: Required<RtIpfsModuleConfig>,
  ) {}

  /**
   * Uploads the provided token metadata to IPFS.
   * @param rtTokenMetadata - Token metadata to upload.
   * @returns URL string of the uploaded metadata.
   */
  public uploadTokenMetadata(rtTokenMetadata: RtTokenMetadata): Observable<string> {
    // Upload the image file to IPFS.
    return this.uploadFileToIPFS(rtTokenMetadata.name, rtTokenMetadata.image).pipe(
      // Extract the IPFS hash from the response and upload the metadata with the image URL.
      switchMap(fileUploadResult => {
        const metadata: AssetMetadata = {
          name: rtTokenMetadata.name,
          symbol: rtTokenMetadata.symbol,
          description: rtTokenMetadata.description,
          image: `${this.ipfsPublicDataGatewayUrl}/${fileUploadResult.IpfsHash}`,
        };
        return this.uploadJsonToIPFS(metadata);
      }),
      // Extract the IPFS hash from the response and concat it with the IPFS public data gateway URL.
      map(metadataUploadResult => `${this.ipfsPublicDataGatewayUrl}/${metadataUploadResult.IpfsHash}`),
    );
  }

  /**
   * Uploads a file to IPFS.
   * @param tokenName - Token name; will be assigned to the uploaded file.
   * @param file - File to upload.
   */
  private uploadFileToIPFS(tokenName: string, file: File): Observable<IpfsUploadResponse> {
    // Create FormData object to store the file.
    const formData: FormData = new FormData();

    // Add the file to the FormData object.
    formData.append('file', file);

    //Create a Pinata metadata object and add it to the FormData object.
    const metadata = JSON.stringify({
      name: tokenName,
    });
    formData.append('pinataMetadata', metadata);

    // Create a Pinata options object and add it to the FormData object.
    const options = JSON.stringify({
      cidVersion: 0,
    });
    formData.append('pinataOptions', options);

    // Add authorization headers.
    const headers = new HttpHeaders({
      // pinata_api_key: this.ipfsApiKey,
      // pinata_secret_api_key: this.ipfsApiKeySecret,
      'x-pinata-gateway-token': this.ipfsApiKeySecret,
    });

    // Send the POST request to the IPFS API.
    return this.http.post<IpfsUploadResponse>(`${this.ipfsApiUrl}`, formData, {headers});
  }

  /**
   * Uploads the provided metadata as a JSON object to IPFS.
   * @param metadata - Metadata to upload.
   */
  private uploadJsonToIPFS(metadata: AssetMetadata): Observable<IpfsUploadResponse> {
    // Convert the metadata object to a JSON file.
    const jsonString = JSON.stringify(metadata);
    const blob = new Blob([jsonString], {type: 'text/plain'});
    const tmpFile = new File([blob], 'metadata.json');

    // Create FormData object to upload file.
    const formData = new FormData();
    formData.append('file', tmpFile);

    // Add authorization headers.
    const headers = new HttpHeaders({
      // pinata_api_key: this.ipfsApiKey,
      // pinata_secret_api_key: this.ipfsApiKeySecret,
      'x-pinata-gateway-token': this.ipfsApiKeySecret,
    });

    // Send the POST request to the IPFS API.
    return this.http.post<IpfsUploadResponse>(this.ipfsApiUrl, formData, {headers});
  }
}

import {InjectionToken} from '@angular/core';

/**
 * IPFS upload response.
 */
export interface IpfsUploadResponse {
  /** IPFS hash of the uploaded file. */
  IpfsHash: string;
}

/**
 * Token metadata.
 */
export interface RtTokenMetadata {
  /** Name of the token. */
  name: string;

  /** Symbol of the token. */
  symbol: string;

  /** Description of the token. */
  description: string;

  /** Image of the token. */
  image: File;
}

/**
 * Asset metadata.
 */
export interface AssetMetadata {
  /** Name of the asset. */
  name: string;

  /** Symbol of the asset. */
  symbol: string;

  /** Description of the asset. */
  description: string;

  /** Image URL of the asset. */
  image: string;
}

/**
 * Config for `RtIpfsModule`.
 */
export interface RtIpfsModuleConfig {
  /**
   * IPFS public data gateway URL.
   * Used for accessing IPFS files.
   */
  ipfsPublicDataGatewayUrl: string;

  /**
   * IPFS API URL.
   */
  ipfsApiUrl: string;

  /**
   * IPFS API key.
   */
  ipfsApiKey: string;

  /**
   * IPFS API URL secret.
   */
  ipfsApiKeySecret: string;
}

/**
 * Injection token.
 * Used for providing configs from module to `RtIpfsModule` services.
 */
export const RtIpfsModuleConfigToken = new InjectionToken<string>('RtIpfsModuleConfig');

/**
 * Default config for `RtIpfsModule`.
 */
export const defaultRtIpfsModuleConfig: RtIpfsModuleConfig = {
  ipfsPublicDataGatewayUrl: 'https://ipfs.infura.io:5001/api/v0',
  ipfsApiUrl: 'https://ipfs.infura.io:5001/api/v0',
  ipfsApiKey: 'key',
  ipfsApiKeySecret: 'secret',
};

import {NetCluster} from '../../app/rt-solana/symbols';

/**
 * Describes core settings actual for all projects.
 */
export interface CoreProjectSettings {
  /**
   * Environment site URL.
   * Stores the URL of the location where the project is hosted.
   * Supposed to be overwritten by the environment file.
   */
  coreBaseUrl: string;

  /**
   * Current network cluster.
   * Describes from which cluster the data should be handled.
   * Supposed to be overwritten by the environment file.
   */
  currentNetCluster: NetCluster;

  /**
   * Api URL connection to the Pinata gateway.
   * Used for public access to the items stored on the Pinata service.
   */
  pinataApiGatewayUrl: string;

  /**
   * Api URL connection to the Pinata service.
   */
  pinataApiUrl: string;

  /**
   * Api key for the Pinata service.
   */
  pinataApiKey: string;

  /**
   * Secret key for the Pinata service.
   */
  pinataApiKeySecret: string;
}

/**
 * Describes all project settings.
 * The object with all the following settings is supposed to be created after merging environment settings with core & general settings.
 */
export interface AllProjectSettings extends CoreProjectSettings {}

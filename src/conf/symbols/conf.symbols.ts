import {Connection} from '@solana/web3.js';
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
}

/**
 * Describes all project settings.
 * The object with all the following settings is supposed to be created after merging environment settings with core & general settings.
 */
export interface AllProjectSettings extends CoreProjectSettings {}

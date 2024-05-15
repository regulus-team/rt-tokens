/**
 * Describes core settings actual for all projects.
 */
export interface CoreProjectSettings {
  /** Environment site URL. Supposed to be overwritten by the environment file. */
  coreBaseUrl: string;
}

/**
 * Describes all project settings.
 * The object with all the following settings is supposed to be created after merging environment settings with core & general settings.
 */
export interface AllProjectSettings extends CoreProjectSettings {
}

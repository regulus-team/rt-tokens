/**
 * Describes all possible error formats.
 * Application can't be sure what fields are present, so such an error object should be defined or unified.
 */
export interface UnknownError<T = ErrorFromBackend> extends Error {
  /** If error occurred on backend => it returned as TS error wrap with field `error`. */
  error?: T;
}

/** Default backend error. May contain `detail`, `detail_code` or other field related data. */
export interface ErrorFromBackend {
  /**
   * May be present if error related to scan upload.
   * This error indicates that such submission series were uploaded in the past.
   * This field will contain id of submission with this series.
   */
  id?: string;

  /** Usually contain user message with error descriptions. */
  detail?: string;

  /** Technical information. May be used for error classification in the future. */
  detail_code?: string;

  /** Additional error details. */
  errors?: string[];
}

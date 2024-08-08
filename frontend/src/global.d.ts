/**
 * Indicates that a value can be null.
 */
type Nullable<T> = T | null;

/**
 * Indicates that a value cannot be null.
 */
type NotNullable<T> = T extends null | undefined ? never : T;

/**
 * The string representation of a public key.
 */
type PublicKeyString = string;

/**
 * Extract arguments of the provided function.
 */
type ArgumentsType<F> = F extends (...args: infer A) => any ? A : never;

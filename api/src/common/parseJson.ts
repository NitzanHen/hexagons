import { err, ok, Result } from './Result';

/**
 * Safely parses JSON strings, i.e. does not throw on failure.
 */
export const parseJson = <T>(str: string): Result<T> => {
  try {
    const value: T = JSON.parse(str);

    return ok(value);
  }
  catch (e) {
    return err(e);
  }
}
import {OpendataExplorerRuntimeError} from '../../errors/base.error';

export class OpendataExplorerRuntimeErrorTestUtil {
  /**
   * Compares the actual error with the expected error of type `OpendataExplorerRuntimeError`.
   */
  public static expectToDeepEqual<T extends OpendataExplorerRuntimeError>(actual: unknown, expected: T): void {
    expect(actual).toBeInstanceOf(expected.constructor);
    const actualAsOpendataExplorerRuntimeError = actual as OpendataExplorerRuntimeError;
    expect(actualAsOpendataExplorerRuntimeError.name).toEqual(expected.name);
    expect(actualAsOpendataExplorerRuntimeError.message).toEqual(expected.message);
    expect(actualAsOpendataExplorerRuntimeError.originalError).toEqual(expected.originalError);
  }
}

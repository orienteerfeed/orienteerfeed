import { formatErrors } from '../src/utils/errors.js';

describe('formatErrors', () => {
  it('should return a string of errors separated by commas', () => {
    const errors = [
      { msg: 'Error 1', param: 'param1' },
      { msg: 'Error 2', param: 'param2' },
    ];
    const expectedResult = 'Error 1: param1, Error 2: param2';

    expect(formatErrors(errors)).toBe(expectedResult);
  });

  it('should return an empty string when no errors are passed in', () => {
    const errors = [];

    expect(formatErrors(errors)).toBe('');
  });
});

import { formatErrors } from '../src/utils/errors.js';
import { expect } from 'chai';

describe('formatErrors', () => {
  it('should return a string of errors separated by commas', () => {
    const errors = [
      { msg: 'Error 1', param: 'param1' },
      { msg: 'Error 2', param: 'param2' },
    ];
    const expectedResult = 'Error 1: param1, Error 2: param2';

    expect(formatErrors(errors)).to.equal(expectedResult);
  });

  it('should return an empty string when no errors are passed in', () => {
    const errors = [];

    expect(formatErrors(errors)).to.equal('');
  });

  it('should throw a TypeError if the input is not an array', () => {
    const errors = { msg: 'Error 1', param: 'param1' };

    expect(() => formatErrors(errors)).to.throw(
      TypeError,
      'Expected an array of errors',
    );
  });
});

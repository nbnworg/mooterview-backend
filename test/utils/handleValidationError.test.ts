import { expect } from 'chai';
import { handleValidationErrors } from '../../src/utils/handleValidationError';

describe('handleValidationErrors', () => {
  it('does nothing when there are no validation errors', () => {
    expect(() => handleValidationErrors([])).to.not.throw();
  });

  it('throws an error when validation errors are present', () => {
    const errors = [{ constraintType: 'required', path: 'field' }];
    expect(() => handleValidationErrors(errors)).to.throw('Request had validation errors');
  });
});

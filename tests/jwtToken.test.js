import { verifyJwtToken } from '../src/utils/jwtToken.js';

describe('verifyJwtToken', () => {
  it('should return a 401 status code if no authorization header is present', () => {
    const req = { headers: {} };
    const res = { status: jest.fn().mockReturnValue({ json: jest.fn() }) };

    verifyJwtToken(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('should return a 401 status code if the token is invalid', () => {
    const req = { headers: { authorization: 'Bearer invalid' } };
    const res = { status: jest.fn().mockReturnValue({ json: jest.fn() }) };

    verifyJwtToken(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('should set the decoded JWT on the request object and call next if the token is valid', () => {
    const req = { headers: { authorization: 'Bearer valid' } };
    const res = {};
    const next = jest.fn();

    verifyJwtToken(req, res, next);

    expect(req.jwtDecoded).toEqual({}); // mock value for valid token; replace with actual value in production code
    expect(next).toHaveBeenCalled();
  });
});

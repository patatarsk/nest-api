import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;

  beforeAll(async () => {
    jwtStrategy = new JwtStrategy();
  });

  it('should be defined', () => {
    expect(jwtStrategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return the payload', async () => {
      const payload = {
        sub: 'fake',
        username: 'fake',
      };

      const returnedPayload = {
        _id: 'fake',
        username: 'fake',
      };

      const user = await jwtStrategy.validate(payload);

      expect(user).toEqual(returnedPayload);
    });
  });
});

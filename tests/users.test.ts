import { signupUser } from '../src/services/users/signupUser';
import { loginUser } from '../src/services/users/loginUser';
import * as cognitoUtils from '../src/utils/commonCognitoMethods';
import * as dynamoUtils from '../src/utils/commonDynamodbMethods';

jest.mock('../src/utils/commonCognitoMethods');
jest.mock('../src/utils/commonDynamodbMethods');

describe('User service', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('signupUser stores data and returns user id', async () => {
    (cognitoUtils.createCognitoUser as jest.Mock).mockResolvedValue('uid1');
    const putSpy = dynamoUtils.putItemToDB as jest.Mock;
    putSpy.mockResolvedValue(undefined);

    const result = await signupUser({
      username: 'test',
      email: 'test@test.com',
      password: 'pass',
      fullName: 'Test User',
      location: 'Earth'
    });

    expect(result).toEqual({ message: 'User signed up successfully!', userId: 'uid1' });
    expect(cognitoUtils.createCognitoUser).toHaveBeenCalledWith('test@test.com', 'test@test.com', 'pass');
    expect(putSpy).toHaveBeenCalled();
  });

  test('loginUser forwards credentials to cognito', async () => {
    (cognitoUtils.loginCognitoUser as jest.Mock).mockResolvedValue({ token: 't' });

    const response = await loginUser('mail', 'pass');

    expect(cognitoUtils.loginCognitoUser).toHaveBeenCalledWith('mail', 'pass');
    expect(response).toEqual({ token: 't' });
  });
});

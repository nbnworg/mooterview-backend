import { createSession } from '../src/services/sessions/createSession';
import * as dynamoUtils from '../src/utils/commonDynamodbMethods';
import { v4 as uuidv4 } from 'uuid';

jest.mock('../src/utils/commonDynamodbMethods');
jest.mock('uuid', () => ({ v4: jest.fn() }));

describe('Session service', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('createSession stores session and returns id', async () => {
    (uuidv4 as jest.Mock).mockReturnValue('abc');
    const putSpy = dynamoUtils.putItemToDB as jest.Mock;
    putSpy.mockResolvedValue(undefined);

    const result = await createSession({
      userId: 'u1',
      problemId: 'p1',
      chatsQueue: [],
      startTime: 's',
      endTime: 'e',
      problemStatus: 'open',
      notes: []
    });

    expect(result).toEqual({ message: 'Session created successfully!', sessionId: 'session_abc' });
    expect(putSpy).toHaveBeenCalled();
  });
});

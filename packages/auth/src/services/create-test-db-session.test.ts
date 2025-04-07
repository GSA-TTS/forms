import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createTestDbSession } from './create-test-db-session.js';

vi.mock('crypto', () => ({
  randomUUID: vi.fn().mockReturnValue('test-uuid-123'),
}));

describe('createTestDbSession', () => {
  let mockLucia;
  let mockAuthContext;

  beforeEach(() => {
    mockLucia = {
      createSession: vi.fn().mockResolvedValue({
        id: 'test-session-id',
        userId: 'test-user-id',
        expiresAt: new Date(),
      }),
    };

    mockAuthContext = {
      getLucia: vi.fn().mockResolvedValue(mockLucia),
      db: {
        createSession: vi.fn().mockResolvedValue('some-session-id'),
        createUser: vi.fn().mockResolvedValue({
          id: 'user-id-1234-5678-9012',
          email: 'test@example.com',
        }),
        getUserId: vi.fn().mockResolvedValue('user-id-1234-5678-9012'),
      },
      provider: {},
      getCookie: vi.fn(),
      setCookie: vi.fn(),
      setUserSession: vi.fn(),
      isUserAuthorized: vi.fn(),
    };
  });

  it('should create a session when userId is provided', async () => {
    const userId = 'test-user-id';

    const session = await createTestDbSession(userId, mockAuthContext);

    expect(mockAuthContext.getLucia).toHaveBeenCalledTimes(1);

    expect(mockLucia.createSession).toHaveBeenCalledWith(userId, {
      session_token: 'test-uuid-123',
    });

    expect(session).toEqual({
      id: 'test-session-id',
      userId: 'test-user-id',
      expiresAt: expect.any(Date),
    });
  });

  it('should return undefined when userId is not provided', async () => {
    // @ts-expect-error null arg is not allowed
    const session = await createTestDbSession(null, mockAuthContext);

    expect(mockAuthContext.getLucia).not.toHaveBeenCalled();
    expect(mockLucia.createSession).not.toHaveBeenCalled();
    expect(session).toBeUndefined();
  });
});

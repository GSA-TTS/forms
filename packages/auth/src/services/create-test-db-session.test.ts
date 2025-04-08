import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createTestDbSession } from './create-test-db-session.js';
import { BaseAuthContext } from '../context/base.js';
import { Lucia, UserId } from 'lucia';
import type { AuthRepository } from '../repository/index.js';

vi.mock('crypto', () => ({
  randomUUID: vi.fn().mockReturnValue('test-uuid-123'),
}));

describe('createTestDbSession', () => {
  let mockLucia: {
    createSession: ReturnType<typeof vi.fn>;
  };

  let mockAuthContext: BaseAuthContext;

  beforeEach(() => {
    mockLucia = {
      createSession: vi.fn().mockResolvedValue({
        id: 'test-session-id',
        userId: 'test-user-id',
        expiresAt: new Date(),
      }),
    };

    const mockRepository = {
      getContext: vi.fn().mockReturnValue({ engine: 'sqlite' }),
      createSession: vi.fn().mockResolvedValue('some-session-id'),
      createUser: vi.fn().mockResolvedValue({
        id: 'user-id-1234-5678-9012',
        email: 'test@example.com',
      }),
      getUserId: vi.fn().mockResolvedValue('user-id-1234-5678-9012'),
    } as unknown as AuthRepository;

    mockAuthContext = new BaseAuthContext(
      mockRepository,
      {} as any,
      vi.fn(),
      vi.fn(),
      vi.fn(),
      vi.fn().mockResolvedValue(true)
    );

    mockAuthContext.getLucia = vi
      .fn()
      .mockResolvedValue(mockLucia as unknown as Lucia);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create a session when userId is provided', async () => {
    const userId = 'test-user-id' as UserId;
    const session = await createTestDbSession(mockAuthContext, userId);

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
    const session = await createTestDbSession(mockAuthContext, null);

    expect(mockAuthContext.getLucia).not.toHaveBeenCalled();
    expect(mockLucia.createSession).not.toHaveBeenCalled();
    expect(session).toBeUndefined();
  });
});

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createTestDbSession } from './create-test-db-session.js';
import { BaseAuthContext } from '../context/base.js';
import { Lucia } from 'lucia';
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
      createUser: vi.fn().mockImplementation((email: string) => {
        if (email === 'existing@example.com') {
          return null;
        }
        return { id: 'user-id-1234-5678-9012', email };
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

  it('should create a session when email and valid userId are provided', async () => {
    const email = 'test@example.com';
    const session = await createTestDbSession(mockAuthContext, email);

    expect(mockAuthContext.getLucia).toHaveBeenCalledTimes(1);
    expect(mockAuthContext.db.createUser).toHaveBeenCalledWith(email);
    expect(mockAuthContext.db.getUserId).toHaveBeenCalledWith(email);
    expect(mockLucia.createSession).toHaveBeenCalledWith(
      'user-id-1234-5678-9012',
      {
        session_token: 'test-uuid-123',
      }
    );

    expect(session).toEqual({
      id: 'test-session-id',
      userId: 'test-user-id',
      expiresAt: expect.any(Date),
    });
  });

  it('should log and proceed when a user already exists for the given email', async () => {
    const email = 'existing@example.com';
    const session = await createTestDbSession(mockAuthContext, email);

    expect(mockAuthContext.getLucia).toHaveBeenCalledTimes(1);
    expect(mockAuthContext.db.createUser).toHaveBeenCalledWith(email);
    expect(mockAuthContext.db.getUserId).toHaveBeenCalledWith(email);
    expect(mockLucia.createSession).toHaveBeenCalledWith(
      'user-id-1234-5678-9012',
      {
        session_token: 'test-uuid-123',
      }
    );

    expect(session).toEqual({
      id: 'test-session-id',
      userId: 'test-user-id',
      expiresAt: expect.any(Date),
    });
  });

  it('should return undefined when userId cannot be retrieved', async () => {
    mockAuthContext.db.getUserId = vi.fn().mockResolvedValue(null);
    const email = 'nonexistent@example.com';
    const session = await createTestDbSession(mockAuthContext, email);

    expect(mockAuthContext.getLucia).not.toHaveBeenCalled();
    expect(mockLucia.createSession).not.toHaveBeenCalled();
    expect(session).toBeUndefined();
  });
});

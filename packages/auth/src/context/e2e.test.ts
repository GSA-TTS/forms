import { describe, it, expect, vi } from 'vitest';
import { createE2eAuthContext } from './e2e.js';
import { BaseAuthContext } from './base.js';

// Mock imports
vi.mock('@gsa-tts/forms-database/context', () => ({
  createFilesystemDatabaseContext: vi.fn().mockResolvedValue({}),
}));

vi.mock('../repository/index.js', () => ({
  createAuthRepository: vi.fn().mockReturnValue({}),
}));

describe('createE2eAuthContext', () => {
  it('should return an instance of BaseAuthContext', async () => {
    const mockDbPath = '/mock/db/path';
    const result = await createE2eAuthContext(mockDbPath);
    expect(result).toBeInstanceOf(BaseAuthContext);
  });
});

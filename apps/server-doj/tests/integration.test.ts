import request from 'supertest';
import { describe, expect, test } from 'vitest';

import { createInMemoryDatabaseContext } from '@gsa-tts/forms-database/context';

import { createCustomServer } from '../src/server';

describe('DOJ Form Service', () => {
  test('renders the home page', async () => {
    const db = await createInMemoryDatabaseContext();
    const app = await createCustomServer(db);
    const response = await request(app).get('/');
    expect(response.ok).toBe(true);
    expect(response.text).toMatch(/DOJ Form Service/);
  });
});

import { test as setup } from '@playwright/test';
import { join } from 'path';
import { chromium } from 'playwright';
import * as dotenv from 'dotenv';

dotenv.config();
const authFile = join(__dirname, '../.auth/user.json');

setup('authenticate', async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();

  await context.addCookies([
    {
      name: 'auth_session',
      value: process.env.AUTH_SESSION,
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
    },
  ]);

  // Save the storage state (including cookies). We can reuse this in other tests that depend on this task
  // so we don't need to authenticate in every test.
  await context.storageState({ path: authFile });
  await browser.close();
});

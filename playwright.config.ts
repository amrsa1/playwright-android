import type { PlaywrightTestConfig } from '@playwright/test';


const config: PlaywrightTestConfig = {
  use: {
    actionTimeout: 0,
    baseURL: 'https://www.nopcommerce.com/en',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',

  },
  projects: [{
    name: 'android-emulator'
  }],
  testDir: './src/tests/',
  testMatch: [
    'mobile.test.ts',
  ],
  timeout: 30 * 1000,
  expect: {
    timeout: 5000
  },
  retries: 0,
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
  ]
};

export default config;

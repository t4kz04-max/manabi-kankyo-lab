import { defineConfig, devices } from '@playwright/test'

const PORT = 4173

/**
 * E2E テストの設定。
 * 本番ビルド（vite preview）に対して実行し、公開時と同じ状態で確認する。
 *
 * - chromium：PC にインストール済みの Google Chrome を使う（ブラウザのダウンロード不要）。
 *   Chrome がない環境では `npx playwright install chromium` を実行し、
 *   環境変数 PW_CHROMIUM_BUNDLED=1 を付けて実行する。
 * - firefox：`npx playwright install firefox` でブラウザを入れてから
 *   `npm run test:e2e:firefox` で実行する。
 * - webkit：`npx playwright install webkit` でブラウザを入れてから
 *   `npx playwright test --project=webkit` で実行する（Safari の参考確認）。
 */
export default defineConfig({
  testDir: './tests/e2e',
  // 各テストは localStorage を使うため、1つずつ順番に実行する
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    locale: 'ja-JP',
    timezoneId: 'Asia/Tokyo',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
        ...(process.env.PW_CHROMIUM_BUNDLED ? {} : { channel: 'chrome' }),
      },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'], viewport: { width: 1440, height: 900 } },
    },
    {
      // Safari と同じエンジン（WebKit）での参考確認。`npx playwright install webkit` が必要
      name: 'webkit',
      use: { ...devices['Desktop Safari'], viewport: { width: 1440, height: 900 } },
    },
  ],
  webServer: {
    command: `npm run build && npm run preview -- --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})

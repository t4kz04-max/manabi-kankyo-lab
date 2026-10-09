import { expect, test } from '@playwright/test'
import { collectConsoleErrors, openFresh } from './helpers'

const ROUTES = [
  { path: '/', heading: '教室の「困った」を、「変わった」に。' },
  { path: '/student/new', heading: '困りごとを伝える' },
  { path: '/student/status', heading: '対応状況を見る' },
  { path: '/teacher', heading: '先生ダッシュボード' },
  { path: '/teacher/issues/demo-issue-001', heading: '改善プランの検討' },
  { path: '/report', heading: '改善レポート' },
  { path: '/report?issueId=demo-issue-005', heading: '改善レポート' },
  { path: '/this-page-does-not-exist', heading: 'ページが見つかりません' },
]

for (const width of [375, 768, 1440]) {
  test(`${width}px：全画面が表示され、横スクロールが出ない`, async ({ page }) => {
    const errors = collectConsoleErrors(page)
    await page.setViewportSize({ width, height: 900 })
    await openFresh(page)
    for (const route of ROUTES) {
      // URL を直接開いても表示できる（SPA のクライアントサイドルーティング）
      await page.goto(route.path)
      await expect(page.getByRole('heading', { level: 1 }), route.path).toHaveText(route.heading)
      // すべての画面でデモ版であることがわかる
      await expect(page.getByRole('banner')).toContainText('デモ版')
      await expect(page.getByRole('contentinfo')).toContainText('すべて架空のデータです')
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      )
      expect(overflow, `${route.path} の横スクロール`).toBe(0)
    }
    expect(errors).toEqual([])
  })
}

test('存在しない投稿IDでも画面が壊れない', async ({ page }) => {
  await openFresh(page, '/teacher/issues/no-such-issue')
  await expect(page.getByText('対象の困りごとが見つかりません')).toBeVisible()
  await page.goto('/report?issueId=no-such-issue')
  await expect(page.getByText('指定された困りごとが見つかりません')).toBeVisible()
  await expect(page.locator('#report-issue')).toBeVisible()
})

test('ナビゲーションで各画面に移動できる', async ({ page }) => {
  await openFresh(page)
  const nav = page.getByRole('banner').getByRole('navigation')
  for (const [label, heading] of [
    ['困りごとを伝える', '困りごとを伝える'],
    ['対応状況を見る', '対応状況を見る'],
    ['ダッシュボード', '先生ダッシュボード'],
    ['改善レポート', '改善レポート'],
    ['ホーム', '教室の「困った」を、「変わった」に。'],
  ]) {
    await nav.getByRole('link', { name: label }).click()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(heading)
  }
})

test('画面ごとにコードを分割して読み込む', async ({ page }) => {
  const scripts: string[] = []
  page.on('response', (response) => {
    const url = response.url()
    if (url.includes('/assets/') && url.endsWith('.js')) scripts.push(url.split('/').pop() ?? '')
  })
  await openFresh(page)
  expect(scripts.some((name) => name.startsWith('HomePage'))).toBe(true)
  expect(scripts.some((name) => name.startsWith('ReportPage'))).toBe(false)
  await page.getByRole('banner').getByRole('link', { name: '改善レポート' }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('改善レポート')
  expect(scripts.some((name) => name.startsWith('ReportPage'))).toBe(true)
})

test('画面の読み込みに失敗しても案内を表示する', async ({ page }) => {
  await openFresh(page)
  await page.route('**/assets/ReportPage-*.js', (route) => route.abort())
  await page.getByRole('banner').getByRole('link', { name: '改善レポート' }).click()
  await expect(page.getByRole('heading', { name: '画面を表示できませんでした' })).toBeVisible()
  await expect(page.getByRole('banner')).toBeVisible()
  await expect(page.getByRole('button', { name: '再読み込みする' })).toBeVisible()
})

test('個人情報の入力欄がなく、デモであることを説明している', async ({ page }) => {
  await openFresh(page, '/student/new')
  // 生徒の投稿画面には文章を入力する欄がない（選択式のみ）
  await expect(page.locator('main input[type=text], main textarea')).toHaveCount(0)
  await expect(page.getByText('名前やクラスなど、あなたが誰かわかる情報は入力しません')).toBeVisible()
  await page.goto('/teacher/issues/demo-issue-001')
  await expect(page.getByText('先生モードはデモ用です。')).toBeVisible()
  await expect(page.getByText('実在の生徒の名前や、健康・家庭に関する情報など')).toBeVisible()
})

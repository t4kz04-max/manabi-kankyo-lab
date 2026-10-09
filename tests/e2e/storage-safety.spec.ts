import { expect, test } from '@playwright/test'
import {
  STORAGE_KEY,
  breakStorage,
  choose,
  openFresh,
  readState,
  restoreStorage,
  submitChairNoise,
  timelineTitles,
} from './helpers'

test.describe('保存に失敗したとき', () => {
  test('生徒の投稿：完了扱いにせず、選択内容を残して再試行できる', async ({ page }) => {
    await openFresh(page, '/student/new')
    const before = await readState(page)
    const beforeIssues = before?.issues.length ?? 5

    await breakStorage(page)
    await choose(page, 'category', 'light')
    await choose(page, 'situation', 'time-of-day')
    await choose(page, 'issueType', 'window-glare')
    await page.getByRole('button', { name: '内容を確認する' }).click()
    await page.getByRole('button', { name: 'この内容で投稿する' }).click()

    await expect(page.getByRole('alert')).toContainText('投稿できませんでした')
    await expect(page.getByRole('alert')).toBeFocused()
    await expect(page.getByText('困りごとを受け付けました')).toHaveCount(0)
    expect((await readState(page))?.issues.length ?? 5).toBe(beforeIssues)

    // 戻っても選択内容が残っている
    await page.getByRole('button', { name: '戻って修正する' }).click()
    await expect(page.locator('input[name=category]:checked')).toHaveValue('light')
    await expect(page.locator('input[name=situation]:checked')).toHaveValue('time-of-day')
    await expect(page.locator('input[name=issueType]:checked')).toHaveValue('window-glare')

    // 保存できるようになれば、そのまま再試行で投稿できる
    await page.getByRole('button', { name: '内容を確認する' }).click()
    await restoreStorage(page)
    await page.getByRole('button', { name: 'この内容で投稿する' }).click()
    await expect(page.getByRole('heading', { name: '困りごとを受け付けました' })).toBeVisible()
    expect((await readState(page)).issues).toHaveLength(beforeIssues + 1)
  })

  test('先生の保存：反映せず、履歴にも追加しない', async ({ page }) => {
    await openFresh(page)
    const issueId = await submitChairNoise(page)
    await page.goto(`/teacher/issues/${issueId}`)
    await breakStorage(page)
    await choose(page, 'status', 'considering')
    await page.getByRole('button', { name: '変更を保存' }).click()
    await expect(page.getByText('変更は反映されていません')).toBeVisible()
    await expect(page.getByText('保存しました。')).toHaveCount(0)

    // 同じタブ内で（再読み込みせずに）レポートを開いても、保存していない変更は表示されない
    await restoreStorage(page)
    await page.getByRole('button', { name: '変更を取り消す' }).click()
    await page.getByRole('link', { name: 'この困りごとの改善レポート' }).click()
    expect(await timelineTitles(page)).toEqual(['生徒が困りごとを投稿'])
  })

  test('リセット：初期状態に戻したことにしない', async ({ page }) => {
    await openFresh(page)
    await submitChairNoise(page)
    await breakStorage(page)
    await page.getByRole('contentinfo').getByRole('button', { name: 'デモデータをリセット' }).click()
    await page.getByRole('alertdialog').getByRole('button', { name: '初期状態に戻す' }).click()
    await expect(page.getByText('初期状態に戻せませんでした')).toBeVisible()
    expect((await readState(page)).issues).toHaveLength(6)
  })
})

test.describe('保存データの安全性', () => {
  test('壊れたデータは初期状態に戻してお知らせする', async ({ page }) => {
    await page.goto('/')
    await page.evaluate((key) => localStorage.setItem(key, '{broken'), STORAGE_KEY)
    await page.goto('/student/status')
    await expect(page.getByText('読み込めなかったため、初期状態に戻しました')).toBeVisible()
    await expect(page.locator('main article')).toHaveCount(5)
  })

  test('古い形式のデータは初期状態に戻してお知らせする', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(
      (key) => localStorage.setItem(key, JSON.stringify({ version: 1, issues: [], improvements: [] })),
      STORAGE_KEY,
    )
    await page.goto('/report')
    await expect(page.getByText('保存データの形式が変わったため')).toBeVisible()
    expect((await readState(page)).version).toBe(2)
  })

  test('存在しない投稿を参照する履歴は破損として扱う', async ({ page }) => {
    await openFresh(page)
    await page.evaluate((key) => {
      const state = JSON.parse(localStorage.getItem(key) ?? 'null') ?? {
        version: 2,
        issues: [],
        improvements: [],
        activities: [],
      }
      state.activities = [
        { id: 'x', issueId: 'no-such', type: 'issue-submitted', occurredAt: '2026-01-01T00:00:00Z', isDemo: true },
      ]
      localStorage.setItem(key, JSON.stringify(state))
    }, STORAGE_KEY)
    await page.goto('/report')
    await expect(page.getByText('読み込めなかったため')).toBeVisible()
  })
})

test('デモデータのリセット：確認ダイアログで初期状態に戻る', async ({ page }) => {
  await openFresh(page)
  await submitChairNoise(page)
  await page.goto('/teacher')
  const resetButton = page.getByRole('contentinfo').getByRole('button', { name: 'デモデータをリセット' })

  // キャンセルでは何も変わらない
  await resetButton.click()
  await expect(page.getByRole('alertdialog')).toContainText('この操作は取り消せません')
  await page.getByRole('button', { name: 'キャンセル' }).click()
  await expect(page.locator('main ul > li article')).toHaveCount(6)

  await resetButton.click()
  await page.getByRole('alertdialog').getByRole('button', { name: '初期状態に戻す' }).click()
  await expect(page.getByText('デモデータを初期状態に戻しました。')).toBeVisible()
  await expect(page.locator('main ul > li article')).toHaveCount(5)
  const state = await readState(page)
  expect(state.issues).toHaveLength(5)
  expect(state.activities).toEqual([])
})

test('別のタブで保存した内容が反映される', async ({ page, context }) => {
  await openFresh(page, '/report?issueId=demo-issue-001')
  const teacherTab = await context.newPage()
  await teacherTab.goto('/teacher/issues/demo-issue-001')
  await choose(teacherTab, 'status', 'considering')
  await teacherTab.getByRole('button', { name: '変更を保存' }).click()
  await expect(teacherTab.getByText('保存しました。')).toBeVisible()
  await expect
    .poll(() => timelineTitles(page))
    .toEqual(['生徒が困りごとを投稿', '対応状況を「検討中」に変更'])
})

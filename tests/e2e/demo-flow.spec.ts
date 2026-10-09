import { expect, test } from '@playwright/test'
import {
  INPUT_REASON,
  INPUT_RESULT,
  choose,
  collectConsoleErrors,
  openFresh,
  readState,
  submitChairNoise,
  timelineTitles,
} from './helpers'

/**
 * docs/DEMO_SCRIPT.md の操作シナリオ：
 * 生徒の投稿 → 先生の対応（試行予定 → 改善済み）→ 生徒側への反映 → 改善レポート
 */
test('デモシナリオを最後まで操作できる', async ({ page }) => {
  const errors = collectConsoleErrors(page)
  await openFresh(page)

  // ホーム → 生徒として使う
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('教室の「困った」を、「変わった」に。')
  // ヒーローの「生徒として使う」（ページ下部にも同じボタンがある）
  await page.getByRole('main').getByRole('link', { name: '生徒として使う' }).first().click()
  await expect(page).toHaveURL(/\/student\/new$/)

  // 1. 生徒の投稿（未確認で保存される）
  const issueId = await submitChairNoise(page)
  let state = await readState(page)
  expect(state.issues).toHaveLength(6)
  expect(state.issues.at(-1)).toMatchObject({ status: 'unconfirmed', isDemo: true })

  // 先生ダッシュボードに表示される
  await page.getByRole('banner').getByRole('link', { name: 'ダッシュボード' }).click()
  const firstRow = page.locator('main ul > li article').first()
  await expect(firstRow).toContainText('授業の始まりに、椅子を動かす音が気になる')
  await expect(firstRow).toContainText('未確認')

  // 2. 先生による対応の保存（参考例を選び、試行予定で保存）
  await firstRow.getByRole('link', { name: '対応を考える' }).click()
  await expect(page).toHaveURL(new RegExp(`/teacher/issues/${issueId}$`))
  await page
    .locator('li', { hasText: '椅子の移動方法を工夫する' })
    .getByRole('button', { name: 'この案を対応方針に使う' })
    .click()
  // 参考例を選んだだけでは対応状況は変わらない
  await expect(page.locator('input[name=status]:checked')).toHaveValue('unconfirmed')
  await expect(page.locator('#field-selectedAction')).toHaveValue(/^椅子の移動方法を工夫する/)
  await choose(page, 'status', 'trial-planned')
  await page.locator('#field-decisionReason').fill(INPUT_REASON)
  await page.getByRole('button', { name: '変更を保存' }).click()
  await expect(page.getByText('保存しました。')).toBeVisible()

  // 3. 生徒側への反映
  await page.getByRole('banner').getByRole('link', { name: '対応状況を見る' }).click()
  const studentCard = page.locator('main article').first()
  await expect(studentCard).toContainText('試行予定')
  await expect(studentCard).toContainText('椅子の移動方法を工夫する')
  await expect(studentCard).toContainText(INPUT_REASON)

  // 改善済みにして、試した結果を記録する（結果がないと保存できない）
  await page.goto(`/teacher/issues/${issueId}`)
  await choose(page, 'status', 'improved')
  await page.getByRole('button', { name: '変更を保存' }).click()
  await expect(page.getByRole('alert')).toContainText('試した結果を入力してください')
  await page.locator('#field-trialResult').fill(INPUT_RESULT)
  await page.getByRole('button', { name: '変更を保存' }).click()
  await expect(page.getByText('保存しました。')).toBeVisible()

  // 4. 改善レポートの履歴：記録した出来事だけが、古い順に表示される
  await page.getByRole('link', { name: '改善レポートを見る' }).click()
  await expect(page).toHaveURL(new RegExp(`/report\\?issueId=${issueId}$`))
  expect(await timelineTitles(page)).toEqual([
    '生徒が困りごとを投稿',
    '対応状況を「試行予定」に変更',
    '対応状況を「改善済み」に変更',
  ])
  const summary = page.locator('section', { has: page.locator('#report-summary-heading') })
  await expect(summary).toContainText('椅子の移動方法を工夫する')
  await expect(summary).toContainText('2週間試したところ')
  await expect(summary).toContainText('すべての生徒の困りごとが解消されたことを示すものではありません')

  // 履歴の中身：変更時点の値で記録され、保存していない「試行中」はない
  state = await readState(page)
  const activities = state.activities.filter((a: { issueId: string }) => a.issueId === issueId)
  expect(activities.map((a: { type: string }) => a.type)).toEqual([
    'issue-submitted',
    'response-updated',
    'response-updated',
  ])
  expect(activities[1].statusChange).toEqual({ from: 'unconfirmed', to: 'trial-planned' })
  expect(activities[2].statusChange).toEqual({ from: 'trial-planned', to: 'improved' })

  // 再読み込みしても維持される
  await page.reload()
  expect(await timelineTitles(page)).toHaveLength(3)
  await expect(page.locator('#report-issue')).toHaveValue(issueId)

  expect(errors).toEqual([])
})

test('同じ内容を保存し直しても履歴は増えない', async ({ page }) => {
  await openFresh(page)
  const issueId = await submitChairNoise(page)
  await page.goto(`/teacher/issues/${issueId}`)
  await choose(page, 'status', 'considering')
  await page.getByRole('button', { name: '変更を保存' }).click()
  await expect(page.getByText('保存しました。')).toBeVisible()
  await page.getByRole('button', { name: '変更を保存' }).click()
  await expect(page.getByText('変更がないため、保存する内容はありませんでした')).toBeVisible()
  const state = await readState(page)
  expect(state.activities.filter((a: { issueId: string }) => a.issueId === issueId)).toHaveLength(2)
})

test('初期デモデータの履歴は推測で作らない', async ({ page }) => {
  await openFresh(page, '/report?issueId=demo-issue-004')
  // 改善済みのデモ例でも「試行予定」「試行中」などの変更は挿入されない
  expect(await timelineTitles(page)).toEqual(['生徒が困りごとを投稿', '履歴の記録を始める前の状態'])
  await expect(page.getByText('日時の記録なし')).toBeVisible()
})

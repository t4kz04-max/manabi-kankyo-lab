import { expect, test } from '@playwright/test'
import { openFresh } from './helpers'

test('キーボードだけで困りごとを投稿できる', async ({ page }) => {
  await openFresh(page, '/student/new')
  await page.locator('input[name=category][value=sound]').focus()
  await page.keyboard.press('Space')
  await page.keyboard.press('Tab') // 場面
  await page.keyboard.press('Space')
  await page.keyboard.press('Tab') // 困りごとの種類
  await page.keyboard.press('Space')
  await expect(page.locator('input[name=issueType]:checked')).toHaveValue('chair-noise')

  // 選択カードにフォーカス表示が出る
  const outline = await page
    .locator('label:has(input[name=issueType]:checked)')
    .evaluate((el) => getComputedStyle(el).outlineStyle)
  expect(outline).toBe('solid')

  await page.keyboard.press('Tab')
  await expect(page.getByRole('button', { name: '内容を確認する' })).toBeFocused()
  await page.keyboard.press('Enter')
  // 確認画面では見出しにフォーカスが移る
  await expect(page.locator('#step-heading')).toBeFocused()
  await page.keyboard.press('Tab')
  await page.keyboard.press('Tab')
  await expect(page.getByRole('button', { name: 'この内容で投稿する' })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('heading', { name: '困りごとを受け付けました' })).toBeVisible()
})

test('未選択のエラーは文字とアイコンで示し、フォーカスを移す', async ({ page }) => {
  await openFresh(page, '/student/new')
  await page.getByRole('button', { name: '内容を確認する' }).click()
  const alert = page.getByRole('alert')
  await expect(alert).toBeFocused()
  await expect(alert).toContainText('まだ選んでいない項目があります')
  await expect(page.locator('#field-category-error')).toContainText('「音」か「光」かを選んでください')
})

test('確認ダイアログをキーボードで操作できる', async ({ page }) => {
  await openFresh(page)
  const trigger = page.getByRole('contentinfo').getByRole('button', { name: 'デモデータをリセット' })
  await trigger.focus()
  await page.keyboard.press('Enter')
  const dialog = page.getByRole('alertdialog')
  await expect(dialog).toBeVisible()
  // 最初は安全な「キャンセル」にフォーカスが当たる
  await expect(dialog.getByRole('button', { name: 'キャンセル' })).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(dialog.getByRole('button', { name: '初期状態に戻す' })).toBeFocused()
  // フォーカスはダイアログの外に出ない
  await page.keyboard.press('Tab')
  await expect(dialog.getByRole('button', { name: 'キャンセル' })).toBeFocused()
  // Esc で閉じ、フォーカスが元のボタンに戻る
  await page.keyboard.press('Escape')
  await expect(dialog).toHaveCount(0)
  await expect(trigger).toBeFocused()
})

test('スマートフォン幅のメニューをキーボードで開閉できる', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await openFresh(page)
  const menuButton = page.getByRole('button', { name: 'メニューを開く' })
  await menuButton.focus()
  await page.keyboard.press('Enter')
  await expect(page.locator('#mobile-navigation')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.locator('#mobile-navigation')).toBeHidden()
  await expect(page.getByRole('button', { name: 'メニューを開く' })).toBeFocused()
})

test('OS の「動きを減らす」設定ではアニメーションを止める', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await openFresh(page, '/student/new')
  const duration = await page
    .locator('#step-heading + div')
    .evaluate((el) => getComputedStyle(el).animationDuration)
  // 0.01ms は「実質アニメーションなし」（CSS の prefers-reduced-motion の規則）
  expect(['0s', '1e-05s', '0.00001s']).toContain(duration)
})

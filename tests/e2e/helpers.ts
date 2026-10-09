import { expect, type Page } from '@playwright/test'

export const STORAGE_KEY = 'manabi-kankyo-lab:demo-state'

/** 架空の入力例（docs/DEMO_SCRIPT.md と同じ） */
export const INPUT_REASON = '（架空）道具を使わずに、すぐに全員で始められるため。'
export const INPUT_RESULT =
  '（架空の結果）2週間試したところ、授業の始まりが静かになったという声がありました。'

/** 保存データを消して、初期デモデータの状態で開く */
export async function openFresh(page: Page, path = '/') {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
  await page.goto(path)
}

/** ラジオボタン（選択カード）を選ぶ */
export async function choose(page: Page, name: string, value: string) {
  await page.locator(`label:has(input[name="${name}"][value="${value}"])`).click()
}

/** 保存されているデモ状態を読む */
export async function readState(page: Page) {
  return page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key) ?? 'null'),
    STORAGE_KEY,
  )
}

/** これ以降の localStorage への保存をすべて失敗させる（ページを開き直すと元に戻る） */
export async function breakStorage(page: Page) {
  await page.evaluate(() => {
    ;(window as unknown as { __setItem: unknown }).__setItem = Storage.prototype.setItem
    Storage.prototype.setItem = function () {
      throw new DOMException('QuotaExceededError', 'QuotaExceededError')
    }
  })
}

/** breakStorage で失敗させた保存を元に戻す */
export async function restoreStorage(page: Page) {
  await page.evaluate(() => {
    Storage.prototype.setItem = (window as unknown as { __setItem: Storage['setItem'] }).__setItem
  })
}

/** 生徒として「授業の始まりに、椅子を動かす音が気になる」を投稿し、投稿IDを返す */
export async function submitChairNoise(page: Page): Promise<string> {
  await page.goto('/student/new')
  await choose(page, 'category', 'sound')
  await choose(page, 'situation', 'class-start')
  await choose(page, 'issueType', 'chair-noise')
  await page.getByRole('button', { name: '内容を確認する' }).click()
  await page.getByRole('button', { name: 'この内容で投稿する' }).click()
  await expect(page.getByRole('heading', { name: '困りごとを受け付けました' })).toBeVisible()
  const state = await readState(page)
  return state.issues.at(-1).id
}

/** 改善レポートのタイムラインの見出しを古い順に取得する（画面の表示を待ってから読む） */
export async function timelineTitles(page: Page) {
  const items = page.locator('#report-timeline-heading ~ div ol > li h3')
  await items.first().waitFor()
  return items.allTextContents()
}

/** テスト中に発生したコンソールエラーを集める */
export function collectConsoleErrors(page: Page): string[] {
  const errors: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })
  page.on('pageerror', (error) => errors.push(String(error)))
  return errors
}

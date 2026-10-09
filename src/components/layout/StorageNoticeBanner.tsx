import { CircleAlert, Info, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { StorageNotice } from '@/state/demoStateContext'
import { useDemoState } from '@/state/useDemoState'

const MESSAGES: Record<StorageNotice, { text: string; isError: boolean }> = {
  'reset-invalid': {
    text: '保存されていたデモデータを読み込めなかったため、初期状態に戻しました。',
    isError: false,
  },
  'reset-version': {
    text: 'アプリの更新で保存データの形式が変わったため、デモデータを初期状態に戻しました。',
    isError: false,
  },
  unavailable: {
    text: 'このブラウザではデータを保存できないため、投稿や対応の記録ができません。ブラウザの設定（プライベートモードなど）を確認してください。',
    isError: true,
  },
}

/** 保存データに関するお知らせ（必要なときだけヘッダーの下に表示） */
export function StorageNoticeBanner() {
  const { storageNotice, dismissStorageNotice } = useDemoState()

  return (
    <div role="status" aria-live="polite">
      {storageNotice && (
        <div
          className={
            MESSAGES[storageNotice].isError
              ? 'border-b border-destructive/30 bg-destructive/5'
              : 'border-b border-pending/50 bg-pending-soft'
          }
        >
          <div className="page-container flex items-start gap-3 py-3">
            {MESSAGES[storageNotice].isError ? (
              <CircleAlert aria-hidden="true" className="mt-[0.3em] size-5 shrink-0 text-destructive" />
            ) : (
              <Info aria-hidden="true" className="mt-[0.3em] size-5 shrink-0 text-pending-ink" />
            )}
            <p className="flex-1 text-sm font-medium sm:text-base">
              {MESSAGES[storageNotice].text}
            </p>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="-my-1.5 size-9"
              onClick={dismissStorageNotice}
            >
              <X aria-hidden="true" className="size-5" />
              <span className="sr-only">お知らせを閉じる</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

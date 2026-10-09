import { useState } from 'react'
import { RotateCcw } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { useDemoState } from '@/state/useDemoState'

/** デモデータを初期状態に戻すボタン（確認ダイアログ付き） */
export function DemoResetButton() {
  const { resetDemoState } = useDemoState()
  const [result, setResult] = useState<{ text: string; ok: boolean } | null>(null)

  const handleReset = () => {
    const result = resetDemoState()
    setResult(
      result.ok
        ? { text: 'デモデータを初期状態に戻しました。', ok: true }
        : { text: 'ブラウザに保存できなかったため、初期状態に戻せませんでした。', ok: false },
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      <AlertDialog onOpenChange={(open) => open && setResult(null)}>
        <AlertDialogTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            className="-mx-2 h-10 px-2 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            <RotateCcw aria-hidden="true" data-icon="inline-start" />
            デモデータをリセット
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>デモデータを初期状態に戻しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              新しく投稿した困りごとや、対応の編集結果はすべて消え、最初の架空データ5件に戻ります。この操作は取り消せません。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReset}
              variant="destructive"
            >
              <RotateCcw aria-hidden="true" data-icon="inline-start" />
              初期状態に戻す
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <p
        role="status"
        aria-live="polite"
        className={result?.ok === false ? 'text-xs font-bold text-destructive' : 'text-xs font-bold text-success-ink'}
      >
        {result?.text}
      </p>
    </div>
  )
}

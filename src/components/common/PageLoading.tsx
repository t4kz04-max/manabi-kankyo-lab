import { LogoMark } from '@/components/brand/LogoMark'

/** 最初の画面を読み込んでいる間の表示 */
export function PageLoading() {
  return (
    <div role="status" className="flex min-h-svh flex-col items-center justify-center gap-4 bg-background">
      <LogoMark className="size-12 animate-pulse" />
      <p className="font-bold text-muted-foreground">まなび環境ラボを読み込んでいます…</p>
    </div>
  )
}

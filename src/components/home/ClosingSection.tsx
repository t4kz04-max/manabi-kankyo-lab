import { ArrowRight, Info, Presentation } from 'lucide-react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { PATHS } from '@/routes/paths'

export function ClosingSection() {
  return (
    <section aria-labelledby="closing-title" className="page-container pb-16 sm:pb-20">
      <div className="rounded-3xl bg-primary px-6 py-10 text-primary-foreground sm:px-10 sm:py-12">
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="closing-title" className="text-2xl sm:text-3xl">
            <span className="inline-block">デモで、流れを</span>
            <span className="inline-block">体験してみましょう</span>
          </h2>
          <p className="mt-3 text-primary-foreground/90 sm:text-lg">
            生徒と先生、それぞれの立場から操作できます。
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="bg-card text-primary-ink hover:bg-secondary focus-visible:outline-card"
            >
              <Link to={PATHS.studentSubmit}>
                生徒として使う
                <ArrowRight aria-hidden="true" data-icon="inline-end" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary-foreground/70 bg-transparent text-primary-foreground hover:border-primary-foreground hover:bg-primary-hover focus-visible:outline-card"
            >
              <Link to={PATHS.teacherDashboard}>
                <Presentation aria-hidden="true" data-icon="inline-start" />
                先生として使う
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <aside
        aria-label="デモについての注意"
        className="mx-auto mt-8 flex max-w-3xl gap-3 rounded-2xl border border-border bg-card px-5 py-4 text-sm text-muted-foreground sm:text-base"
      >
        <Info aria-hidden="true" className="mt-[0.3em] size-5 shrink-0 text-primary" />
        <p>
          このアプリは、NIJIN教育万博2026 アイデアコンテスト応募用のプロトタイプです。表示される投稿や改善例は、すべて架空のデータです。
        </p>
      </aside>
    </section>
  )
}

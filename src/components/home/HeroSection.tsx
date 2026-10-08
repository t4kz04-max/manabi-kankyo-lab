import { ArrowRight, Presentation } from 'lucide-react'
import { Link } from 'react-router'
import { HeroIllustration } from '@/components/home/HeroIllustration'
import { Button } from '@/components/ui/button'
import { PATHS } from '@/routes/paths'

export function HeroSection() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative overflow-hidden border-b border-border bg-[linear-gradient(180deg,var(--secondary)_0%,var(--background)_100%)]"
    >
      <div className="page-container grid items-center gap-12 py-12 sm:py-16 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:py-24">
        <div className="space-y-7">
          <p className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-card px-4 py-1.5 text-sm font-bold text-primary-ink shadow-card">
            <span aria-hidden="true" className="size-2 rounded-full bg-success" />
            一人ひとりが学びやすい教室へ
          </p>

          <h1
            id="hero-title"
            className="text-[2rem] leading-[1.35] sm:text-5xl sm:leading-[1.3] lg:text-[3.25rem]"
          >
            <span className="inline-block">教室の「困った」を、</span>
            <span className="inline-block">
              「<span className="text-primary">変わった</span>」に。
            </span>
          </h1>

          <p className="max-w-xl text-lg text-muted-foreground sm:text-xl">
            <span className="inline-block">音や光の困りごとを伝えて、</span>
            <span className="inline-block">学校の改善につなげるWebアプリ。</span>
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link to={PATHS.studentSubmit}>
                生徒として使う
                <ArrowRight aria-hidden="true" data-icon="inline-end" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
              <Link to={PATHS.teacherDashboard}>
                <Presentation aria-hidden="true" data-icon="inline-start" />
                先生として使う
              </Link>
            </Button>
          </div>
        </div>

        <HeroIllustration />
      </div>
    </section>
  )
}

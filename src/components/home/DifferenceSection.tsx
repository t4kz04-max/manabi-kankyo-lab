import { ArrowRight, CircleHelp, MessageCircleReply } from 'lucide-react'
import { SectionHeading } from '@/components/home/SectionHeading'
import { StatusBadge } from '@/components/common/StatusBadge'
import { ISSUE_STATUSES } from '@/lib/labels'
import { STATUS_PRESENTATION } from '@/lib/status'
import { cn } from '@/lib/utils'

interface FlowColumn {
  title: string
  steps: string[]
  ending: string
  emphasized: boolean
}

const COMPARISON: FlowColumn[] = [
  {
    title: '一般的なアンケート',
    steps: ['答える', '集計される'],
    ending: 'その後どうなったかが、見えにくいことも',
    emphasized: false,
  },
  {
    title: 'まなび環境ラボ',
    steps: ['伝える', '検討・試行'],
    ending: '対応の内容と結果、理由が返ってくる',
    emphasized: true,
  },
]

export function DifferenceSection() {
  return (
    <section aria-labelledby="difference-title" className="page-container py-16 sm:py-20">
      <SectionHeading
        id="difference-title"
        eyebrow="単なるアンケートとの違い"
        title="声を集めるだけで終わらない。"
        lead="伝えた困りごとに対して、学校が何を検討し、何を試し、どうなったのか。その過程と結果を、生徒に返す仕組みです。"
        align="center"
      />

      <div className="mt-10 grid gap-4 md:mt-12 md:grid-cols-2">
        {COMPARISON.map((column) => (
          <div
            key={column.title}
            className={cn(
              'rounded-2xl p-6 sm:p-7',
              column.emphasized
                ? 'border-2 border-primary bg-card shadow-raised'
                : 'border border-border bg-muted/60',
            )}
          >
            <h3
              className={cn(
                'text-lg',
                column.emphasized ? 'text-primary-ink' : 'text-muted-foreground',
              )}
            >
              {column.title}
            </h3>
            <ol className="mt-4 flex flex-wrap items-center gap-2">
              {column.steps.map((step) => (
                <li key={step} className="flex items-center gap-2">
                  <span
                    className={cn(
                      'rounded-lg px-3 py-1.5 text-sm font-bold',
                      column.emphasized
                        ? 'bg-secondary text-secondary-foreground'
                        : 'bg-card text-muted-foreground ring-1 ring-border',
                    )}
                  >
                    {step}
                  </span>
                  <ArrowRight aria-hidden="true" className="size-4 text-muted-foreground" />
                </li>
              ))}
              <li
                className={cn(
                  'flex basis-full items-start gap-2 rounded-lg px-3 py-2 font-bold sm:basis-auto',
                  column.emphasized
                    ? 'bg-success-soft text-success-ink'
                    : 'text-muted-foreground',
                )}
              >
                {column.emphasized ? (
                  <MessageCircleReply aria-hidden="true" className="mt-[0.3em] size-5 shrink-0" />
                ) : (
                  <CircleHelp aria-hidden="true" className="mt-[0.3em] size-5 shrink-0" />
                )}
                <span className="text-phrase">{column.ending}</span>
              </li>
            </ol>
          </div>
        ))}
      </div>

      <div className="surface-card mt-6 p-6 sm:p-7">
        <h3 className="text-lg">対応状況を6つの段階で見える化</h3>
        <p className="mt-1 text-muted-foreground">
          どの段階でも、先生が判断の理由を書き添えられます。見送る場合も、理由がきちんと伝わります。
        </p>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ISSUE_STATUSES.map((status) => (
            <li
              key={status}
              className="flex flex-col items-start gap-2 rounded-xl bg-background p-4 ring-1 ring-border"
            >
              <StatusBadge status={status} />
              <span className="text-sm text-muted-foreground text-phrase">
                {STATUS_PRESENTATION[status].description}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

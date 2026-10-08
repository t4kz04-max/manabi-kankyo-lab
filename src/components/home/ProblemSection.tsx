import { Sun, Volume2, type LucideIcon } from 'lucide-react'
import { SectionHeading } from '@/components/home/SectionHeading'

interface ExampleGroup {
  category: string
  icon: LucideIcon
  examples: string[]
}

/** 仕様書に挙げられている困りごとの例 */
const EXAMPLE_GROUPS: ExampleGroup[] = [
  {
    category: '音',
    icon: Volume2,
    examples: [
      '授業の始まりに、椅子を動かす音が響いて落ち着かない',
      '集中したい時間に、周りの話し声や物音が気になる',
    ],
  },
  {
    category: '光',
    icon: Sun,
    examples: [
      '午後になると窓からの光がまぶしく、黒板が見えにくい',
      '席によっては照明がまぶしく、目が疲れやすい',
    ],
  },
]

export function ProblemSection() {
  return (
    <section
      aria-labelledby="problem-title"
      className="border-y border-border bg-card"
    >
      <div className="page-container grid gap-10 py-16 sm:py-20 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div className="space-y-5">
          <SectionHeading
            id="problem-title"
            eyebrow="このアプリが解決したいこと"
            title={
              <>
                <span className="inline-block">同じ教室でも、</span>
                <span className="inline-block">感じ方は人それぞれ。</span>
              </>
            }
          />
          <div className="max-w-xl space-y-4 text-base sm:text-lg">
            <p>
              ある人には気にならない音や光が、別の人にとっては集中を妨げる原因になることがあります。
            </p>
            <p>
              でも、「自分だけかもしれない」「わがままだと思われたくない」と感じて、なかなか言い出せないこともあります。
            </p>
            <p className="font-bold">
              まなび環境ラボは、そんな言い出しにくい困りごとを、学校が改善を考えるきっかけに変えます。
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-sm font-bold text-muted-foreground">
            たとえば、こんな困りごと
          </p>
          {EXAMPLE_GROUPS.map((group) => {
            const Icon = group.icon
            return (
              <div key={group.category} className="rounded-2xl bg-background p-5 ring-1 ring-border sm:p-6">
                <h3 className="flex items-center gap-2 text-base">
                  <span className="flex size-9 items-center justify-center rounded-xl bg-secondary text-primary-ink">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  {group.category}の困りごと
                </h3>
                <ul className="mt-3 space-y-2">
                  {group.examples.map((example) => (
                    <li key={example} className="flex gap-2.5">
                      <span
                        aria-hidden="true"
                        className="mt-[0.75em] size-1.5 shrink-0 rounded-full bg-primary"
                      />
                      <span className="text-phrase">{example}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

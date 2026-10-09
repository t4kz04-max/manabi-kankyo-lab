import { Check, Lightbulb, ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SuggestedActionListProps {
  actions: string[]
  /** 現在入力されている対応方針（一致する参考例を「選択中」と表示する） */
  currentAction: string
  onSelect: (action: string) => void
}

/**
 * 改善案の参考例。
 * 選ぶと対応方針の入力欄に文章が入るだけで、対応状況は変わらない。最終的な判断は先生が行う。
 */
export function SuggestedActionList({ actions, currentAction, onSelect }: SuggestedActionListProps) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground sm:text-base">
        困りごとの種類に合わせた、検討のための参考例です。AIが作成したものではなく、選んでも自動で採用・実行されることはありません。
      </p>
      <ul className="space-y-2">
        {actions.map((action) => {
          const selected = currentAction.trim() === action
          return (
            <li
              key={action}
              className={cn(
                'flex flex-col gap-3 rounded-xl border-2 px-4 py-3 sm:flex-row sm:items-center',
                selected ? 'border-primary bg-secondary' : 'border-border bg-card',
              )}
            >
              <span className="flex flex-1 items-start gap-2.5">
                <Lightbulb
                  aria-hidden="true"
                  className={cn('mt-[0.3em] size-5 shrink-0', selected ? 'text-primary-ink' : 'text-pending-ink')}
                />
                <span className={cn('font-bold text-phrase', selected && 'text-primary-ink')}>{action}</span>
              </span>
              <Button
                type="button"
                variant={selected ? 'secondary' : 'outline'}
                aria-pressed={selected}
                onClick={() => onSelect(action)}
                className="w-full shrink-0 sm:w-auto"
              >
                {selected ? (
                  <>
                    <Check aria-hidden="true" data-icon="inline-start" />
                    対応方針に選択中
                  </>
                ) : (
                  'この案を対応方針に使う'
                )}
              </Button>
            </li>
          )
        })}
      </ul>
      <p className="flex gap-2 rounded-xl border border-pending/60 bg-pending-soft px-4 py-3 text-sm">
        <ShieldAlert aria-hidden="true" className="mt-[0.25em] size-4 shrink-0 text-pending-ink" />
        <span>
          設備の変更や備品の使用などは、学校のルールや安全面を確認したうえで検討してください。参考例にない対応を、下の欄に直接入力することもできます。
        </span>
      </p>
    </div>
  )
}

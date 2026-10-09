import { Minus } from 'lucide-react'
import {
  IMPROVEMENT_FIELD_LABELS,
  IMPROVEMENT_TEXT_FIELDS,
} from '@/lib/improvementRules'
import type { Improvement } from '@/types/issue'

interface ReportResponseDetailsProps {
  improvement?: Improvement
}

/** 学校の対応内容（現在保存されている記録）。未入力の項目は「未入力」と明示する */
export function ReportResponseDetails({ improvement }: ReportResponseDetailsProps) {
  return (
    <dl className="space-y-4">
      {IMPROVEMENT_TEXT_FIELDS.map((field) => {
        const value = (improvement?.[field] ?? '').trim()
        return (
          <div key={field} className="border-b border-border pb-4 last:border-b-0 last:pb-0">
            <dt className="text-sm font-bold text-muted-foreground">
              {IMPROVEMENT_FIELD_LABELS[field]}
            </dt>
            <dd className="mt-1">
              {value ? (
                <span className="text-base">{value}</span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Minus aria-hidden="true" className="size-4" />
                  未入力
                </span>
              )}
            </dd>
          </div>
        )
      })}
    </dl>
  )
}

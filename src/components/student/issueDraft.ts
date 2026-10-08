import { ISSUE_TYPES_BY_CATEGORY, SITUATIONS_BY_CATEGORY } from '@/lib/labels'
import type {
  IssueCategory,
  IssueSituation,
  IssueType,
  NewIssueInput,
} from '@/types/issue'

/** 入力途中の困りごと（未選択は null） */
export interface IssueDraft {
  category: IssueCategory | null
  situation: IssueSituation | null
  issueType: IssueType | null
}

export type DraftField = keyof IssueDraft

export const EMPTY_DRAFT: IssueDraft = {
  category: null,
  situation: null,
  issueType: null,
}

/** カテゴリーを変更し、新しいカテゴリーに存在しない選択値を取り除く */
export function changeCategory(draft: IssueDraft, category: IssueCategory): IssueDraft {
  return {
    category,
    situation:
      draft.situation && SITUATIONS_BY_CATEGORY[category].includes(draft.situation)
        ? draft.situation
        : null,
    issueType:
      draft.issueType && ISSUE_TYPES_BY_CATEGORY[category].includes(draft.issueType)
        ? draft.issueType
        : null,
  }
}

export const FIELD_ERROR_MESSAGES: Record<DraftField, string> = {
  category: '「音」か「光」かを選んでください',
  situation: '困る場面を選んでください',
  issueType: '困りごとの種類を選んでください',
}

/** 未選択の項目を返す（すべて選ばれていれば空配列） */
export function getMissingFields(draft: IssueDraft): DraftField[] {
  return (Object.keys(EMPTY_DRAFT) as DraftField[]).filter((field) => draft[field] === null)
}

/** すべて選択済みなら投稿用の入力値を返す */
export function toIssueInput(draft: IssueDraft): NewIssueInput | null {
  const { category, situation, issueType } = draft
  if (!category || !situation || !issueType) return null
  return { category, situation, issueType }
}

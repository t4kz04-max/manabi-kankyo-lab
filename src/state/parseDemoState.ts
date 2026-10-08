import {
  ISSUE_CATEGORIES,
  ISSUE_SITUATIONS,
  ISSUE_STATUSES,
  ISSUE_TYPES,
  ISSUE_TYPES_BY_CATEGORY,
} from '@/lib/labels'
import type { DemoState, Improvement, Issue } from '@/types/issue'

type UnknownRecord = Record<string, unknown>

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isString = (value: unknown): value is string => typeof value === 'string'

const isDateString = (value: unknown): value is string =>
  isString(value) && !Number.isNaN(Date.parse(value))

const isOneOf = <T extends string>(
  options: readonly T[],
  value: unknown,
): value is T => isString(value) && (options as readonly string[]).includes(value)

function isIssue(value: unknown): value is Issue {
  if (!isRecord(value)) return false
  return (
    isString(value.id) &&
    value.id.length > 0 &&
    isOneOf(ISSUE_CATEGORIES, value.category) &&
    isOneOf(ISSUE_SITUATIONS, value.situation) &&
    isOneOf(ISSUE_TYPES, value.issueType) &&
    ISSUE_TYPES_BY_CATEGORY[value.category].includes(value.issueType) &&
    isOneOf(ISSUE_STATUSES, value.status) &&
    isDateString(value.createdAt) &&
    isDateString(value.updatedAt) &&
    typeof value.isDemo === 'boolean'
  )
}

function isImprovement(value: unknown): value is Improvement {
  if (!isRecord(value)) return false
  return (
    isString(value.issueId) &&
    Array.isArray(value.suggestedActions) &&
    value.suggestedActions.every(isString) &&
    (value.selectedAction === null || isString(value.selectedAction)) &&
    isString(value.teacherResponse) &&
    isString(value.decisionReason) &&
    isString(value.trialResult) &&
    isDateString(value.updatedAt) &&
    typeof value.isDemo === 'boolean'
  )
}

export type ParseResult =
  | { ok: true; state: DemoState }
  | { ok: false; reason: 'invalid' | 'version-mismatch' }

/**
 * localStorage から読み込んだ値を検証し、DemoState として扱えるか判定する。
 *
 * バージョンの扱い：
 *   保存データの version が現在の DEMO_STATE_VERSION と異なる場合は 'version-mismatch' を返し、
 *   呼び出し側で初期状態に戻す。デモ用データのため、旧バージョンからの移行（マイグレーション）は行わない。
 *   データ構造を変えるときは DEMO_STATE_VERSION を上げること。
 */
export function parseDemoState(value: unknown, expectedVersion: number): ParseResult {
  if (!isRecord(value) || typeof value.version !== 'number') {
    return { ok: false, reason: 'invalid' }
  }
  if (value.version !== expectedVersion) {
    return { ok: false, reason: 'version-mismatch' }
  }
  const { issues, improvements } = value
  if (
    !Array.isArray(issues) ||
    !issues.every(isIssue) ||
    !Array.isArray(improvements) ||
    !improvements.every(isImprovement)
  ) {
    return { ok: false, reason: 'invalid' }
  }

  // ID の重複や、存在しない投稿を参照する改善記録があれば破損とみなす
  const issueIds = new Set(issues.map((issue) => issue.id))
  const improvementIds = new Set(improvements.map((item) => item.issueId))
  if (
    issueIds.size !== issues.length ||
    improvementIds.size !== improvements.length ||
    improvements.some((item) => !issueIds.has(item.issueId))
  ) {
    return { ok: false, reason: 'invalid' }
  }

  return { ok: true, state: { version: value.version, issues, improvements } }
}

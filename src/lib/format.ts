const dateFormatter = new Intl.DateTimeFormat('ja-JP', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'Asia/Tokyo',
})

const dateTimeFormatter = new Intl.DateTimeFormat('ja-JP', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  timeZone: 'Asia/Tokyo',
})

/** ISO 8601 の日時を「2026年9月28日」の形式で表示する */
export function formatDate(iso: string): string {
  return dateFormatter.format(new Date(iso))
}

/** ISO 8601 の日時を「2026年9月28日 8:40」の形式で表示する */
export function formatDateTime(iso: string): string {
  return dateTimeFormatter.format(new Date(iso))
}

const dateTimeWithSecondsFormatter = new Intl.DateTimeFormat('ja-JP', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  second: '2-digit',
  timeZone: 'Asia/Tokyo',
})

/** ISO 8601 の日時を「2026年9月28日 8:40:12」の形式で表示する */
export function formatDateTimeWithSeconds(iso: string): string {
  return dateTimeWithSecondsFormatter.format(new Date(iso))
}

/** 分単位で同じ時刻かどうかを判定するためのキー（日本時間） */
export function minuteKey(iso: string): string {
  return formatDateTime(iso)
}

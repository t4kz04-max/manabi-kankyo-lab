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

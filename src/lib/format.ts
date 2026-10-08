const dateFormatter = new Intl.DateTimeFormat('ja-JP', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'Asia/Tokyo',
})

/** ISO 8601 の日時を「2026年9月28日」の形式で表示する */
export function formatDate(iso: string): string {
  return dateFormatter.format(new Date(iso))
}

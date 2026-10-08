import { useEffect } from 'react'

const APP_NAME = 'まなび環境ラボ'

/** ブラウザのタブに表示されるページタイトルを設定する */
export function useDocumentTitle(pageTitle?: string) {
  useEffect(() => {
    document.title = pageTitle ? `${pageTitle}｜${APP_NAME}` : APP_NAME
  }, [pageTitle])
}

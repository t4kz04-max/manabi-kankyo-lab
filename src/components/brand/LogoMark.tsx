import { cn } from '@/lib/utils'

interface LogoMarkProps {
  className?: string
}

/** ロゴマーク：吹き出し（声を伝える）の中に上向きの線（よくなる）、右上の光の粒を組み合わせた図形 */
export function LogoMark({ className }: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 40 40"
      aria-hidden="true"
      focusable="false"
      className={cn('size-10 shrink-0', className)}
    >
      <rect width="40" height="40" rx="11" fill="var(--primary)" />
      <path
        d="M14 12h12a4 4 0 0 1 4 4v6a4 4 0 0 1-4 4h-6l-5.5 4.5V26H14a4 4 0 0 1-4-4v-6a4 4 0 0 1 4-4z"
        fill="#ffffff"
      />
      <path
        d="M14.5 21.5l3.5-3.5 2.5 2.5 5-5"
        fill="none"
        stroke="var(--primary)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="30.5"
        cy="11"
        r="3.5"
        fill="var(--pending)"
        stroke="var(--primary)"
        strokeWidth="2"
      />
    </svg>
  )
}

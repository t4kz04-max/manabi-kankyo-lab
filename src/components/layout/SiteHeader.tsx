import { useEffect, useRef, useState } from 'react'
import { ChevronRight, Menu, X } from 'lucide-react'
import { Link, NavLink, useLocation } from 'react-router'
import { LogoMark } from '@/components/brand/LogoMark'
import { DemoBadge } from '@/components/common/DemoBadge'
import { NAV_SECTIONS } from '@/components/layout/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { PATHS } from '@/routes/paths'

const MOBILE_NAV_ID = 'mobile-navigation'

export function SiteHeader() {
  const { pathname } = useLocation()
  // メニューを開いた時点のパスを記録し、画面が変わったら自動で閉じた扱いにする
  const [openedAt, setOpenedAt] = useState<string | null>(null)
  const isMenuOpen = openedAt === pathname
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!isMenuOpen) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenedAt(null)
        menuButtonRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isMenuOpen])

  const closeMenu = () => setOpenedAt(null)

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/85">
      <div className="page-container flex h-16 items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <Link
            to={PATHS.home}
            className="flex min-w-0 items-center gap-2.5 rounded-xl"
            aria-label="まなび環境ラボ ホーム"
          >
            <LogoMark className="size-9 sm:size-10" />
            <span className="truncate text-base font-bold tracking-wide sm:text-lg">
              まなび環境ラボ
            </span>
          </Link>
          <DemoBadge />
        </div>

        <DesktopNav />

        <Button
          ref={menuButtonRef}
          type="button"
          variant="ghost"
          size="icon"
          className="xl:hidden"
          aria-expanded={isMenuOpen}
          aria-controls={MOBILE_NAV_ID}
          onClick={() => setOpenedAt(isMenuOpen ? null : pathname)}
        >
          {isMenuOpen ? (
            <X aria-hidden="true" className="size-6" />
          ) : (
            <Menu aria-hidden="true" className="size-6" />
          )}
          <span className="sr-only">
            {isMenuOpen ? 'メニューを閉じる' : 'メニューを開く'}
          </span>
        </Button>
      </div>

      <MobileNav isOpen={isMenuOpen} onNavigate={closeMenu} />
    </header>
  )
}

function DesktopNav() {
  return (
    <nav aria-label="メインメニュー" className="hidden xl:block">
      <ul className="flex items-center gap-1">
        {NAV_SECTIONS.map((section, index) => {
          const AudienceIcon = section.audience?.icon
          return (
            <li
              key={section.id}
              className={cn(
                'flex items-center gap-1',
                index > 0 && 'ml-2 border-l border-border pl-3',
              )}
            >
              {section.audience && AudienceIcon && (
                <span className="mr-1 inline-flex items-center gap-1 text-xs font-bold text-muted-foreground">
                  <AudienceIcon aria-hidden="true" className="size-4" />
                  {section.audience.label}
                  <span className="sr-only">向け：</span>
                </span>
              )}
              <ul className="flex items-center gap-1">
                {section.items.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.end}
                      className={({ isActive }) =>
                        cn(
                          'inline-flex h-10 items-center rounded-lg px-3 text-sm font-bold whitespace-nowrap transition-colors',
                          isActive
                            ? 'bg-secondary text-primary-ink'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                        )
                      }
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

interface MobileNavProps {
  isOpen: boolean
  onNavigate: () => void
}

function MobileNav({ isOpen, onNavigate }: MobileNavProps) {
  return (
    <nav
      id={MOBILE_NAV_ID}
      aria-label="メインメニュー"
      hidden={!isOpen}
      className="absolute inset-x-0 top-full max-h-[calc(100svh-4rem)] overflow-y-auto border-b border-border bg-card shadow-raised xl:hidden"
    >
      <div className="page-container space-y-5 py-5">
        {NAV_SECTIONS.map((section) => {
          const AudienceIcon = section.audience?.icon
          return (
            <section key={section.id} className="space-y-1.5">
              {section.audience && AudienceIcon && (
                <h2 className="flex items-center gap-1.5 px-1 text-sm text-muted-foreground">
                  <AudienceIcon aria-hidden="true" className="size-4" />
                  {section.audience.label}向け
                </h2>
              )}
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon
                  return (
                    <li key={item.to}>
                      <NavLink
                        to={item.to}
                        end={item.end}
                        onClick={onNavigate}
                        className={({ isActive }) =>
                          cn(
                            'flex min-h-12 items-center gap-3 rounded-xl px-3 font-bold transition-colors',
                            isActive
                              ? 'bg-secondary text-primary-ink'
                              : 'text-foreground hover:bg-muted',
                          )
                        }
                      >
                        <Icon aria-hidden="true" className="size-5 shrink-0" />
                        <span className="flex-1">{item.label}</span>
                        <ChevronRight
                          aria-hidden="true"
                          className="size-4 shrink-0 text-muted-foreground"
                        />
                      </NavLink>
                    </li>
                  )
                })}
              </ul>
            </section>
          )
        })}
        <p className="rounded-xl bg-muted px-4 py-3 text-sm text-muted-foreground">
          このアプリは、架空のデータを使ったデモ版です。
        </p>
      </div>
    </nav>
  )
}

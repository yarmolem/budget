'use client'

import Link from 'next/link'
import Image from 'next/image'
import { forwardRef, Fragment, useState } from 'react'
import { usePathname } from 'next/navigation'

import { Card } from '../ui/card'
import { Badge } from '../ui/badge'
import { ScrollArea } from '../ui/scroll-area'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '../ui/collapsible'

import { cn } from '@/lib/utils'
import {
  siteConfig,
  mainNavigation,
  SIDEBAR_WIDTH,
  type NavigationItem
} from '@/config'
import { Sheet, SheetContent } from '../ui/sheet'
import { MenuIcon } from 'lucide-react'
import { Button } from '../ui/button'
import { IconMenu2 } from '@tabler/icons-react'

export const SidebarLink = forwardRef<
  React.ElementRef<typeof Link>,
  { item: NavigationItem; onClick?: () => void }
>((props, ref) => {
  const pathname = usePathname()
  const isActive = pathname === props.item.href

  return (
    <Link
      ref={ref}
      href={props.item.href}
      onClick={props.onClick}
      className={cn(
        'group relative mx-3 my-0.5 flex items-center justify-between rounded-md px-3 py-2 font-medium capitalize lg:my-1 2xl:mx-5 2xl:my-2',
        isActive
          ? 'before:top-2/5 text-primary before:absolute before:-start-3 before:block before:h-4/5 before:w-1 before:rounded-ee-md before:rounded-se-md before:bg-primary 2xl:before:-start-5'
          : 'text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground'
      )}
    >
      <div className="flex items-center truncate">
        {props.item.icon && (
          <span
            className={cn(
              'me-2 inline-flex h-5 w-5 items-center justify-center rounded-md transition-colors duration-200 [&>svg]:h-[20px] [&>svg]:w-[20px]',
              isActive
                ? 'text-primary'
                : 'text-muted-foreground group-hover:text-foreground'
            )}
          >
            {props.item.icon}
          </span>
        )}
        <span className="truncate">{props.item.title}</span>
      </div>
      {props.item.badge?.length ? <Badge>{props.item.badge}</Badge> : null}
    </Link>
  )
})

SidebarLink.displayName = 'SidebarLink'

export const SidebarLinkChild = forwardRef<
  React.ElementRef<typeof Link>,
  { item: Omit<NavigationItem, 'icon'>; onClick?: () => void }
>((props, ref) => {
  const pathname = usePathname()
  const isChildActive = pathname === props.item.href

  return (
    <Link
      ref={ref}
      href={props.item.href}
      onClick={props.onClick}
      className={cn(
        'group mx-3.5 mb-0.5 flex items-center justify-between rounded-md px-2.5 py-2 font-medium capitalize last-of-type:mb-1 lg:last-of-type:mb-2 2xl:mx-5 2xl:px-3.5',
        isChildActive
          ? 'text-primary'
          : 'text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground'
      )}
    >
      <div className="flex items-center truncate">
        <span
          className={cn(
            'me-[18px] ms-2 inline-flex h-1 w-1 rounded-full bg-current transition-all duration-200',
            isChildActive
              ? 'bg-primary ring-[1px] ring-primary'
              : 'opacity-40 group-hover:bg-gray-700'
          )}
        />{' '}
        <span className="truncate">{props.item.title}</span>
      </div>
      {props.item.badge?.length ? <Badge>{props.item.badge}</Badge> : null}
    </Link>
  )
})

SidebarLinkChild.displayName = 'SidebarLinkChild'

export const SidebarContent = ({
  className,
  isMobile,
  onLinkClick
}: {
  isMobile?: boolean
  className?: string
  onLinkClick?: () => void
}) => {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        isMobile && 'h-full w-full',
        !isMobile && 'lg:pl-5 lg:py-5 h-screen w-[var(--sidebar-width)]',
        className
      )}
    >
      <div className="h-full flex flex-col">
        <Card
          className={cn(
            'flex-1 bg-card p-1.5 pl-0 pr-1.5 lg:rounded-2xl',
            isMobile && 'shadow-none border-none '
          )}
        >
          <div className="sticky top-0 z-40 flex justify-center px-6 pb-5 pt-5 2xl:px-8 2xl:pt-6">
            <Link href="/dashboard" aria-label="Site Logo">
              <Image
                priority
                width={58}
                height={35}
                alt={siteConfig.title}
                src="/logo-short.svg"
              />
            </Link>
          </div>

          <ScrollArea className="h-[calc(100%-80px)] text-sm">
            <div className="mt-4 pb-3 3xl:mt-6">
              {mainNavigation.map((item, index) => {
                if ('href' in item && !('children' in item)) {
                  return (
                    <SidebarLink
                      key={item.id}
                      item={item}
                      onClick={onLinkClick}
                    />
                  )
                }

                if ('href' in item && 'children' in item) {
                  const isDropdownOpen = Boolean(item.href === pathname)

                  return (
                    <Fragment key={item.id}>
                      <Collapsible open={isDropdownOpen}>
                        <CollapsibleTrigger asChild>
                          <SidebarLink item={item} onClick={onLinkClick} />
                        </CollapsibleTrigger>

                        <CollapsibleContent>
                          {item?.children?.map((child) => (
                            <SidebarLinkChild
                              key={child?.id}
                              item={child}
                              onClick={onLinkClick}
                            />
                          ))}
                        </CollapsibleContent>
                      </Collapsible>
                    </Fragment>
                  )
                }

                return (
                  <p
                    key={item.id}
                    className={cn(
                      'mb-2 truncate px-6 text-xs font-normal uppercase tracking-widest text-muted-foreground 2xl:px-8',
                      index !== 0 && 'mt-6 3xl:mt-7'
                    )}
                  >
                    {item.title}
                  </p>
                )
              })}
            </div>
          </ScrollArea>
        </Card>
      </div>
    </aside>
  )
}

export const SidebarDesktop = () => (
  <SidebarContent className="fixed hidden lg:block bottom-0 start-0 z-50" />
)

export const SidebarMobile = ({
  open,
  setOpen
}: {
  open: boolean
  setOpen: (open: boolean) => void
}) => {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="px-0 py-0" side="left">
        <SidebarContent isMobile onLinkClick={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  )
}

export function Sidebar({ children }: { children?: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <main
        style={
          {
            '--sidebar-width': `${SIDEBAR_WIDTH}px`
          } as React.CSSProperties
        }
        className="h-screen flex flex-col"
      >
        <SidebarDesktop />
        <SidebarMobile open={open} setOpen={setOpen} />

        <ScrollArea className="flex-1 lg:ml-[var(--sidebar-width)]">
          <Button size="icon" variant="ghost" onClick={() => setOpen(true)}>
            <IconMenu2 className="h-4 w-4" />
          </Button>
          {children}
        </ScrollArea>
      </main>
    </>
  )
}

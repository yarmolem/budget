'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  Fragment,
  useState,
  forwardRef,
  useContext,
  createContext
} from 'react'

import { Card } from '../ui/card'
import { Badge } from '../ui/badge'
import { ScrollArea } from '../ui/scroll-area'
import { Sheet, SheetContent } from '../ui/sheet'

import { cn } from '@/lib/utils'
import {
  siteConfig,
  mainNavigation,
  SIDEBAR_WIDTH,
  type NavigationItem
} from '@/config'
import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionWithoutIconTrigger
} from '../ui/accordion'
import { IconChevronDown } from '@tabler/icons-react'

interface SidebarCtxType {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export const SidebarCtx = createContext<SidebarCtxType>({
  isOpen: false,
  setIsOpen: () => {}
})

export const SidebarProvider = ({
  children
}: {
  children: React.ReactNode
}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <SidebarCtx.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </SidebarCtx.Provider>
  )
}

export const useSidebar = () => useContext(SidebarCtx)

export const SidebarLink = forwardRef<
  React.ElementRef<typeof Link>,
  { item: NavigationItem; onClick?: () => void; rightIcon?: React.ReactNode }
>((props, ref) => {
  const pathname = usePathname()
  const isActive = pathname === props.item.href

  return (
    <>
      <h3>
        <Link
          ref={ref}
          href={props.item.href}
          onClick={props.onClick}
          className={cn(
            'group/link relative mx-3 my-0.5 flex items-center justify-between rounded-md px-3 py-2 font-medium capitalize lg:my-1 2xl:mx-5 2xl:my-2',
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
                    : 'text-muted-foreground group-hover/link:text-foreground'
                )}
              >
                {props.item.icon}
              </span>
            )}
            <span className="truncate">{props.item.title}</span>
            {props.rightIcon}
          </div>
          {props.item.badge?.length ? <Badge>{props.item.badge}</Badge> : null}
        </Link>
      </h3>
    </>
  )
})
SidebarLink.displayName = 'SidebarLink'

export const SidebarLinkAccordion = forwardRef<
  React.ElementRef<typeof Link>,
  { item: NavigationItem; onClick?: () => void; rightIcon?: React.ReactNode }
>((props, ref) => {
  const pathname = usePathname()
  const isActive = pathname === props.item.href

  return (
    <>
      <Link
        ref={ref}
        href={props.item.href}
        onClick={props.onClick}
        className={cn(
          'group/link relative mx-3 w-full flex items-center justify-between rounded-md px-3 py-2 font-medium capitalize 2xl:mx-5',
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
                  : 'text-muted-foreground group-hover/link:text-foreground'
              )}
            >
              {props.item.icon}
            </span>
          )}
          <span className="truncate">{props.item.title}</span>
        </div>

        <IconChevronDown className="w-4 h-4 transition-transform duration-200" />
        {props.item.badge?.length ? <Badge>{props.item.badge}</Badge> : null}
      </Link>
    </>
  )
})
SidebarLinkAccordion.displayName = 'SidebarLinkAccordion'

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
  const [accordionValue, setAccordionValue] = useState<string | null>(null)

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
          <div className="sticky top-0 z-40 flex justify-center px-6 pt-5 2xl:px-8 2xl:pt-6">
            <Link href="/dashboard" aria-label="Site Logo">
              <Image
                priority
                width={100}
                height={100}
                alt={siteConfig.title}
                src="/logo.png"
              />
            </Link>
          </div>

          <ScrollArea className="h-[calc(100%-80px)] text-sm">
            <Accordion
              type="single"
              collapsible
              onValueChange={setAccordionValue}
              value={accordionValue ?? undefined}
            >
              <div className="mt-4 pb-3 3xl:mt-6">
                {mainNavigation.map((item, index) => {
                  if ('href' in item && !('children' in item)) {
                    return (
                      <SidebarLink
                        key={item.id}
                        item={item}
                        onClick={() => {
                          setAccordionValue(item.href)
                          onLinkClick?.()
                        }}
                      />
                    )
                  }

                  if ('href' in item && 'children' in item) {
                    return (
                      <Fragment key={item.id}>
                        <AccordionItem
                          value={item.href}
                          className="border-none"
                        >
                          <AccordionWithoutIconTrigger asChild>
                            <SidebarLinkAccordion item={item} />
                          </AccordionWithoutIconTrigger>

                          <AccordionContent className="pb-0 pt-1">
                            {item?.children?.map((child) => (
                              <SidebarLinkChild
                                key={child?.id}
                                item={child}
                                onClick={onLinkClick}
                              />
                            ))}
                          </AccordionContent>
                        </AccordionItem>
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
            </Accordion>
          </ScrollArea>
        </Card>
      </div>
    </aside>
  )
}

export const SidebarDesktop = () => (
  <SidebarContent className="fixed hidden lg:block bottom-0 start-0 z-50" />
)

export const SidebarMobile = () => {
  const { isOpen, setIsOpen } = useSidebar()

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="px-0 py-0" side="left">
        <SidebarContent isMobile onLinkClick={() => setIsOpen(false)} />
      </SheetContent>
    </Sheet>
  )
}

export function Sidebar({ children }: { children?: React.ReactNode }) {
  return (
    <>
      <SidebarProvider>
        <main
          style={
            {
              '--sidebar-width': `${SIDEBAR_WIDTH}px`
            } as React.CSSProperties
          }
          className="h-screen flex flex-col"
        >
          <SidebarDesktop />
          <SidebarMobile />

          <ScrollArea className="flex-1 lg:ml-[var(--sidebar-width)]">
            {children}
          </ScrollArea>
        </main>
      </SidebarProvider>
    </>
  )
}

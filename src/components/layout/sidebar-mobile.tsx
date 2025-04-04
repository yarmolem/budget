'use client'

import { MenuIcon } from 'lucide-react'
import { signOut } from 'next-auth/react'

import { Logo } from '../shared/logo'
import { Button } from '../ui/button'
import { useTranslation } from '@/hooks/use-translation'
import { SidebarContent } from '../shared/sidebar-content'
import {
  Sheet,
  SheetFooter,
  SheetHeader,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription
} from '../ui/sheet'
import { useState } from 'react'
import LanguageSwitcher from '../shared/language-switcher'

interface SidebarProps {
  className?: string
}

export function SidebarMobile(props: SidebarProps) {
  const { t } = useTranslation('sidebar')
  const [show, setShow] = useState(false)

  return (
    <Sheet open={show} onOpenChange={setShow}>
      <SheetTrigger asChild className={props.className}>
        <Button size="icon" variant="outline" className="flex md:hidden">
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col max-w-sm">
        <SheetHeader className="pt-8">
          <SheetTitle className="sr-only">Navegation</SheetTitle>
          <SheetDescription className="sr-only">
            Sidebar to navigate through the app
          </SheetDescription>
          <Logo />
        </SheetHeader>
        <div className="flex-1 px-4">
          <SidebarContent onClose={() => setShow(false)} />
        </div>
        <SheetFooter className="pt-0">
          <LanguageSwitcher />
          <Button
            className="w-full"
            variant="destructive"
            onClick={() => void signOut()}
          >
            {t('logout')}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

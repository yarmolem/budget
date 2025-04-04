'use client'

import { signOut } from 'next-auth/react'

import { cn } from '@/lib/utils'
import { Logo } from '../shared/logo'
import { Button } from '../ui/button'
import { SidebarContent } from '../shared/sidebar-content'
import { useTranslation } from '@/hooks/use-translation'
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card'
import LanguageSwitcher from '../shared/language-switcher'

export interface SidebarProps {
  className?: string
}

export function SidebarDesktop(props: SidebarProps) {
  const { t } = useTranslation('sidebar')

  return (
    <aside
      className={cn('hidden h-screen w-64 py-3 pl-3 md:block', props.className)}
    >
      <Card className="relative flex h-full flex-col gap-4 py-4">
        <CardHeader className="pt-4">
          <Logo />
        </CardHeader>

        <CardContent className="px-4 flex-1 flex flex-col">
          <SidebarContent />
        </CardContent>

        <CardFooter className="mt-auto flex-col space-y-2 px-4 pb-0 pt-0">
          <LanguageSwitcher />
          <Button
            className="w-full"
            variant="destructive"
            onClick={() => void signOut()}
          >
            {t('logout')}
          </Button>
        </CardFooter>
      </Card>
    </aside>
  )
}

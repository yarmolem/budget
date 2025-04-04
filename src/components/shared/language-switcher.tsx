'use client'

import React from 'react'
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger
} from '../ui/select'
import { useLanguageCtx } from '../providers'
import { useRouter, usePathname } from 'next/navigation'

const LanguageSwitcher = () => {
  const router = useRouter()
  const pathname = usePathname()
  const { lng } = useLanguageCtx()

  return (
    <>
      <Select
        defaultValue={lng ?? 'en'}
        onValueChange={(value) => {
          const path = pathname.split('/')
          path[1] = value
          router.push(`${path.join('/')}`)
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="English" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">English</SelectItem>
          <SelectItem value="es">Español</SelectItem>
        </SelectContent>
      </Select>
    </>
  )
}

export default LanguageSwitcher

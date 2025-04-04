import { PieChart, type LucideProps, List, Euro, Tag } from 'lucide-react'

export interface NavItem {
  title: string
  href?: string
  disabled?: boolean
  external?: boolean
  description?: string
  icon?: (props: LucideProps) => React.ReactNode
}

export const items: NavItem[] = [
  {
    href: '/',
    icon: PieChart,
    title: 'dashboard'
  },
  {
    icon: Euro,
    href: '/transactions',
    title: 'transactions'
  },
  {
    icon: List,
    href: '/categories',
    title: 'categories'
  },
  {
    icon: Tag,
    href: '/tags',
    title: 'tags'
  }
]

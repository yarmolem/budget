import {
  IconActivity,
  IconCalendar,
  IconDashboard,
  IconUsers
} from '@tabler/icons-react'

export interface NavigationLabel {
  id: string
  title: string
}

export interface NavigationItem {
  id: string
  href: string
  title: string
  icon: React.ReactNode
  badge?: string
  children?: Omit<NavigationItem, 'icon'>[]
}

type MainNavigation = NavigationLabel | NavigationItem

export const SIDEBAR_WIDTH = 284

export const mainNavigation: MainNavigation[] = [
  {
    id: 'categories',
    title: 'Categorías'
  },
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: <IconDashboard />,
    href: '/dashboard'
  },
  {
    id: 'users',
    title: 'Usuarios',
    icon: <IconUsers />,
    href: '/dashboard/users',
    children: [
      {
        id: 'users-list',
        title: 'Listado',
        href: '/dashboard/users'
      },
      {
        id: 'users-create',
        title: 'Crear',
        href: '/dashboard/users/new'
      }
    ]
  },
  {
    id: 'activity',
    title: 'Actividad',
    href: '/dashboard/activity',
    icon: <IconActivity />
  },
  {
    id: 'calendar',
    title: 'Calendario',
    href: '/dashboard/calendar',
    icon: <IconCalendar />
  }
]

export const siteConfig = {
  title: 'Budget App',
  description: 'Budget App'
}

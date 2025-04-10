import React, { Fragment } from 'react'
import ReactPaginate from 'react-paginate'
import {
  PlusIcon,
  SearchIcon,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal
} from 'lucide-react'

import { Input } from '../ui/input'
import { DataTable } from './data-table'
import { CardTitle, CardFooter, CardHeader, CardContent } from '../ui/card'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '../ui/breadcrumb'

import { Button, buttonVariants } from '../ui/button'

import type { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from '@/hooks/use-translation'

type BreadcrumbOptions = {
  id: string
  href?: string
  title: string
}

type Props<T extends object> = {
  data: T[]
  title: string
  description?: string
  isLoading?: boolean
  columns: ColumnDef<T>[]
  pageCount: number
  breadcrumb?: BreadcrumbOptions[]
  onAdd?: () => void
  onChangeText?: (value: string) => void
  onPageChange?: (selected: number) => void
}

const buttonProps = buttonVariants({ size: 'icon', variant: 'ghost' })
const activeButtonProps = buttonVariants({ size: 'icon', variant: 'outline' })

const PageDataTable = <T extends object>(props: Props<T>) => {
  const { t } = useTranslation('common')
  return (
    <>
      <div className="flex h-full w-full flex-1 flex-col space-y-4">
        <CardHeader className="gap-0 px-0">
          <CardTitle className="text-4xl font-bold">{props.title}</CardTitle>
          {props.breadcrumb && (
            <Breadcrumb>
              <BreadcrumbList>
                {props.breadcrumb?.map((item) => {
                  if (item.href) {
                    return (
                      <Fragment key={item.id}>
                        <BreadcrumbItem>
                          <BreadcrumbLink href={item.href}>
                            {item.title}
                          </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                      </Fragment>
                    )
                  }

                  return (
                    <BreadcrumbItem key={item.id}>
                      <BreadcrumbPage>{item.title}</BreadcrumbPage>
                    </BreadcrumbItem>
                  )
                })}
              </BreadcrumbList>
            </Breadcrumb>
          )}
        </CardHeader>

        <CardContent className="flex flex-col justify-between space-y-3 px-0 md:flex-row md:space-y-0">
          <Input
            className="w-full md:max-w-72"
            placeholder={t('placeholder_search')}
            leftIcon={<SearchIcon className="w-5" />}
            defaultValue=""
            onChange={(e) => props.onChangeText?.(e.target.value)}
          />

          <Button onClick={props.onAdd}>
            <PlusIcon className="h-4 w-4" />
            {t('add')}
          </Button>
        </CardContent>

        <CardContent className="flex-1 px-0">
          <DataTable
            data={props.data}
            columns={props.columns}
            isLoading={props.isLoading}
          />
        </CardContent>

        <CardFooter className="flex px-0">
          <ReactPaginate
            onPageChange={(select) => {
              props.onPageChange?.(select.selected + 1)
            }}
            pageCount={props.pageCount}
            pageRangeDisplayed={3}
            renderOnZeroPageCount={null}
            className="ml-auto flex flex-row"
            pageLinkClassName={buttonProps}
            nextLinkClassName={buttonProps}
            previousLinkClassName={buttonProps}
            activeLinkClassName={activeButtonProps}
            breakLinkClassName={buttonProps}
            nextLabel={<ChevronRight className="h-4 w-4" />}
            previousLabel={<ChevronLeft className="h-4 w-4" />}
            breakLabel={<MoreHorizontal className="h-4 w-4" />}
          />
        </CardFooter>
      </div>
    </>
  )
}

export default PageDataTable

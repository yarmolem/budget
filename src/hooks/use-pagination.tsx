import { useState } from 'react'

const usePagination = () => {
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10
  })

  return {
    ...pagination,
    nextPage: () => {
      setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
    },
    previousPage: () => {
      setPagination((prev) => ({
        ...prev,
        page: prev.page === 1 ? 1 : prev.page - 1
      }))
    },
    setPage: (page: number) => {
      setPagination((prev) => ({ ...prev, page }))
    },
    setPageSize: (pageSize: number) => {
      setPagination((prev) => ({ ...prev, pageSize }))
    },
    getCanPreviousPage: () => {
      return pagination.page > 1
    },
    getCanNextPage: (pageCount: number) => {
      return pagination.page < pageCount
    },
    setLastPage: (pageCount: number) => {
      setPagination((prev) => ({
        ...prev,
        page: pageCount
      }))
    },
    getPageCount: (totalItems: number) => {
      return Math.ceil(totalItems / pagination.pageSize)
    }
  }
}

export { usePagination }

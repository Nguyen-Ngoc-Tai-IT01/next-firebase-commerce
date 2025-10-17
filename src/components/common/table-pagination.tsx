"use client"
import React, { useMemo } from "react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { usePathname, useSearchParams } from "next/navigation"

interface IProps {
  total: number
}

const TablePagination = ({ total }: IProps) => {
  const searchParams = useSearchParams()
  const size = 5 // số item mỗi trang
  const page = useMemo(() => Number(searchParams.get("page") || 1), [searchParams])
  const pathname = usePathname()

  const totalPage = Math.ceil(total / size)

  // Lấy toàn bộ query param hiện tại (bao gồm keyword)
  const paramsObj = useMemo(() => {
    const obj: Record<string, string> = {}
    searchParams.forEach((value, key) => {
      obj[key] = value
    })
    return obj
  }, [searchParams])

  // Hàm tạo URL mới giữ nguyên query cũ + đổi page
  const createPageUrl = (p: number) => {
    const newParams = new URLSearchParams(paramsObj)
    newParams.set("page", String(p))
    return `${pathname}?${newParams.toString()}`
  }

  // Tính mảng các trang lân cận
  const nearPageArray = useMemo(() => {
    const min = page - 2 > 0 ? page - 2 : 1
    const max = page + 2 < totalPage ? page + 2 : totalPage
    return Array.from({ length: max - min + 1 }).map((_, index) => min + index)
  }, [page, totalPage])

  // Bây giờ check sau khi đã gọi hooks
  if (totalPage <= 1) return null

  return (
    <Pagination>
      <PaginationContent>
        {page > 1 && (
          <PaginationItem>
            <PaginationPrevious href={createPageUrl(page - 1)} />
          </PaginationItem>
        )}

        {nearPageArray.map((p) => (
          <PaginationItem key={p}>
            <PaginationLink
              href={createPageUrl(p)}
              isActive={page === p}
            >
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}

        {page < totalPage && (
          <PaginationItem>
            <PaginationNext href={createPageUrl(page + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  )
}

export default TablePagination

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Check, Clock, ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination"
import { useGetBorrowRecordByUserId } from "@/hooks/api/borrow-record/use-getBorrowRecordByUserId"

// Define sort types
type SortDirection = "asc" | "desc" | null
type SortColumn =
  | "bookTitle"
  | "bookAuthor"
  | "userName"
  | "userEmail"
  | "borrowDate"
  | "dueDate"
  | "returnDate"
  | "isReturned"
  | "isOverdue"
  | null

const DatePicker = ({ date, onChange }: { date: Date | undefined; onChange: (date: Date | undefined) => void }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[180px] justify-start text-left font-normal">
          {date ? format(date, "dd/MM/yyyy") : <span>Chọn ngày</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={date} onSelect={onChange} initialFocus />
      </PopoverContent>
    </Popover>
  )
}

const BorrowRecordListByUserId = () => {
  const { fetchBorrowRecordByUserId, borrowRecords, loading } = useGetBorrowRecordByUserId()

  console.log("fetchBorrowRecordByUserId",fetchBorrowRecordByUserId)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [isReturnedFilter, setIsReturnedFilter] = useState<string>("all")
  const [overdueFilter, setOverdueFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Sorting states
  const [sortColumn, setSortColumn] = useState<SortColumn>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)

  useEffect(() => {
    fetchBorrowRecordByUserId()
  }, [])

  const getReturnBadge = (isReturned: boolean) => {
    return isReturned ? (
      <Badge className="bg-green-50 text-green-700 border-green-200">
        <Check className="mr-1 h-3 w-3" /> Đã trả
      </Badge>
    ) : (
      <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">
        <Clock className="mr-1 h-3 w-3" /> Chưa trả
      </Badge>
    )
  }
  const getOverdueStatus = (record: any) => {
    const dueDate = new Date(record.due_date)
    let isOverdue = false

    if (!record.is_returned) {
      isOverdue = new Date() > dueDate
    } else if (record.return_date) {
      const returnDate = new Date(record.return_date)
      isOverdue = returnDate > dueDate
    }

    return {
      isOverdue,
      label: isOverdue ? "Quá hạn" : "Đúng hạn",
      statusClass: isOverdue ? "text-red-500" : "text-green-500",
    }
  }

  // Handle column sort
  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      // Toggle direction if same column
      setSortDirection(sortDirection === "asc" ? "desc" : sortDirection === "desc" ? null : "asc")
      if (sortDirection === "desc") {
        setSortColumn(null)
      }
    } else {
      // Set new column and default to ascending
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  // Get sort icon based on current sort state
  const getSortIcon = (column: SortColumn) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />
    }

    if (sortDirection === "asc") {
      return <ArrowUp className="ml-1 h-4 w-4" />
    }

    if (sortDirection === "desc") {
      return <ArrowDown className="ml-1 h-4 w-4" />
    }

    return <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />
  }

  // Filter records
  const filteredRecords = borrowRecords.filter((record) => {
    const searchLower = searchTerm.toLowerCase()
    const bookTitle = record.book_id?.title?.toLowerCase() || ""
    const bookAuthor = record.book_id?.author?.toLowerCase() || ""
    const userName = record.user_id?.full_name?.toLowerCase() || ""
    const userEmail = record.user_id?.email?.toLowerCase() || ""
    const borrowDate = new Date(record.borrow_date)

    const matchesSearch =
      bookTitle.includes(searchLower) ||
      bookAuthor.includes(searchLower) ||
      userName.includes(searchLower) ||
      userEmail.includes(searchLower)

    const inDateRange = (!startDate || borrowDate >= startDate) && (!endDate || borrowDate <= endDate)

    const matchesReturnStatus =
      isReturnedFilter === "all" ||
      (isReturnedFilter === "returned" && record.is_returned === true) ||
      (isReturnedFilter === "not_returned" && !record.is_returned)

    const { isOverdue } = getOverdueStatus(record)
    const matchesOverdueStatus =
      overdueFilter === "all" ||
      (overdueFilter === "overdue" && isOverdue) ||
      (overdueFilter === "on_time" && !isOverdue)

    return matchesSearch && inDateRange && matchesReturnStatus && matchesOverdueStatus
  })

  // Sort records
  const sortedRecords = [...filteredRecords].sort((a, b) => {
    if (!sortColumn || !sortDirection) return 0

    const direction = sortDirection === "asc" ? 1 : -1

    switch (sortColumn) {
      case "bookTitle":
        return ((a.book_id?.title || "") > (b.book_id?.title || "") ? 1 : -1) * direction
      case "bookAuthor":
        return ((a.book_id?.author || "") > (b.book_id?.author || "") ? 1 : -1) * direction
      case "userName":
        return ((a.user_id?.full_name || "") > (b.user_id?.full_name || "") ? 1 : -1) * direction
      case "userEmail":
        return ((a.user_id?.email || "") > (b.user_id?.email || "") ? 1 : -1) * direction
      case "borrowDate":
        return (new Date(a.borrow_date).getTime() - new Date(b.borrow_date).getTime()) * direction
      case "dueDate":
        return (new Date(a.due_date).getTime() - new Date(b.due_date).getTime()) * direction
      case "returnDate":
        // Handle null return dates
        if (!a.return_date && !b.return_date) return 0
        if (!a.return_date) return 1 * direction
        if (!b.return_date) return -1 * direction
        return (new Date(a.return_date).getTime() - new Date(b.return_date).getTime()) * direction
      case "isReturned":
        return ((a.is_returned ? 1 : 0) - (b.is_returned ? 1 : 0)) * direction
      case "isOverdue":
        return ((getOverdueStatus(a).isOverdue ? 1 : 0) - (getOverdueStatus(b).isOverdue ? 1 : 0)) * direction
      default:
        return 0
    }
  })

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = sortedRecords.slice(indexOfFirstItem, indexOfLastItem)

  const handlePageChange = (page: number) => setCurrentPage(page)

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value))
    setCurrentPage(1)
  }

  const resetFilters = () => {
    setSearchTerm("")
    setStartDate(undefined)
    setEndDate(undefined)
    setIsReturnedFilter("not_returned")
    setOverdueFilter("all")
    setSortColumn(null)
    setSortDirection(null)
    setCurrentPage(1)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Đang tải dữ liệu...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-4">
      <h2 className="text-2xl font-bold mb-4">Lịch sử mượn - trả sách</h2>

      <div className="mb-4 flex justify-between items-center w-full">
        <Input
          type="text"
          placeholder="Tìm kiếm theo tên sách, tác giả, người mượn, email..."
          className="w-full max-w-xl px-4 py-2 border rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button onClick={resetFilters} className="ml-4 bg-red-500 hover:bg-red-600 text-white">
          Xóa lọc tất cả
        </Button>
      </div>

      <div className="flex flex-wrap justify-between gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <DatePicker date={startDate} onChange={setStartDate} />
          <span>-</span>
          <DatePicker date={endDate} onChange={setEndDate} />
        </div>

        <div className="flex items-center space-x-2">
          <label htmlFor="isReturnedFilter">Trạng thái đã trả:</label>
          <select
            id="isReturnedFilter"
            value={isReturnedFilter}
            onChange={(e) => setIsReturnedFilter(e.target.value)}
            className="px-4 py-2 border rounded-md"
          >
            <option value="all">Tất cả</option>
            <option value="returned">Đã trả</option>
            <option value="not_returned">Chưa trả</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <label htmlFor="overdueFilter">Trạng thái quá hạn:</label>
          <select
            id="overdueFilter"
            value={overdueFilter}
            onChange={(e) => setOverdueFilter(e.target.value)}
            className="px-4 py-2 border rounded-md"
          >
            <option value="all">Tất cả</option>
            <option value="overdue">Quá hạn</option>
            <option value="on_time">Đúng hạn</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <label htmlFor="itemsPerPage">Số mục mỗi trang:</label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="px-4 py-2 border rounded-md"
          >
            {[5, 10, 15, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      {currentItems.length > 0 ? (
        <div className="rounded-md border overflow-hidden mb-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer hover:bg-gray-100" onClick={() => handleSort("bookTitle")}>
                    <div className="flex items-center">
                      Tên sách
                      {getSortIcon("bookTitle")}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-gray-100" onClick={() => handleSort("bookAuthor")}>
                    <div className="flex items-center">
                      Tác giả
                      {getSortIcon("bookAuthor")}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-gray-100" onClick={() => handleSort("userName")}>
                    <div className="flex items-center">
                      Người mượn
                      {getSortIcon("userName")}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-gray-100" onClick={() => handleSort("userEmail")}>
                    <div className="flex items-center">
                      Email
                      {getSortIcon("userEmail")}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-gray-100" onClick={() => handleSort("borrowDate")}>
                    <div className="flex items-center">
                      Ngày mượn
                      {getSortIcon("borrowDate")}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-gray-100" onClick={() => handleSort("dueDate")}>
                    <div className="flex items-center">
                      Ngày hết hạn
                      {getSortIcon("dueDate")}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-gray-100" onClick={() => handleSort("returnDate")}>
                    <div className="flex items-center">
                      Ngày trả
                      {getSortIcon("returnDate")}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-gray-100" onClick={() => handleSort("isReturned")}>
                    <div className="flex items-center">
                      Trạng thái
                      {getSortIcon("isReturned")}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-gray-100" onClick={() => handleSort("isOverdue")}>
                    <div className="flex items-center">
                      Quá hạn/Đúng hạn
                      {getSortIcon("isOverdue")}
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.map((record) => {
                  const overdueStatus = getOverdueStatus(record)
                  return (
                    <TableRow key={record._id}>
                      <TableCell>{record.book_id?.title || "Không rõ"}</TableCell>
                      <TableCell>{record.book_id?.author || "Không rõ"}</TableCell>
                      <TableCell>
                        {record.user_id?.full_name || "Không rõ"}
                        {record.user_id?.identity_number ? `_${record.user_id.identity_number}` : ""}
                      </TableCell>
                      <TableCell>{record.user_id?.email || "Không rõ"}</TableCell>
                      <TableCell>{new Date(record.borrow_date).toLocaleString()}</TableCell>
                      <TableCell>{new Date(record.due_date).toLocaleString()}</TableCell>
                      <TableCell>{record.return_date ? new Date(record.return_date).toLocaleString() : "-"}</TableCell>
                      <TableCell className="flex items-center gap-2">
                        {getReturnBadge(record.is_returned)}
                      </TableCell>
                      <TableCell className={overdueStatus.statusClass}>{overdueStatus.label}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-md border mt-4">
          <p className="text-muted-foreground">Không có bản ghi nào.</p>
        </div>
      )}

      {/* Pagination controls */}
      <Pagination>
        {currentPage > 1 && <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} />}
        <PaginationContent>
          {Array.from({ length: Math.ceil(sortedRecords.length / itemsPerPage) }).map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink isActive={i + 1 === currentPage} onClick={() => handlePageChange(i + 1)}>
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
        </PaginationContent>
        {currentPage < Math.ceil(sortedRecords.length / itemsPerPage) && (
          <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
        )}
      </Pagination>

     
    </div>
  )
}

export default BorrowRecordListByUserId

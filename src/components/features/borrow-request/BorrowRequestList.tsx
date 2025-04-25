"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useGetAllBorrowRequest } from "@/hooks/api/borrow-request/use-getAllBorrowRequest"
import { useApproveBorrowRequest } from "@/hooks/api/borrow-request/use-approvedBorrowRequest"
import { useRejectBorrowRequest } from "@/hooks/api/borrow-request/use-rejectedBorrowRequest"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Check, Clock, X, ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"
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
import { showErrorToast, showSuccessToast } from "@/components/common/toast/toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type SortDirection = "asc" | "desc" | null
type SortColumn =
  | "bookTitle"
  | "bookAuthor"
  | "userName"
  | "userEmail"
  | "status"
  | "request_date"
  | "approved_date"
  | "rejected_date"
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

const BorrowRequestList = () => {
  const { fetchBorrowRequests, borrowRequests, loading } = useGetAllBorrowRequest()
  const { approveRequest } = useApproveBorrowRequest()
  const { rejectRequest } = useRejectBorrowRequest()

  const [searchTerm, setSearchTerm] = useState<string>("")
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [statusFilter, setStatusFilter] = useState("pending")
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Sorting states
  const [sortColumn, setSortColumn] = useState<SortColumn>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)

  // Modal-related state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<any>(null)

  useEffect(() => {
    fetchBorrowRequests()
  }, [])

  const handleApprove = async (id: string) => {
    try {
      const res = await approveRequest(id)
      showSuccessToast(res.message)
      fetchBorrowRequests()
    } catch (error: any) {
      showErrorToast(error?.response?.data?.message || error?.message || "Có lỗi xảy ra, vui lòng thử lại sau")
    }
  }

  const handleReject = async (request: any) => {
    setSelectedRequest(request)
    setIsModalOpen(true)
  }

  const confirmReject = async () => {
    if (!selectedRequest) return
    try {
      const res = await rejectRequest(selectedRequest._id)
      showSuccessToast(res.message)
      fetchBorrowRequests()
    } catch (error: any) {
      showErrorToast(error?.response?.data?.message || error?.message || "Có lỗi xảy ra, vui lòng thử lại sau")
    } finally {
      setIsModalOpen(false)
      setSelectedRequest(null)
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="mr-1 h-3 w-3" />
            Chờ duyệt
          </Badge>
        )
      case "approved":
        return (
          <Badge className="bg-green-50 text-green-700 border-green-200">
            <Check className="mr-1 h-3 w-3" />
            Đã duyệt
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-red-50 text-red-700 border-red-200">
            <X className="mr-1 h-3 w-3" />
            Từ chối
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Get status value for sorting
  const getStatusValue = (status: string) => {
    switch (status) {
      case "pending":
        return 1
      case "approved":
        return 2
      case "rejected":
        return 3
      default:
        return 4
    }
  }

  const filteredRequests = borrowRequests.filter((request) => {
    const searchLowerCase = searchTerm.toLowerCase()
    const requestDate = new Date(request.request_date)

    const isMatchingSearch =
      request.book_id.title.toLowerCase().includes(searchLowerCase) ||
      request.book_id.author.toLowerCase().includes(searchLowerCase) ||
      request.user_id.full_name.toLowerCase().includes(searchLowerCase) ||
      request.user_id.email.toLowerCase().includes(searchLowerCase)

    const isInDateRange = (!startDate || requestDate >= startDate) && (!endDate || requestDate <= endDate)

    const isMatchingStatus = statusFilter === "all" || request.status === statusFilter
    return isMatchingSearch && isInDateRange && isMatchingStatus
  })

  // Sort records
  const sortedRequests = [...filteredRequests].sort((a, b) => {
    if (!sortColumn || !sortDirection) {
      // Default sort by request date (newest first)
      return new Date(b.request_date).getTime() - new Date(a.request_date).getTime()
    }

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
      case "status":
        return (getStatusValue(a.status) - getStatusValue(b.status)) * direction
      case "request_date":
        return (new Date(a.request_date).getTime() - new Date(b.request_date).getTime()) * direction
      case "approved_date":
        // Handle null approved dates
        if (!a.approved_date && !b.approved_date) return 0
        if (!a.approved_date) return 1 * direction
        if (!b.approved_date) return -1 * direction
        return (new Date(a.approved_date).getTime() - new Date(b.approved_date).getTime()) * direction
      case "rejected_date":
        // Handle null rejected dates
        if (!a.rejected_date && !b.rejected_date) return 0
        if (!a.rejected_date) return 1 * direction
        if (!b.rejected_date) return -1 * direction
        return (new Date(a.rejected_date).getTime() - new Date(b.rejected_date).getTime()) * direction
      default:
        return 0
    }
  })

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = sortedRequests.slice(indexOfFirstItem, indexOfLastItem)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(event.target.value))
    setCurrentPage(1)
  }

  const resetFilters = () => {
    setSearchTerm("")
    setStartDate(undefined)
    setEndDate(undefined)
    setStatusFilter("pending")
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
      <h2 className="text-2xl font-bold mb-4">Danh sách yêu cầu mượn sách</h2>

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
          <label htmlFor="itemsPerPage">Số mục mỗi trang:</label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="px-4 py-2 border rounded-md"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <label htmlFor="statusFilter">Trạng thái:</label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-2 border rounded-md"
          >
            <option value="all">Tất cả</option>
            <option value="pending">Chờ duyệt</option>
            <option value="approved">Đã duyệt</option>
            <option value="rejected">Từ chối</option>
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
                  <TableHead className="cursor-pointer hover:bg-gray-100" onClick={() => handleSort("status")}>
                    <div className="flex items-center">
                      Trạng thái
                      {getSortIcon("status")}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-gray-100" onClick={() => handleSort("request_date")}>
                    <div className="flex items-center">
                      Ngày yêu cầu
                      {getSortIcon("request_date")}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-gray-100" onClick={() => handleSort("approved_date")}>
                    <div className="flex items-center">
                      Ngày duyệt
                      {getSortIcon("approved_date")}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:bg-gray-100" onClick={() => handleSort("rejected_date")}>
                    <div className="flex items-center">
                      Ngày từ chối
                      {getSortIcon("rejected_date")}
                    </div>
                  </TableHead>
                  <TableHead>Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.map((request) => (
                  <TableRow key={request._id}>
                    <TableCell>{request.book_id.title}</TableCell>
                    <TableCell>{request.book_id.author}</TableCell>
                    <TableCell>{request.user_id.full_name}</TableCell>
                    <TableCell>{request.user_id.email}</TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell>{new Date(request.request_date).toLocaleString()}</TableCell>
                    <TableCell>
                      {request.approved_date ? new Date(request.approved_date).toLocaleString() : "-"}
                    </TableCell>
                    <TableCell>
                      {request.rejected_date ? new Date(request.rejected_date).toLocaleString() : "-"}
                    </TableCell>
                    <TableCell className="space-x-2">
                      {request.status === "pending" && (
                        <>
                          <Button
                            variant="secondary"
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => handleApprove(request._id)}
                          >
                            <Check className="mr-1 h-4 w-4" />
                            Duyệt
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleReject(request)}>
                            <X className="mr-1 h-4 w-4" />
                            Từ chối
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-md border mt-4">
          <p className="text-muted-foreground">Không có yêu cầu nào.</p>
        </div>
      )}

      {/* Pagination controls */}
      <Pagination>
        {currentPage > 1 && <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} />}
        <PaginationContent>
          {Array.from({ length: Math.ceil(sortedRequests.length / itemsPerPage) }).map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink isActive={index + 1 === currentPage} onClick={() => handlePageChange(index + 1)}>
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
        </PaginationContent>
        {currentPage < Math.ceil(sortedRequests.length / itemsPerPage) && (
          <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
        )}
      </Pagination>

      {/* Improved Reject Confirmation Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <X className="h-5 w-5 text-red-500" />
              Xác nhận từ chối
            </DialogTitle>
            <DialogDescription>Bạn có chắc chắn muốn từ chối yêu cầu mượn sách này?</DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="py-4">
              <div className="rounded-lg border p-4 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm font-medium">Tên sách:</div>
                  <div>{selectedRequest.book_id.title}</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm font-medium">Tác giả:</div>
                  <div>{selectedRequest.book_id.author}</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm font-medium">Người mượn:</div>
                  <div>{selectedRequest.user_id.full_name}</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm font-medium">Email:</div>
                  <div>{selectedRequest.user_id.email}</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm font-medium">Ngày yêu cầu:</div>
                  <div>{new Date(selectedRequest.request_date).toLocaleString()}</div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="sm:justify-end">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Hủy
            </Button>
            <Button type="button" variant="destructive" onClick={confirmReject}>
              <X className="mr-1 h-4 w-4" />
              Xác nhận từ chối
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default BorrowRequestList

import React from "react"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select"
import { usePayFine } from "@/hooks/api/fine/fine-pay-fine"
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/common/toast/toast"
import fineGetFines from "@/hooks/api/fine/fine-get-fines"
import { useAtomValue } from "jotai/react"
import { userInfoAtom } from "@/stores/auth"
import fineGetFineByUser from "@/hooks/api/fine/fine-getbyuser"

const PAGE_SIZE = 10

const SORTABLE_COLUMNS = [
  { key: "book_title", label: "Tên sách" },
  { key: "amount", label: "Số tiền phạt" },
  { key: "reason", label: "Lý do phạt" },
  { key: "is_paid", label: "Trạng thái" },
  { key: "issued_date", label: "Ngày tạo" },
]

const FineMember = () => {
  const user = useAtomValue(userInfoAtom);
  const { data, error, isLoading } = fineGetFineByUser()
  const { payFine, loading: payLoading } = usePayFine()
  const [page, setPage] = React.useState(1)
  const [search, setSearch] = React.useState("")
  const [status, setStatus] = React.useState("all")


  // Filter and search
  const filtered = data?.filter((fine) => {
    const matchesSearch =
      fine.borrow_record_id?.book_id?.title?.toLowerCase().includes(search.toLowerCase()) || false
    const matchesStatus = status === "all" ? true :
      status === "false" ? !fine.is_paid :
        status === "true" ? fine.is_paid : false
    return matchesSearch && matchesStatus
  })

  const total = filtered?.length || 0
  const totalPages = Math.ceil(total / PAGE_SIZE)
  const paginated = filtered?.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  React.useEffect(() => {
    setPage(1)
  }, [search, status])

  if (isLoading) {
    return <div>Đang tải...</div>
  }

  if (error) {
    return <div>Có lỗi xảy ra khi tải dữ liệu</div>
  }

  if (!data || data.length === 0) {
    return <div>Không có phạt nào.</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Danh sách phạt của tôi</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
          <div className="flex-1">
            <Label htmlFor="search">Tìm kiếm</Label>
            <Input
              id="search"
              placeholder="Tìm theo tên sách..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mt-1"
            />
          </div>
          <div className="w-full md:w-56">
            <Label htmlFor="status">Trạng thái</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="status" className="mt-1 w-full">
                <SelectValue placeholder="Tất cả trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="false">Chờ thanh toán</SelectItem>
                <SelectItem value="true">Đã thanh toán</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>STT</TableHead>
              {SORTABLE_COLUMNS.map((col) => (
                <TableHead key={col.key}>{col.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated?.map((fine, idx) => (
              <TableRow key={fine._id}>
                <TableCell>{(page - 1) * PAGE_SIZE + idx + 1}</TableCell>
                <TableCell>{fine.borrow_record_id?.book_id?.title || "N/A"}</TableCell>
                <TableCell>{fine.amount.toLocaleString("vi-VN")} VNĐ</TableCell>
                <TableCell>{fine.reason}</TableCell>
                <TableCell>
                  {fine.is_paid ? (
                    <Badge variant="default" className="bg-green-600">
                      Đã thanh toán
                    </Badge>
                  ) : (
                    <Badge variant="default" className="bg-yellow-600">
                      Chờ thanh toán
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {new Date(fine.issued_date).toLocaleDateString("vi-VN")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {totalPages > 1 && (
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    setPage((p) => Math.max(1, p - 1))
                  }}
                  aria-disabled={page === 1}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
                    isActive={page === i + 1}
                    onClick={(e) => {
                      e.preventDefault()
                      setPage(i + 1)
                    }}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    setPage((p) => Math.min(totalPages, p + 1))
                  }}
                  aria-disabled={page === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </CardContent>
    </Card>


  )
}

export default FineMember

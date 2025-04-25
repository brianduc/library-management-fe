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
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import {
  MoreHorizontalIcon,
  PlusIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  MinusIcon,
} from "lucide-react"
import { useRouter } from "next/router"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import fineGetFines from "@/hooks/api/fine/fine-get-fines"
import { Endpoints } from "@/lib/endpoints"
import { usePayFine } from "@/hooks/api/fine/fine-pay-fine"
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/common/toast/toast"
import useGetBooks from "@/hooks/api/book/use-get-books"
import { Fine } from "@/hooks/api/fine/fine-get-fines"

const PAGE_SIZE = 10

const SORTABLE_COLUMNS = [
  { key: "user_name", label: "Tên hội viên" },
  { key: "book_title", label: "Tên sách" },
  { key: "amount", label: "Số tiền phạt" },
  { key: "reason", label: "Lý do phạt" },
  { key: "is_paid", label: "Trạng thái" },
  { key: "issued_date", label: "Ngày tạo" },
]

const SORT_ICONS = {
  asc: <ChevronDownIcon className="size-4 inline ml-1" />,
  desc: <ChevronUpIcon className="size-4 inline ml-1" />,
  none: <MinusIcon className="size-4 inline ml-1" />,
}

const FinePage = () => {
  const { data, error, isLoading } = fineGetFines()
  const { payFine, loading: payLoading } = usePayFine()
  console.log("Raw data:", data)
 
  const [page, setPage] = React.useState(1)
  const [search, setSearch] = React.useState("")
  const [status, setStatus] = React.useState("all")
  const [sorts, setSorts] = React.useState(
    [] as { key: string; direction: "asc" | "desc" | "none" }[],
  )
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [fineToDelete, setFineToDelete] = React.useState<Fine | null>(null)
  const router = useRouter()

  // Filter and search
  const filtered = data?.filter((fine: Fine) => {
    const matchesSearch =
      (fine.user_id?.email?.toLowerCase().includes(search.toLowerCase()) || 
      (fine.borrow_record_id?.book_id?.title || fine.book_id?.title)?.toLowerCase().includes(search.toLowerCase())
    ) 
    const matchesStatus = status === "all" ? true : 
      status === "false" ? !fine.is_paid :
      status === "true" ? fine.is_paid : false
    return matchesSearch && matchesStatus
  })

  // Multi-column sort logic
  const sorted = React.useMemo(() => {
    if (!filtered || sorts.length === 0) return filtered
    return [...filtered].sort((a: Fine, b: Fine) => {
      for (const sort of sorts) {
        if (sort.direction === "none") continue
        let aValue: any = (a as any)[sort.key]
        let bValue: any = (b as any)[sort.key]
        if (aValue < bValue) return sort.direction === "asc" ? -1 : 1
        if (aValue > bValue) return sort.direction === "asc" ? 1 : -1
      }
      return 0
    })
  }, [filtered, sorts])

  const total = sorted?.length || 0
  const totalPages = Math.ceil(total / PAGE_SIZE)
  const paginated = sorted?.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  React.useEffect(() => {
    setPage(1)
  }, [search, status])

  // Toggle sort for a column
  const handleSort = (key: string) => {
    setSorts((prev) => {
      const existing = prev.find((s) => s.key === key)
      let direction: "asc" | "desc" | "none" = "asc"
      if (existing) {
        if (existing.direction === "asc") direction = "desc"
        else if (existing.direction === "desc") direction = "none"
        else direction = "asc"
        if (direction === "none") return prev.filter((s) => s.key !== key)
        return prev.map((s) => (s.key === key ? { ...s, direction } : s))
      }
      return [...prev, { key, direction }]
    })
  }

  const handleDeleteClick = (fine: Fine) => {
    setFineToDelete(fine)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    // Implement delete logic here
    setDeleteDialogOpen(false)
    setFineToDelete(null)
  }

  const handlePayment = async (id: string) => {
    try {
      await payFine(id)
      showSuccessToast("Thanh toán phạt thành công!")
      // Refresh the data
      window.location.reload()
    } catch (error) {
      showErrorToast("Thanh toán phạt thất bại!")
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Danh sách phạt</CardTitle>
          <Button>
            <PlusIcon />
            <Link href="/fine/add">Thêm phạt</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
          <div className="flex-1">
            <Label htmlFor="search">Tìm kiếm</Label>
            <Input
              id="search"
              placeholder="Tìm theo tên hội viên, tên sách..."
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
              <TableHead className="bg-white text-black">STT</TableHead>
              {SORTABLE_COLUMNS.map((col) => {
                const sort = sorts.find((s) => s.key === col.key)
                const icon = sort ? SORT_ICONS[sort.direction] : SORT_ICONS.none
                return (
                  <TableHead
                    key={col.key}
                    className="cursor-pointer select-none bg-white text-black"
                    onClick={() => handleSort(col.key)}
                  >
                    {col.label} {icon}
                  </TableHead>
                )
              })}
              <TableHead className="bg-white text-black">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Đang tải...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Có lỗi xảy ra khi tải dữ liệu
                </TableCell>
              </TableRow>
            ) : !data || data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Không có phạt nào.
                </TableCell>
              </TableRow>
            ) : (
              paginated?.map((fine: Fine, idx: number) => (
                <TableRow key={fine._id}>
                  <TableCell>{(page - 1) * PAGE_SIZE + idx + 1}</TableCell>
                  <TableCell>{fine.user_id?.email || "N/A"}</TableCell>
                  <TableCell>{fine.borrow_record_id?.book_id?.title || fine.book_id?.title || "N/A"}</TableCell>
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
                  <TableCell>
                    {!fine.is_paid && (
                      <button
                        onClick={() => handlePayment(fine._id)}
                        disabled={payLoading}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Xác nhận thanh toán
                      </button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
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

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa phạt</DialogTitle>
          </DialogHeader>
          <div>
            Bạn có chắc chắn muốn xóa phạt của hội viên <b>{fineToDelete?.user_id?.email}</b>{" "}
            không?
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
            >
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default FinePage


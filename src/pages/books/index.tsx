import useGetBooks, { Book } from "@/hooks/api/book/use-get-books"
import useGetCategories from "@/hooks/api/category/use-get-categories"
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
import { useDeleteBook } from "@/hooks/api/book/use-delete-book"
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/common/toast/toast"
import { useSWRConfig } from "swr"
import { Endpoints } from "@/lib/endpoints"

const PAGE_SIZE = 10

const SORTABLE_COLUMNS = [
  { key: "title", label: "Tiêu đề" },
  { key: "author", label: "Tác giả" },
  { key: "category_id", label: "Danh mục" },
  { key: "quantity_total", label: "Tổng số lượng" },
  { key: "quantity_available", label: "Số lượng sẵn có" },
  { key: "status", label: "Trạng thái" },
  { key: "createdAt", label: "Ngày tạo" },
]

const SORT_ICONS = {
  asc: <ChevronDownIcon className="size-4 inline ml-1" />,
  desc: <ChevronUpIcon className="size-4 inline ml-1" />,
  none: <MinusIcon className="size-4 inline ml-1" />,
}

const BookPage = () => {
  const { data, error, isLoading } = useGetBooks()
  const { data: categories } = useGetCategories()
  const { deleteBook, loading: deleting } = useDeleteBook()
  const [page, setPage] = React.useState(1)
  const [search, setSearch] = React.useState("")
  const [status, setStatus] = React.useState("all")
  const [sorts, setSorts] = React.useState(
    [] as { key: string; direction: "asc" | "desc" | "none" }[],
  )
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [bookToDelete, setBookToDelete] = React.useState<Book | null>(null)
  const router = useRouter()
  const { mutate } = useSWRConfig()

  // Lọc và tìm kiếm
  const filtered = React.useMemo(() => {
    if (!data || !Array.isArray(data)) {
      return [];
    }
    return data.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.author.toLowerCase().includes(search.toLowerCase()) ||
        (book.qr_code?.toLowerCase().includes(search.toLowerCase()) ?? false);
      const matchesStatus = status && status !== "all" ? book.status === status : true;
      return matchesSearch && matchesStatus;
    });
  }, [data, search, status])

  // Tạo mapping từ category_id đến category name
  const categoryMap = React.useMemo(() => {
    if (!categories) return {}
    return categories.reduce((acc, category) => {
      acc[category._id] = category.name
      return acc
    }, {} as Record<string, string>)
  }, [categories])

  // Multi-column sort logic
  const sorted = React.useMemo(() => {
    if (!filtered.length || sorts.length === 0) return filtered
    return [...filtered].sort((a: any, b: any) => {
      for (const sort of sorts) {
        if (sort.direction === "none") continue
        let aValue: any = (a as any)[sort.key]
        let bValue: any = (b as any)[sort.key]
        // Special handling for status
        if (sort.key === "status") {
          aValue = aValue || ""
          bValue = bValue || ""
        }
        if (aValue < bValue) return sort.direction === "asc" ? -1 : 1
        if (aValue > bValue) return sort.direction === "asc" ? 1 : -1
      }
      return 0
    })
  }, [filtered, sorts])

  const total = sorted.length
  const totalPages = Math.ceil(total / PAGE_SIZE)
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

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
        // Remove if none, else update
        if (direction === "none") return prev.filter((s) => s.key !== key)
        return prev.map((s) => (s.key === key ? { ...s, direction } : s))
      }
      // Add new sort
      return [...prev, { key, direction }]
    })
  }

  const handleDeleteClick = (book: Book) => {
    setBookToDelete(book)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!bookToDelete) return
    await deleteBook({ id: bookToDelete._id })
      .then(() => {
        showSuccessToast("Xóa sách thành công!")
        setDeleteDialogOpen(false)
        setBookToDelete(null)
        mutate(Endpoints.Books.GET_ALL)
      })
      .catch(() => {
        showErrorToast("Xóa sách thất bại!")
        setDeleteDialogOpen(false)
        setBookToDelete(null)
      })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Danh sách sách</CardTitle>
          <Button>
            <PlusIcon />
            <Link href="/books/add">Thêm sách</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
          <div className="flex-1">
            <Label htmlFor="search">Tìm kiếm</Label>
            <Input
              id="search"
              placeholder="Tìm theo tiêu đề, tác giả, mã QR..."
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
                <SelectItem value="available">Sẵn có</SelectItem>
                <SelectItem value="borrowed">Đã mượn</SelectItem>
                <SelectItem value="damaged">Hư hỏng</SelectItem>
                <SelectItem value="lost">Mất</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(PAGE_SIZE)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertTitle>Lỗi</AlertTitle>
            <AlertDescription>
              Không thể tải danh sách sách.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>STT</TableHead>
                  {SORTABLE_COLUMNS.map((col) => {
                    const sort = sorts.find((s) => s.key === col.key)
                    const icon = sort
                      ? SORT_ICONS[sort.direction]
                      : SORT_ICONS.none
                    return (
                      <TableHead
                        key={col.key}
                        className="cursor-pointer select-none"
                        onClick={() => handleSort(col.key)}
                      >
                        {col.label} {icon}
                      </TableHead>
                    )
                  })}
                  <TableHead>Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      Không có sách nào.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginated.map((book, idx) => (
                    <TableRow key={book._id}>
                      <TableCell>{(page - 1) * PAGE_SIZE + idx + 1}</TableCell>
                      <TableCell>{book.title}</TableCell>
                      <TableCell>{book.author}</TableCell>
                      <TableCell>
                        {categoryMap[book.category_id] || "Không có danh mục"}
                      </TableCell>
                      <TableCell>{book.quantity_total}</TableCell>
                      <TableCell>{book.quantity_available}</TableCell>
                      <TableCell>
                        <Badge>
                          {book.status === "available" ? "Sẵn có" :
                           book.status === "borrowed" ? "Đã mượn" :
                           book.status === "damaged" ? "Hư hỏng" :
                           "Mất"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(book.createdAt).toLocaleDateString("vi-VN")}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu modal={false}>
                          <DropdownMenuTrigger asChild>
                            <button className="p-2 rounded-full hover:bg-accent">
                              <MoreHorizontalIcon className="size-5" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                router.push(`/books/${book._id}/view`)
                              }}
                            >
                              Chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                router.push(`/books/${book._id}/edit`)
                              }}
                            >
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => handleDeleteClick(book)}
                            >
                              Xóa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
          </>
        )}
      </CardContent>
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa sách</DialogTitle>
          </DialogHeader>
          <div>
            Bạn có chắc chắn muốn xóa sách <b>{bookToDelete?.title}</b> không?
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleting}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleting}
            >
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default BookPage
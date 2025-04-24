import useGetUsers, { User } from "@/hooks/api/user/use-get-users"
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
import { Constants } from "@/lib/constants"
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
import { useDeleteUser } from "@/hooks/api/user/use-delete-user"
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/common/toast/toast"
import { useSWRConfig } from "swr"
import { Endpoints } from "@/lib/endpoints"

const PAGE_SIZE = 10

const SORTABLE_COLUMNS = [
  { key: "full_name", label: "Tên" },
  { key: "email", label: "Email" },
  { key: "identity_number", label: "Mã hội viên" },
  { key: "phone", label: "Số điện thoại" },
  { key: "role", label: "Vai trò" },
  { key: "createdAt", label: "Ngày tạo" },
  { key: "is_active", label: "Trạng thái" },
]

const SORT_ICONS = {
  asc: <ChevronDownIcon className="size-4 inline ml-1" />,
  desc: <ChevronUpIcon className="size-4 inline ml-1" />,
  none: <MinusIcon className="size-4 inline ml-1" />,
}

const UserPage = () => {
  const { data, error, isLoading } = useGetUsers()
  const { deleteUser, loading: deleting } = useDeleteUser()
  const [page, setPage] = React.useState(1)
  const [search, setSearch] = React.useState("")
  const [role, setRole] = React.useState("all")
  const [sorts, setSorts] = React.useState(
    [] as { key: string; direction: "asc" | "desc" | "none" }[],
  )
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [userToDelete, setUserToDelete] = React.useState<User | null>(null)
  const router = useRouter()
  const { mutate } = useSWRConfig()

  // Lọc và tìm kiếm
  const filtered = (data || []).filter((user) => {
    const matchesSearch =
      user.full_name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.identity_number.toLowerCase().includes(search.toLowerCase())
    const matchesRole = role && role !== "all" ? user.role === role : true
    return matchesSearch && matchesRole
  })

  // Multi-column sort logic
  const sorted = React.useMemo(() => {
    if (!filtered.length || sorts.length === 0) return filtered
    return [...filtered].sort((a: any, b: any) => {
      for (const sort of sorts) {
        if (sort.direction === "none") continue
        let aValue: any = (a as any)[sort.key]
        let bValue: any = (b as any)[sort.key]
        // Special handling for role and is_active
        if (sort.key === "role") {
          aValue = Constants.roleMap[aValue]
          bValue = Constants.roleMap[bValue]
        }
        if (sort.key === "is_active") {
          aValue = aValue ? 1 : 0
          bValue = bValue ? 1 : 0
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
  }, [search, role])

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

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!userToDelete) return
    await deleteUser({ id: userToDelete._id })
      .then(() => {
        showSuccessToast("Xóa hội viên thành công!")
        setDeleteDialogOpen(false)
        setUserToDelete(null)
        mutate(Endpoints.Users.GET_ALL)
      })
      .catch(() => {
        showErrorToast("Xóa hội viên thất bại!")
        setDeleteDialogOpen(false)
        setUserToDelete(null)
      })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Danh sách hội viên</CardTitle>
          <Button>
            <PlusIcon />
            <Link href="/users/add">Thêm hội viên</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
          <div className="flex-1">
            <Label htmlFor="search">Tìm kiếm</Label>
            <Input
              id="search"
              placeholder="Tìm theo tên, email, mã hội viên..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mt-1"
            />
          </div>
          <div className="w-full md:w-56">
            <Label htmlFor="role">Vai trò</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger id="role" className="mt-1 w-full">
                <SelectValue placeholder="Tất cả vai trò" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả vai trò</SelectItem>
                <SelectItem value="admin">Quản trị viên</SelectItem>
                <SelectItem value="staff">Nhân viên</SelectItem>
                <SelectItem value="member">Thành viên</SelectItem>
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
              Không thể tải danh sách người dùng.
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
                      Không có hội viên nào.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginated.map((user, idx) => (
                    <TableRow key={user._id}>
                      <TableCell>{(page - 1) * PAGE_SIZE + idx + 1}</TableCell>
                      <TableCell>{user.full_name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.identity_number}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>
                        <Badge>{Constants.roleMap[user.role]}</Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                      </TableCell>
                      <TableCell>
                        {user.is_active ? (
                          <Badge variant="default" className="bg-green-600">
                            Hoạt động
                          </Badge>
                        ) : (
                          <Badge variant="destructive">Ngưng hoạt động</Badge>
                        )}
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
                                router.push(`/users/${user._id}/view`)
                              }}
                            >
                              Chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                router.push(`/users/${user._id}/edit`)
                              }}
                            >
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => handleDeleteClick(user)}
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
            <DialogTitle>Xác nhận xóa hội viên</DialogTitle>
          </DialogHeader>
          <div>
            Bạn có chắc chắn muốn xóa hội viên <b>{userToDelete?.full_name}</b>{" "}
            không?
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

export default UserPage

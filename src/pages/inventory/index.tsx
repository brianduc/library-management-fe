import { useState } from "react"
import useSWR from "swr"
import { Endpoints } from "@/lib/endpoints"
import { axiosFetcher } from "@/lib/utils"
import { SearchIcon } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Book } from "@/hooks/api/book/use-get-books"
import useGetCategories from "@/hooks/api/category/use-get-categories"
import { useRouter } from "next/router"
import { useRequireBorrowRequest } from "@/hooks/api/borrow-request/use-requireBorrowRequest"
import { useAtomValue } from "jotai/react"
import { userInfoAtom } from "@/stores/auth"
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/common/toast/toast"
import { Button } from "@/components/ui/button"

interface BookWithCategory extends Book {
  categoryName?: string
}

const InventoryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const router = useRouter()
  const { requireBorrow } = useRequireBorrowRequest()
  const user = useAtomValue(userInfoAtom)

  // Fetch books data
  const {
    data: booksData,
    error: booksError,
    isLoading: booksLoading,
  } = useSWR<{ books: Book[] }>(Endpoints.Books.GET_ALL, axiosFetcher)
  // Fetch categories data
  const { data: categories } = useGetCategories()
  

  // Process books data to include category names
  const books: BookWithCategory[] =
    booksData?.map((book) => ({
      ...book,
      categoryName:
        categories?.find((cat) => cat._id === book.category_id)?.name ||
        "Không có danh mục",
    })) || []

    

  // Filter books based on search and category filters
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      searchQuery.trim() === "" ||
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory =
      selectedCategory === "all" || book.category_id === selectedCategory

    return matchesSearch && matchesCategory
  })

  if (booksLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(8)
            .fill(0)
            .map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-40 w-full" />
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
        </div>
      </div>
    )
  }

  if (booksError) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto my-10">
        <AlertDescription>
          Không thể tải dữ liệu sách. Vui lòng thử lại sau.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-6">Kho Sách</h2>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search input */}
          <div className="relative flex-grow">
            <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tên sách hoặc tác giả"
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Category filter */}
          <div className="w-full md:w-64">
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả danh mục</SelectItem>
                {categories?.map((category) => (
                  <SelectItem key={category._id} value={category._id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {filteredBooks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">
            Không tìm thấy sách phù hợp với tiêu chí tìm kiếm.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <Card
              key={book._id}
              className="overflow-hidden flex flex-col cursor-pointer"
              onClick={() => router.push(`/books/${book._id}/view`)}
            >
              <div className="h-48 bg-muted flex items-center justify-center">
                {book.image_url ? (
                  <img
                    src={book.image_url}
                    alt={`Cover for ${book.title}`}
                    className="h-32 object-contain"
                  />
                ) : (
                  <div className="h-16 w-16 text-muted-foreground/30 flex items-center justify-center">
                    <span className="text-sm">No Image</span>
                  </div>
                )}
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-2">{book.title}</CardTitle>
                <CardDescription>{book.author}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="secondary">{book.categoryName}</Badge>
                  <Badge variant="outline">
                    {book.status === "available"
                      ? "Sẵn có"
                      : book.status === "damaged"
                        ? "Hư hỏng"
                        : book.status === "out_of_stock"
                          ? "Hết hàng"
                          : ""}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {book.description || "Không có mô tả"}
                </p>
              </CardContent>

              <CardFooter>
                <span className="text-sm font-medium">
                  Còn {book.quantity_available}/{book.quantity_total} quyển
                </span>
              </CardFooter>
              {book.status === "available" && book.quantity_available > 0 ? (
                <Button
                  size="sm"
                  className="mt-2"
                  onClick={async (e) => {
                    e.stopPropagation()
                    try {
                      if (!user?._id) {
                        showErrorToast("Người dùng không hợp lệ.")
                        return
                      }
                      await requireBorrow({
                        user_id: user._id,
                        book_id: book._id,
                      })
                      showSuccessToast("Yêu cầu mượn sách đã được gửi!")
                    } catch (err) {
                      const message =
                        (err as any)?.response?.data?.message || "Đã xảy ra lỗi"
                      showErrorToast(message)
                    }
                  }}
                >
                  Yêu cầu mượn
                </Button>
              ) : (
                <Button className="w-full" variant="outline" disabled>
                  Không có sẵn
                </Button>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default InventoryPage

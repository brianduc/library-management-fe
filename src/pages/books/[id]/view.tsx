import React from "react"
import { useRouter } from "next/router"
import useGetBookById from "@/hooks/api/book/use-get-book-by-id"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

const BookDetails = () => {
  const router = useRouter()
  const { id } = router.query
  const { data: book, error, isLoading } = useGetBookById(id as string)

  if (isLoading) {
    return <div className="text-center py-10">Đang tải thông tin sách...</div>
  }
  if (error || !book) {
    return <div className="text-center py-10 text-destructive">Không thể tải thông tin sách.</div>
  }

  return (
    <div className="flex justify-center items-center min-h-[60vh] p-4">
      <Card className="w-full max-w-xl">
        <CardHeader className="flex flex-col items-center gap-2">
          <Avatar className="h-20 w-20 mb-2">
            <AvatarImage src={"/lms_logo.png"} alt={book.title} />
            <AvatarFallback>{book.title.charAt(0)}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl font-bold">{book.title}</CardTitle>
          <div className="flex gap-2 mt-1">
            <Badge>
              {book.status === "available" ? "Sẵn có" :
               book.status === "borrowed" ? "Đã mượn" :
               book.status === "damaged" ? "Hư hỏng" :
               "Mất"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 text-base">
            <div>
              <span className="font-medium">Tác giả:</span> {book.author}
            </div>
            <div>
              <span className="font-medium">Danh mục:</span> {book.category_id}
            </div>
            <div>
              <span className="font-medium">Tổng số lượng:</span> {book.quantity_total}
            </div>
            <div>
              <span className="font-medium">Số lượng sẵn có:</span> {book.quantity_available}
            </div>
            <div>
              <span className="font-medium">Mã QR:</span> {book.qr_code || "Không có"}
            </div>
            <div>
              <span className="font-medium">Mô tả:</span> {book.description || "Không có"}
            </div>
            <div>
              <span className="font-medium">Ẩn:</span> {book.is_hidden ? "Có" : "Không"}
            </div>
            <div>
              <span className="font-medium">Ngày tạo:</span> {new Date(book.createdAt).toLocaleDateString("vi-VN")}
            </div>
            <div>
              <span className="font-medium">Ngày cập nhật:</span> {new Date(book.updatedAt).toLocaleDateString("vi-VN")}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-3 mt-4">
          <Button onClick={() => router.push(`/books/${book._id}/edit`)}>
            Chỉnh sửa
          </Button>
          <Button variant="outline" onClick={() => router.push("/books")}>
            Quay lại
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default BookDetails
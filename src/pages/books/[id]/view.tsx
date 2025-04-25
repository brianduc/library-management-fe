import React from "react"
import { useRouter } from "next/router"
import useGetBookById from "@/hooks/api/book/use-get-book-by-id"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useAtomValue } from "jotai/react"
import { userInfoAtom } from "@/stores/auth"
import ReviewForm from "@/components/features/review/review"

const BookDetails = () => {
  const user = useAtomValue(userInfoAtom);
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
    <>
      {user?.role === "admin" ? (
        <div className="flex justify-center items-center min-h-[60vh] p-6">
          <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden border border-gray-100">
            {/* Book Image Section */}
            <div className="flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 md:w-1/3 p-8">
              <Avatar className="h-32 w-32 mb-4 shadow-lg border-4 border-white">
                <AvatarImage src={"/lms_logo.png"} alt={book.title} />
                <AvatarFallback className="text-3xl">{book.title.charAt(0)}</AvatarFallback>
              </Avatar>
              <Badge className="mt-2 text-base px-4 py-1 rounded-full">
                {book.status === "available"
                  ? "Sẵn có"
                  : book.status === "borrowed"
                  ? "Đã mượn"
                  : book.status === "damaged"
                  ? "Hư hỏng"
                  : "Mất"}
              </Badge>
            </div>
            {/* Book Details Section */}
            <div className="flex-1 p-8 flex flex-col justify-between">
              <div>
                <h1 className="text-3xl font-extrabold text-blue-900 mb-2">{book.title}</h1>
                <div className="grid grid-cols-1 gap-3 text-base text-gray-700">
                  <div><span className="font-semibold text-blue-700">Tác giả:</span> {book.author}</div>
                  <div><span className="font-semibold text-blue-700">Danh mục:</span> {book.category_id}</div>
                  <div><span className="font-semibold text-blue-700">Tổng số lượng:</span> {book.quantity_total}</div>
                  <div><span className="font-semibold text-blue-700">Số lượng sẵn có:</span> {book.quantity_available}</div>
                  <div><span className="font-semibold text-blue-700">Mã QR:</span> {book.qr_code || "Không có"}</div>
                  <div><span className="font-semibold text-blue-700">Mô tả:</span> {book.description || "Không có"}</div>
                  <div><span className="font-semibold text-blue-700">Ẩn:</span> {book.is_hidden ? "Có" : "Không"}</div>
                  <div><span className="font-semibold text-blue-700">Ngày tạo:</span> {new Date(book.createdAt).toLocaleDateString("vi-VN")}</div>
                  <div><span className="font-semibold text-blue-700">Ngày cập nhật:</span> {new Date(book.updatedAt).toLocaleDateString("vi-VN")}</div>
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-8">
                <Button onClick={() => router.push(`/books/${book._id}/edit`)} className="px-6 py-2 text-base font-semibold">
                  Chỉnh sửa
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push("/books")}
                  className="px-6 py-2 text-base font-semibold border-blue-500 text-blue-700 hover:bg-blue-50"
                >
                  Quay lại
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center min-h-[60vh] p-6">
          <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden border border-gray-100">
            {/* Phần hiển thị giống nhau nếu bạn muốn, hoặc thay đổi theo role */}
            {/* Có thể giữ nguyên phần detail, chỉ khác phần button */}
            <div className="flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 md:w-1/3 p-8">
              <Avatar className="h-32 w-32 mb-4 shadow-lg border-4 border-white">
                <AvatarImage src={"/lms_logo.png"} alt={book.title} />
                <AvatarFallback className="text-3xl">{book.title.charAt(0)}</AvatarFallback>
              </Avatar>
              <Badge className="mt-2 text-base px-4 py-1 rounded-full">
                {book.status === "available"
                  ? "Sẵn có"
                  : book.status === "borrowed"
                  ? "Đã mượn"
                  : book.status === "damaged"
                  ? "Hư hỏng"
                  : "Mất"}
              </Badge>
            </div>
            <div className="flex-1 p-8 flex flex-col justify-between">
              <div>
                <h1 className="text-3xl font-extrabold text-blue-900 mb-2">{book.title}</h1>
                <div className="grid grid-cols-1 gap-3 text-base text-gray-700">
                  <div><span className="font-semibold text-blue-700">Tác giả:</span> {book.author}</div>
                  <div><span className="font-semibold text-blue-700">Danh mục:</span> {book.category_id}</div>
                  <div><span className="font-semibold text-blue-700">Tổng số lượng:</span> {book.quantity_total}</div>
                  <div><span className="font-semibold text-blue-700">Số lượng sẵn có:</span> {book.quantity_available}</div>
                  <div><span className="font-semibold text-blue-700">Mã QR:</span> {book.qr_code || "Không có"}</div>
                  <div><span className="font-semibold text-blue-700">Mô tả:</span> {book.description || "Không có"}</div>
                  <div><span className="font-semibold text-blue-700">Ẩn:</span> {book.is_hidden ? "Có" : "Không"}</div>
                  <div><span className="font-semibold text-blue-700">Ngày tạo:</span> {new Date(book.createdAt).toLocaleDateString("vi-VN")}</div>
                  <div><span className="font-semibold text-blue-700">Ngày cập nhật:</span> {new Date(book.updatedAt).toLocaleDateString("vi-VN")}</div>
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-8">
                <Button
                  variant="outline"
                  onClick={() => router.push("/inventory")}
                  className="px-6 py-2 text-base font-semibold border-blue-500 text-blue-700 hover:bg-blue-50"
                >
                  Quay lại
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="mt-8 max-w-3xl mx-auto">
        <ReviewForm bookId={id as string} />
      </div>
    </>
  )
}

export default BookDetails
import React from "react"
import { useRouter } from "next/router"
import useGetCategoryById from "@/hooks/api/category/use-get-category-by-id"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

const CategoryDetails = () => {
  const router = useRouter()
  const { id } = router.query
  const { data: category, error, isLoading } = useGetCategoryById(id as string)

  if (isLoading) {
    return <div className="text-center py-10">Đang tải thông tin danh mục...</div>
  }
  if (error || !category) {
    return <div className="text-center py-10 text-destructive">Không thể tải thông tin danh mục.</div>
  }

  return (
    <div className="flex justify-center items-center min-h-[60vh] p-4">
      <Card className="w-full max-w-xl">
        <CardHeader className="flex flex-col items-center gap-2">
          <Avatar className="h-20 w-20 mb-2">
            <AvatarImage src={"/lms_logo.png"} alt={category.name} />
            <AvatarFallback>{category.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl font-bold">{category.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 text-base">
            <div>
              <span className="font-medium">Tên danh mục:</span> {category.name}
            </div>
            <div>
              <span className="font-medium">Ngày tạo:</span> {new Date(category.createdAt).toLocaleDateString("vi-VN")}
            </div>
            <div>
              <span className="font-medium">Ngày cập nhật:</span> {new Date(category.updatedAt).toLocaleDateString("vi-VN")}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-3 mt-4">
          <Button onClick={() => router.push(`/categories/${category._id}/edit`)}>
            Chỉnh sửa
          </Button>
          <Button variant="outline" onClick={() => router.push("/categories")}>
            Quay lại
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default CategoryDetails
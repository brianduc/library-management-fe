import React from "react"
import { useRouter } from "next/router"
import useGetCategoryById from "@/hooks/api/category/use-get-category-by-id"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { useEditCategory } from "@/hooks/api/category/use-edit-category"
import { showSuccessToast } from "@/components/common/toast/toast"

export const categorySchema = z.object({
  name: z.string().min(1, "Tên danh mục là bắt buộc"),
})

export type CategoryData = z.infer<typeof categorySchema>

const EditCategory = () => {
  const router = useRouter()
  const { id } = router.query
  const { data: category, isLoading, error } = useGetCategoryById(id as string)
  const { editCategory } = useEditCategory()

  const form = useForm<CategoryData>({
    resolver: zodResolver(categorySchema),
    defaultValues: category
      ? {
          name: category.name,
        }
      : undefined,
  })

  React.useEffect(() => {
    if (category) {
      form.reset({
        name: category.name,
      })
    }
  }, [category])

  if (isLoading) {
    return (
      <form className="w-full max-w-xl mx-auto py-8 space-y-5">
        <Skeleton className="h-8 w-1/2 mb-2" />
        <Skeleton className="h-10 w-full" />
        <div className="flex gap-3 justify-end pt-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
      </form>
    )
  }

  if (error || !category) {
    return (
      <div className="text-center py-10 text-destructive">
        Không thể tải thông tin danh mục.
      </div>
    )
  }

  const onSubmit = (values: CategoryData) => {
    editCategory({ id: id as string, data: values })
      .then(() => {
        showSuccessToast("Cập nhật danh mục thành công")
        router.push("/categories")
      })
      .catch((error) => {
        showSuccessToast(
          error?.response?.data?.message ||
            error?.message ||
            "Có lỗi xảy ra, vui lòng thử lại sau",
        )
      })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-xl mx-auto p-8 space-y-5"
      >
        <h2 className="text-2xl font-bold mb-2">Chỉnh sửa danh mục</h2>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên danh mục</FormLabel>
              <FormControl>
                <Input placeholder="Nhập tên danh mục" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-3 justify-end pt-2">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/categories")}
          >
            Quay lại
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default EditCategory
import React from "react"
import { useRouter } from "next/router"
import useGetBookById from "@/hooks/api/book/use-get-book-by-id"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
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
import { useEditBook } from "@/hooks/api/book/use-edit-book"
import { showErrorToast, showSuccessToast } from "@/components/common/toast/toast"
import useGetCategories from "@/hooks/api/category/use-get-categories"
import { Alert, AlertDescription } from "@/components/ui/alert"

export const bookSchema = z.object({
  title: z.string().min(1, "Tiêu đề là bắt buộc").optional(),
  author: z.string().min(1, "Tác giả là bắt buộc").optional(),
  description: z.string().optional(),
  quantity_total: z.number().min(0, "Số lượng không được âm").optional(),
  quantity_available: z.number().min(0, "Số lượng sẵn có không được âm").optional(),
  status: z.enum(["available", "damaged", "lost", "borrowed", "out_of_stock"]).optional(),
  is_hidden: z.boolean().optional(),
  category_id: z.string().min(1, "Danh mục là bắt buộc").optional(),
  qr_code: z.string().optional(),
})

export type BookData = z.infer<typeof bookSchema>

const EditBook = () => {
  const router = useRouter()
  const { id } = router.query
  const { data: book, isLoading, error } = useGetBookById(id as string)
  const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useGetCategories()
  const { editBook } = useEditBook()

  const form = useForm<BookData>({
    resolver: zodResolver(bookSchema),
    defaultValues: book
      ? {
          title: book.title,
          author: book.author,
          description: book.description || "",
          quantity_total: book.quantity_total,
          quantity_available: book.quantity_available,
          status: book.status,
          is_hidden: book.is_hidden,
          category_id: book.category_id,
          qr_code: book.qr_code || "",
        }
      : undefined,
  })

  React.useEffect(() => {
    if (book) {
      form.reset({
        title: book.title,
        author: book.author,
        description: book.description || "",
        quantity_total: book.quantity_total,
        quantity_available: book.quantity_available,
        status: book.status,
        is_hidden: book.is_hidden,
        category_id: book.category_id,
        qr_code: book.qr_code || "",
      })
    }
  }, [book, form])

  if (isLoading) {
    return (
      <form className="w-full max-w-xl mx-auto py-8 space-y-5">
        <Skeleton className="h-8 w-1/2 mb-2" />
        {[...Array(9)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
        <div className="flex gap-3 justify-end pt-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
      </form>
    )
  }

  if (error || !book) {
    return (
      <div className="text-center py-10 text-destructive">
        Không thể tải thông tin sách.
      </div>
    )
  }

  const onSubmit = (values: BookData) => {
    editBook({ id: id as string, data: values })
      .then(() => {
        showSuccessToast("Cập nhật sách thành công")
        router.push("/books")
      })
      .catch((error) => {
        showErrorToast(
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
        <h2 className="text-2xl font-bold mb-2">Chỉnh sửa sách</h2>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tiêu đề</FormLabel>
              <FormControl>
                <Input placeholder="Nhập tiêu đề" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="author"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tác giả</FormLabel>
              <FormControl>
                <Input placeholder="Nhập tác giả" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả</FormLabel>
              <FormControl>
                <Input placeholder="Nhập mô tả" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="quantity_total"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tổng số lượng</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Nhập tổng số lượng"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="quantity_available"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số lượng sẵn có</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Nhập số lượng sẵn có"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trạng thái</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Sẵn có</SelectItem>
                    <SelectItem value="borrowed">Đã mượn</SelectItem>
                    <SelectItem value="damaged">Hư hỏng</SelectItem>
                    <SelectItem value="lost">Mất</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="is_hidden"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Ẩn sách</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Danh mục</FormLabel>
              <FormControl>
                {categoriesLoading ? (
                  <Skeleton className="h-10 w-full" />
                ) : categoriesError ? (
                  <Alert variant="destructive" className="py-2">
                    <AlertDescription>
                      Không thể tải danh mục. Vui lòng thử lại sau.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={!categories || categories.length === 0}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="qr_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mã QR</FormLabel>
              <FormControl>
                <Input placeholder="Nhập mã QR" {...field} />
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
            onClick={() => router.push("/books")}
          >
            Quay lại
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default EditBook
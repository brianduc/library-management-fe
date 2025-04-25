import React from "react"
import { useRouter } from "next/router"
import { Button } from "@/components/ui/button"
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
import { useAddBook } from "@/hooks/api/book/use-add-book"
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/common/toast/toast"
import useGetCategories from "@/hooks/api/category/use-get-categories"
import { Skeleton } from "@/components/ui/skeleton"
import uploadFile from "@/helpers/uploadFile"

export const bookSchema = z.object({
  title: z.string().min(1, "Tiêu đề là bắt buộc"),
  author: z.string().min(1, "Tác giả là bắt buộc"),
  description: z.string().optional(),
  quantity_total: z.number().min(0, "Số lượng không được âm"),
  quantity_available: z.number().min(0, "Số lượng sẵn có không được âm"),
  status: z.enum(["available", "damaged", "lost", "borrowed"]),
  is_hidden: z.boolean(),
  category_id: z.string().min(1, "Danh mục là bắt buộc"),
  qr_code: z.string().optional(),
})

export type BookData = z.infer<typeof bookSchema>

const AddBook = () => {
  const router = useRouter()
  const { addBook, loading } = useAddBook()
  const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useGetCategories()

  const [image, setImage] = React.useState<File | null>(null)

  const form = useForm<BookData>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: "",
      author: "",
      description: "",
      quantity_total: 1,
      quantity_available: 1,
      status: "available",
      is_hidden: false,
      category_id: "",
      qr_code: "",
    },
  })

  const onSubmit = async (values: BookData) => {
    try {
      let imageUrl = ""
      if (image) {
        const uploadResult = await uploadFile(image)
        imageUrl = uploadResult.secure_url
      }

      const payload = {
        ...values,
        image_url: imageUrl,
      }
      console.log("payload: ", payload)



      await addBook({ data: payload })
      showSuccessToast("Thêm sách thành công!")
      router.push("/books")
    } catch (error: any) {
      showErrorToast(error?.response?.data?.message || "Thêm sách thất bại!")
    }
  }


  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-xl mx-auto py-8 space-y-5"
      >
        <h2 className="text-2xl font-bold mb-2">Thêm sách</h2>
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
        <FormItem>
          <FormLabel>Ảnh bìa</FormLabel>
          <FormControl>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setImage(e.target.files[0])
                }
              }}
            />
          </FormControl>
        </FormItem>
        {image && (
          <img
            src={URL.createObjectURL(image)}
            alt="Preview"
            className="h-40 object-cover mt-2 rounded"
          />
        )}



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
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Sẵn có</SelectItem>
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
                  <div className="text-sm text-destructive">
                    Không thể tải danh mục
                  </div>
                ) : (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={!categories || categories.length === 0}
                  >
                    <SelectTrigger>
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
          <Button
            type="submit"
            disabled={form.formState.isSubmitting || loading}
          >
            {form.formState.isSubmitting || loading
              ? "Đang lưu..."
              : "Thêm sách"}
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

export default AddBook
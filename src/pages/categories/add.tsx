import React from "react"
import { useRouter } from "next/router"
import { Button } from "@/components/ui/button"
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
import { useAddCategory } from "@/hooks/api/category/use-add-category"
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/common/toast/toast"

export const categorySchema = z.object({
  name: z.string().min(1, "Tên danh mục là bắt buộc"),
})

export type CategoryData = z.infer<typeof categorySchema>

const AddCategory = () => {
  const router = useRouter()
  const { addCategory, loading } = useAddCategory()

  const form = useForm<CategoryData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
    },
  })

  const onSubmit = async (values: CategoryData) => {
    await addCategory({ data: values })
      .then(() => {
        showSuccessToast("Thêm danh mục thành công!")
        router.push("/categories")
      })
      .catch(() => {
        showErrorToast("Thêm danh mục thất bại!")
      })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-xl mx-auto py-8 space-y-5"
      >
        <h2 className="text-2xl font-bold mb-2">Thêm danh mục</h2>
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
          <Button
            type="submit"
            disabled={form.formState.isSubmitting || loading}
          >
            {form.formState.isSubmitting || loading
              ? "Đang lưu..."
              : "Thêm danh mục"}
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

export default AddCategory
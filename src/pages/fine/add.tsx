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
import useAddFine from "@/hooks/api/fine/fine-add-fine"
import useGetUsersV2 from "@/hooks/api/user/use-get-users-v2"
import useGetBooksV2 from "@/hooks/api/book/use-get-books-v2"
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/common/toast/toast"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select"

const formSchema = z.object({
  user_id: z.string().min(1, "Vui lòng chọn hội viên"),
  book_id: z.string().min(1, "Vui lòng chọn sách"),
  amount: z.number().min(1, "Vui lòng nhập số tiền phạt"),
  reason: z.string().min(1, "Vui lòng nhập lý do phạt"),
  is_paid: z.boolean().default(false),
})

const AddFine = () => {
  const router = useRouter()
  const { addFine, loading } = useAddFine()
  const {
    data: users,
    error: usersError,
    isLoading: usersLoading,
  } = useGetUsersV2()
  const {
    data: books,
    error: booksError,
    isLoading: booksLoading,
  } = useGetBooksV2()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user_id: "",
      book_id: "",
      amount: 0,
      reason: "",
      is_paid: false,
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const submitData = {
        ...values,
        book_id: values.book_id,
        user_id: values.user_id,
        amount: parseInt(values.amount.toString()),
        is_paid: values.is_paid || false,
      }
      await addFine({ data: submitData })
      showSuccessToast("Thêm phạt thành công!")
      router.push("/fine")
    } catch (error) {
      showErrorToast("Thêm phạt thất bại!")
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-xl mx-auto py-8 space-y-5"
      >
        <h2 className="text-2xl font-bold mb-2">Thêm phạt</h2>
        <FormField
          control={form.control}
          name="user_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hội viên</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={usersLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn hội viên" />
                  </SelectTrigger>
                  <SelectContent>
                    {users?.map((user) => (
                      <SelectItem key={user._id} value={user._id}>
                        {user.full_name} - {user.identity_number}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="book_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sách</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={booksLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn sách" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(books) &&
                      books.map((book) => (
                        <SelectItem key={book._id} value={book._id}>
                          {book.title} - {book.author}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số tiền phạt</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Nhập số tiền phạt"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lý do phạt</FormLabel>
              <FormControl>
                <Input placeholder="Nhập lý do phạt" {...field} />
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
              : "Thêm phạt"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/fine")}
          >
            Quay lại
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default AddFine

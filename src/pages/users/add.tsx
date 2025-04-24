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
import { useAddUser } from "@/hooks/api/user/use-add-user"
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/common/toast/toast"

const formSchema = z.object({
  full_name: z.string().min(1, "Vui lòng nhập tên"),
  email: z.string().email("Email không hợp lệ"),
  identity_number: z.string().min(1, "Vui lòng nhập mã hội viên"),
  phone: z.string().min(1, "Vui lòng nhập số điện thoại"),
  role: z.enum(["admin", "staff", "member"]),
  is_active: z.boolean().default(true),
})

const AddUser = () => {
  const router = useRouter()
  const { addUser, loading } = useAddUser()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      email: "",
      identity_number: "",
      phone: "",
      role: "member",
      is_active: true,
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await addUser({ data: values })
      .then(() => {
        showSuccessToast("Thêm hội viên thành công!")
        router.push("/users")
      })
      .catch(() => {
        showErrorToast("Thêm hội viên thất bại!")
      })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-xl mx-auto py-8 space-y-5"
      >
        <h2 className="text-2xl font-bold mb-2">Thêm hội viên</h2>
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Họ và tên</FormLabel>
              <FormControl>
                <Input placeholder="Nhập họ và tên" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Nhập email" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="identity_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mã hội viên</FormLabel>
              <FormControl>
                <Input placeholder="Nhập mã hội viên" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số điện thoại</FormLabel>
              <FormControl>
                <Input placeholder="Nhập số điện thoại" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vai trò</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn vai trò" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Quản trị viên</SelectItem>
                    <SelectItem value="staff">Nhân viên</SelectItem>
                    <SelectItem value="member">Thành viên</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Trạng thái hoạt động</FormLabel>
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
        <div className="flex gap-3 justify-end pt-2">
          <Button
            type="submit"
            disabled={form.formState.isSubmitting || loading}
          >
            {form.formState.isSubmitting || loading
              ? "Đang lưu..."
              : "Thêm hội viên"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/users")}
          >
            Quay lại
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default AddUser

import React from "react"
import { useRouter } from "next/router"
import useGetUserById from "@/hooks/api/user/use-get-user-by-id"
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
import { useEditUser } from "@/hooks/api/user/use-edit-user"
import { showSuccessToast } from "@/components/common/toast/toast"

const formSchema = z.object({
  full_name: z.string().min(1, "Vui lòng nhập tên"),
  email: z.string().email("Email không hợp lệ"),
  identity_number: z.string().min(1, "Vui lòng nhập mã hội viên"),
  phone: z.string().min(1, "Vui lòng nhập số điện thoại"),
  role: z.enum(["admin", "staff", "member"]),
  is_active: z.boolean(),
})

const EditUser = () => {
  const router = useRouter()
  const { id } = router.query
  const { data: user, isLoading, error } = useGetUserById(id as string)
  const { editUser } = useEditUser()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: user
      ? {
          full_name: user.full_name,
          email: user.email,
          identity_number: user.identity_number,
          phone: user.phone,
          role: user.role,
          is_active: user.is_active,
        }
      : undefined,
  })

  React.useEffect(() => {
    if (user) {
      form.reset({
        full_name: user.full_name,
        email: user.email,
        identity_number: user.identity_number,
        phone: user.phone,
        role: user.role,
        is_active: user.is_active,
      })
    }
  }, [user])

  if (isLoading) {
    return (
      <form className="w-full max-w-xl mx-auto py-8 space-y-5">
        <Skeleton className="h-8 w-1/2 mb-2" />
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
        <div className="flex gap-3 justify-end pt-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
      </form>
    )
  }

  if (error || !user) {
    return (
      <div className="text-center py-10 text-destructive">
        Không thể tải thông tin hội viên.
      </div>
    )
  }

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    editUser({ id: id as string, data: values })
      .then(() => {
        showSuccessToast("Cập nhật hội viên thành công")
        router.push("/users")
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
        className="w-full mx-auto p-8 space-y-5"
      >
        <h2 className="text-2xl font-bold mb-2">Chỉnh sửa hội viên</h2>
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
                  <SelectTrigger className="w-full">
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
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
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

export default EditUser

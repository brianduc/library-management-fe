import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import useSWR from "swr"
import { Endpoints } from "@/lib/endpoints"
import { axiosFetcher } from "@/lib/utils"
import { Calendar, ChevronLeft, Clock, User, Book as BookIcon } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Book } from "@/hooks/api/book/use-get-books"
import useGetCategories from "@/hooks/api/category/use-get-categories"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

// Form schema
const borrowSchema = z.object({
  note: z.string().optional(),
});

type BorrowFormValues = z.infer<typeof borrowSchema>;

const BookDetailPage = () => {
  const router = useRouter()
  const { id } = router.query
  const [borrowDialogOpen, setBorrowDialogOpen] = useState(false)

  // Fetch book details - only run when id is available
  const {
    data: book,
    error,
    isLoading,
    mutate,
  } = useSWR<Book>(
    id ? Endpoints.Books.GET_BY_ID(id as string) : null,
    axiosFetcher
  )

  // Fetch categories for displaying category name
  const { data: categories } = useGetCategories()

  // Form for borrowing
  const form = useForm<BorrowFormValues>({
    resolver: zodResolver(borrowSchema),
    defaultValues: {
      note: "",
    },
  })

  // Reset form when dialog opens
  useEffect(() => {
    if (borrowDialogOpen) {
      form.reset({ note: "" });
    }
  }, [borrowDialogOpen, form]);

  // Get category name
  const categoryName = 
    book?.category_id && categories
    ? categories.find((cat) => cat._id === book.category_id)?.name
    : "Không có danh mục"

  const handleGoBack = () => {
    router.back()
  }

  const onBorrowSubmit = (values: BorrowFormValues) => {
    console.log("Borrow request:", { bookId: id, ...values })
    
    // Here you would make the API call to borrow the book
    // After successful API call, you would update the book data
    
    // For now, just close the dialog
    setBorrowDialogOpen(false)
    
    // In a real implementation, you would refresh the book data
    // mutate();
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <Button
          variant="ghost"
          onClick={handleGoBack}
          className="mb-6 flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Quay lại
        </Button>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="md:col-span-2 space-y-6">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-32 w-full" />
            <div className="flex gap-4">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !book) {
    return (
      <div className="container mx-auto py-10">
        <Button
          variant="ghost"
          onClick={handleGoBack}
          className="mb-6 flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Quay lại
        </Button>
        
        <Alert variant="destructive">
          <AlertTitle>Lỗi</AlertTitle>
          <AlertDescription>
            Không thể tải thông tin sách. Vui lòng thử lại sau.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "available": return "Sẵn có"
      case "borrowed": return "Đã mượn"
      case "damaged": return "Hư hỏng"
      case "lost": return "Mất"
      case "out_of_stock": return "Hết hàng"
      default: return status
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "available": return "default"
      case "borrowed": return "secondary"
      case "damaged": return "destructive"
      case "lost": return "destructive"
      case "out_of_stock": return "outline"
      default: return "outline"
    }
  }

  const isBorrowable = book.status === "available" && book.quantity_available > 0

  return (
    <div className="container mx-auto py-10">
      <Button
        variant="ghost"
        onClick={handleGoBack}
        className="mb-6 flex items-center gap-2"
      >
        <ChevronLeft className="h-4 w-4" />
        Quay lại
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left side - QR and actions */}
        <div className="md:col-span-1">
          <Card>
            <CardContent className="pt-6 flex flex-col items-center">
              <div className="bg-muted h-64 w-full flex items-center justify-center rounded-md mb-4">
                {book.qr_code ? (
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${book.qr_code}`}
                    alt="QR Code"
                    className="h-48 object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center text-muted-foreground/50">
                    <BookIcon className="h-12 w-12 mb-2" />
                    <span>Không có mã QR</span>
                  </div>
                )}
              </div>
              
              <div className="w-full space-y-4 mt-4">
                <Button 
                  className="w-full" 
                  disabled={!isBorrowable}
                  onClick={() => setBorrowDialogOpen(true)}
                >
                  Mượn sách
                </Button>

                {!isBorrowable && (
                  <Alert>
                    <AlertDescription>
                      Sách này hiện không có sẵn để mượn.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right side - Book details */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{book.title}</CardTitle>
              <CardDescription className="text-lg">{book.author}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Status & Category */}
              <div className="flex flex-wrap gap-2">
                <Badge variant={getStatusVariant(book.status) as any}>
                  {getStatusText(book.status)}
                </Badge>
                <Badge variant="secondary">{categoryName}</Badge>
              </div>
              
              {/* Description */}
              <div>
                <h3 className="text-lg font-medium mb-2">Mô tả</h3>
                <p className="text-muted-foreground">
                  {book.description || "Không có mô tả cho sách này."}
                </p>
              </div>
              
              <Separator />
              
              {/* Book information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Số lượng</p>
                  <p className="font-medium">
                    {book.quantity_available}/{book.quantity_total} quyển
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Mã QR</p>
                  <p className="font-medium">
                    {book.qr_code || "Không có"}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Ngày tạo</p>
                  <p className="font-medium">
                    {new Date(book.createdAt).toLocaleDateString("vi-VN")}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Cập nhật lần cuối</p>
                  <p className="font-medium">
                    {new Date(book.updatedAt).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Borrow Dialog */}
      <Dialog open={borrowDialogOpen} onOpenChange={setBorrowDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mượn sách</DialogTitle>
            <DialogDescription>
              Điền thông tin để mượn sách &quot;{book.title}&quot;
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onBorrowSubmit)} className="space-y-4">
              <div className="grid gap-2">
                <div className="flex items-center gap-2">
                  <BookIcon className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium">{book.title}</p>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Mượn với tư cách người dùng hiện tại</p>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Ngày mượn: {new Date().toLocaleDateString("vi-VN")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Thời hạn trả: 14 ngày
                  </p>
                </div>
              </div>

              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ghi chú (không bắt buộc)</FormLabel>
                    <FormControl>
                      <textarea
                        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[80px] resize-none"
                        placeholder="Nhập ghi chú nếu có"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setBorrowDialogOpen(false)}>
                  Hủy
                </Button>
                <Button type="submit">Xác nhận mượn</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default BookDetailPage
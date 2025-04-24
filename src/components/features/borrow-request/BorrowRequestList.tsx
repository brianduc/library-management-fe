import { useState, useEffect } from "react";
import { useGetAllBorrowRequest } from "@/hooks/api/borrow-request/use-getAllBorrowRequest";
import { useApproveBorrowRequest } from "@/hooks/api/borrow-request/use-approvedBorrowRequest";
import { useRejectBorrowRequest } from "@/hooks/api/borrow-request/use-rejectedBorrowRequest";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, Clock, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { showErrorToast, showSuccessToast } from "@/components/common/toast/toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const DatePicker = ({ date, onChange }: { date: Date | undefined; onChange: (date: Date | undefined) => void }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[180px] justify-start text-left font-normal">
          {date ? format(date, "dd/MM/yyyy") : <span>Chọn ngày</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={date} onSelect={onChange} initialFocus />
      </PopoverContent>
    </Popover>
  );
};

const BorrowRequestList = () => {
  const { fetchBorrowRequests, borrowRequests, loading } = useGetAllBorrowRequest();
  const { approveRequest } = useApproveBorrowRequest();
  const { rejectRequest } = useRejectBorrowRequest();

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [statusFilter, setStatusFilter] = useState("pending")
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); 

  // Modal-related state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requestToReject, setRequestToReject] = useState(""); 
  useEffect(() => {
    fetchBorrowRequests();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      const res = await approveRequest(id);
      showSuccessToast(res.message);
      fetchBorrowRequests();
    } catch (error: any) {
      showErrorToast(
        error?.response?.data?.message ||
        error?.message ||
        "Có lỗi xảy ra, vui lòng thử lại sau"
      );
    }
  };

  const handleReject = async (id: string) => {
    setRequestToReject(id);
    setIsModalOpen(true);
  };

  const confirmReject = async () => {
    if (!requestToReject) return;
    try {
      const res = await rejectRequest(requestToReject);
      showSuccessToast(res.message);
      fetchBorrowRequests();
    } catch (error: any) {
      showErrorToast(
        error?.response?.data?.message ||
        error?.message ||
        "Có lỗi xảy ra, vui lòng thử lại sau"
      );
    } finally {
      setIsModalOpen(false); 
    }
  };


  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="mr-1 h-3 w-3" />
            Chờ duyệt
          </Badge>
        );
      case "approved":
        return (
          <Badge className="bg-green-50 text-green-700 border-green-200">
            <Check className="mr-1 h-3 w-3" />
            Đã duyệt
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-50 text-red-700 border-red-200">
            <X className="mr-1 h-3 w-3" />
            Từ chối
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredRequests = borrowRequests.filter((request) => {
    const searchLowerCase = searchTerm.toLowerCase();
    const requestDate = new Date(request.request_date);

    const isMatchingSearch =
      request.book_id.title.toLowerCase().includes(searchLowerCase) ||
      request.book_id.author.toLowerCase().includes(searchLowerCase) ||
      request.user_id.full_name.toLowerCase().includes(searchLowerCase) ||
      request.user_id.email.toLowerCase().includes(searchLowerCase);

    const isInDateRange =
      (!startDate || requestDate >= startDate) &&
      (!endDate || requestDate <= endDate);

    const isMatchingStatus = statusFilter === "all" || request.status === statusFilter
    return isMatchingSearch && isInDateRange && isMatchingStatus;
  }).sort((a, b) => new Date(b.request_date).getTime() - new Date(a.request_date).getTime());;



  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems = filteredRequests.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4">
      <h2 className="text-2xl font-bold mb-4">Danh sách yêu cầu mượn sách</h2>

      <div className="mb-4 flex justify-between items-center w-full">
        <Input
          type="text"
          placeholder="Tìm kiếm theo tên sách, tác giả, người mượn, email..."
          className="w-full max-w-xl px-4 py-2 border rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button
          onClick={() => {
            setSearchTerm("");
            setStartDate(undefined);
            setEndDate(undefined);
            setStatusFilter("pending");
            setCurrentPage(1);
          }}
          className="ml-4 bg-red-500 hover:bg-red-600 text-white"
        >
          Xóa lọc tất cả
        </Button>
      </div>


      <div className="flex justify-between">
        <div className="mb-4 flex items-center space-x-2">
          <DatePicker date={startDate} onChange={setStartDate} />
          <span>-</span>
          <DatePicker date={endDate} onChange={setEndDate} />
        </div>
        <div className="mb-4 flex items-center space-x-2">
          <label htmlFor="itemsPerPage">Số mục mỗi trang:</label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="px-4 py-2 border rounded-md bg-black text-white font-medium"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
        <div className="mb-4 flex items-center space-x-2">
          <label htmlFor="statusFilter">Trạng thái:</label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-2 border rounded-md"
          >
            <option value="all">Tất cả</option>
            <option value="pending">Chờ duyệt</option>
            <option value="approved">Đã duyệt</option>
            <option value="rejected">Từ chối</option>
          </select>
        </div>

      </div>
      {currentItems.length > 0 ? (
        <div className="rounded-md border overflow-hidden mb-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên sách</TableHead>
                  <TableHead>Tác giả</TableHead>
                  <TableHead>Người mượn</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày yêu cầu</TableHead>
                  <TableHead>Ngày duyệt</TableHead>
                  <TableHead>Ngày từ chối</TableHead>
                  <TableHead>Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.map((request) => (
                  <TableRow key={request._id}>
                    <TableCell>{request.book_id.title}</TableCell>
                    <TableCell>{request.book_id.author}</TableCell>
                    <TableCell>{request.user_id.full_name}</TableCell>
                    <TableCell>{request.user_id.email}</TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell>{new Date(request.request_date).toLocaleString()}</TableCell>
                    <TableCell>
                      {request.approved_date ? new Date(request.approved_date).toLocaleString() : "-"}
                    </TableCell>
                    <TableCell>
                      {request.rejected_date ? new Date(request.rejected_date).toLocaleString() : "-"}
                    </TableCell>
                    <TableCell className="space-x-2">
                      {request.status === "pending" && (
                        <>
                          <Button variant="secondary" size="sm" onClick={() => handleApprove(request._id)}>
                            Duyệt
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleReject(request._id)}>
                            Từ chối
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-md border mt-4">
          <p className="text-muted-foreground">Không có yêu cầu nào.</p>
        </div>
      )}

      {/* Pagination controls */}
      <Pagination>
        {currentPage > 1 && <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} />}
        <PaginationContent>
          {Array.from({ length: Math.ceil(filteredRequests.length / itemsPerPage) }).map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                isActive={index + 1 === currentPage}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
        </PaginationContent>
        {currentPage < Math.ceil(filteredRequests.length / itemsPerPage) && (
          <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
        )}
      </Pagination>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        {/* Nội dung của Dialog */}
        <DialogContent>
          <h3 className="text-xl font-semibold">Xác nhận từ chối</h3>
          <p>Bạn có chắc chắn muốn từ chối yêu cầu mượn sách này?</p>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={confirmReject}>
              Xác nhận
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BorrowRequestList;

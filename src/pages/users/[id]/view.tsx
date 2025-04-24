import React from "react";
import { useRouter } from "next/router";
import useGetUserById from "@/hooks/api/user/use-get-user-by-id";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Constants } from "@/lib/constants";

const UserDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: user, error, isLoading } = useGetUserById(id as string);

  if (isLoading) {
    return <div className="text-center py-10">Đang tải thông tin hội viên...</div>;
  }
  if (error || !user) {
    return <div className="text-center py-10 text-destructive">Không thể tải thông tin hội viên.</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-[60vh] p-4">
      <Card className="w-full max-w-xl">
        <CardHeader className="flex flex-col items-center gap-2">
          <Avatar className="h-20 w-20 mb-2">
            <AvatarImage src={"/lms_logo.png"} alt={user.full_name} />
            <AvatarFallback>{user.full_name.charAt(0)}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl font-bold">{user.full_name}</CardTitle>
          <div className="flex gap-2 mt-1">
            <Badge>{Constants.roleMap[user.role]}</Badge>
            {user.is_active ? (
              <Badge variant="default" className="bg-green-600">Hoạt động</Badge>
            ) : (
              <Badge variant="destructive">Ngưng hoạt động</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 text-base">
            <div>
              <span className="font-medium">Email:</span> {user.email}
            </div>
            <div>
              <span className="font-medium">Mã hội viên:</span> {user.identity_number}
            </div>
            <div>
              <span className="font-medium">Số điện thoại:</span> {user.phone}
            </div>
            <div>
              <span className="font-medium">Ngày tạo:</span> {new Date(user.createdAt).toLocaleDateString("vi-VN")}
            </div>
            <div>
              <span className="font-medium">Ngày cập nhật:</span> {new Date(user.updatedAt).toLocaleDateString("vi-VN")}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-3 mt-4">
          <Button onClick={() => router.push(`/users/${user._id}/edit`)}>
            Chỉnh sửa
          </Button>
          <Button variant="outline" onClick={() => router.push("/users")}>Quay lại</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default UserDetails;

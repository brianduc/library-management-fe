import React from "react";
import BorrowRequestList from "@/components/features/borrow-request/BorrowRequestList";
import BorrowRequestListByUserId from "@/components/features/borrow-request/BorrowRequestListByUserId";
import { useAtomValue } from "jotai/react";
import { userInfoAtom } from "@/stores/auth";

const BorrowRequest = () => {
  const userInfo = useAtomValue(userInfoAtom);

  return (
    <div>
      {userInfo?.role === "admin" ? (
        <BorrowRequestList />
      ) : (
        <BorrowRequestListByUserId />
      )}
    </div>
  );
};

export default BorrowRequest;

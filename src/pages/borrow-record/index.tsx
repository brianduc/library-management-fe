import React from "react";
import BorrowRecordList from "@/components/features/borrow-record/BorrowRecordList";
import BorrowRecordListByUserId from "@/components/features/borrow-record/BorrowRecordListByUserId";
import { useAtomValue } from "jotai/react";
import { userInfoAtom } from "@/stores/auth";

const BorrowRequest = () => {
  const user = useAtomValue(userInfoAtom);

  return (
    <div>
      {user?.role === "admin" ? (
        <BorrowRecordList />
      ) : (
        <BorrowRecordListByUserId />
      )}
    </div>
  );
};

export default BorrowRequest;

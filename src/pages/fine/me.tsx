import React from "react"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select"
import { usePayFine } from "@/hooks/api/fine/fine-pay-fine"
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/common/toast/toast"
import fineGetFines from "@/hooks/api/fine/fine-get-fines"
import { useAtomValue } from "jotai/react"
import { userInfoAtom } from "@/stores/auth"
import fineGetFineByUser from "@/hooks/api/fine/fine-getbyuser"
import FineAdmin from "./fineAdmin"
import FineMember from "./fineMember"


const FineMePage = () => {
  const user = useAtomValue(userInfoAtom);
  return (
    <>
    {
      user?.role === "admin" ? (
        <FineAdmin />
      ) : (
        <FineMember />
      )
    }
    </>

  )
}

export default FineMePage

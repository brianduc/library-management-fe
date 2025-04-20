import React from 'react'
import { toast } from 'sonner'

export const showSuccessToast = (message: string) => {
  toast.success(
    <div>
      <span className="font-bold">Thành công: </span>
      {message}
    </div>,
    { className: 'bg-green-500 text-white' }
  )
}

export const showErrorToast = (message: string) => {
  toast.error(
    <div>
      <span className="font-bold">Lỗi: </span>
      {message}
    </div>,
    { className: 'bg-red-500 text-white' }
  )
}

export const showWarningToast = (message: string) => {
  toast(
    <div>
      <span className="font-bold">Cảnh báo: </span>
      {message}
    </div>,
    { className: 'bg-yellow-500 text-black' }
  )
}

export const showInfoToast = (message: string) => {
  toast(
    <div>
      <span className="font-bold">Thông tin: </span>
      {message}
    </div>,
    { className: 'bg-blue-500 text-white' }
  )
}
import { useAxios } from "@/hooks/api/use-axios"
import { useState } from "react"

export const useDeleteCategory = () => {
    const axios = useAxios()
    const [loading, setLoading] = useState(false)

    const deleteCategory = async ({ id }: { id: string }) => {
        try {
            setLoading(true)
            const response = await axios.delete(`books/${id}`)
            return response.data
        } catch (error) {
            throw error
        } finally {
            setLoading(false)
        }
    }

    return { deleteCategory, loading }
}

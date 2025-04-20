import axiosService from "@/lib/services/axios.service";

export const useAxios = () => {
  return axiosService.getAxiosInstance();
};

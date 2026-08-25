export interface Center {
  centerId?: number;
  centerCode: string;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  status: string;
  createdAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

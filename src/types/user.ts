export interface User {
  id: string
  fullname: string
  document: string
  phoneNumber: string
  email: string
  profileImage?: string
  password?: string
  role?: string
  createdAt?: string
  forms?: any[]
  bookings?: Booking[]
}

interface Booking {
  id: string
  formId: string
  userId: string
  data: any
  status: string
  createdAt: string
}


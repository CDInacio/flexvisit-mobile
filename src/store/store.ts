import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'

export interface User {
  id: string
  fullname: string
  document: string
  phoneNumber: string
  email: string
  profileImage: string
  password: string
  role: string
  createdAt: string
  forms?: any[]
  bookings?: Booking[]
}

export interface Booking {
  id: string
  formId: string
  userId: string
  data: any
  status: string
  createdAt: string
}

interface State {
  user: User | null
}

interface Actions {
  setUserData: (data: User | null) => void
  logout: () => void
}

const useAuthStore = create<State & Actions>((set) => ({
  user: null,
  setUserData: (data: User | null) => {
    set({ user: data })
  },
  logout: async () => {
    await AsyncStorage.removeItem('token')
    await AsyncStorage.removeItem('userToken')
    set({ user: null })
  },
}))

export default useAuthStore

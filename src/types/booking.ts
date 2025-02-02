import type { User } from "./user"

export interface Booking {
  id: string
  createdAt: string
  data: unknown
  form: {
    id: string;
    form_name: string;
    form_description: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    user_id: string;
  };
  observation: string | null;  formId: string
  user: User
  status: string
  userId: string
}

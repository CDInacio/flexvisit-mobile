export interface Notification {
  id: string; 
  message: string; 
  description: string; 
  createdAt: string; 
  updatedAt: string; 
  read: boolean; 
  recipientId: string | null; 
  recipientRole: string; 
}
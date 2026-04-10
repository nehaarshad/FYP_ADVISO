export interface Chat {
  id: number;
  senderId: number;
  receiverId: number;
  batchId: number;
  createdAt?: string;
  updatedAt?: string;
}
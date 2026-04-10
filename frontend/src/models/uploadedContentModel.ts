type UploadedContentType = 'timetable' | 'courseOffering' | 'roadmap' | 'results';

export interface UploadedContent {
  id: number;
  sessionId: number;
  uploadedType: UploadedContentType;
  attachment: string;
  createdAt?: string;
  updatedAt?: string;
}
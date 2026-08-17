import APIs from "../../services/appApis/apiUrl";
import paramsUrl  from "../../utilits/constructUrl/constructParamsUrl";

export interface UploadedChatFile {
  originalName: string;
  fileName: string;
  mimeType: string;
  size: number;
  url: string;
}

class ChatRepository {
  async uploadFile(file: File) {
    const formData = new FormData();

    formData.append("chatfile", file);

    const response = await fetch(APIs.chatUploadUrl, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data?.message || data?.error || "File upload failed"
      );
    }

    return data.file as UploadedChatFile;
  }

  async deleteFile(filename: string) {
    const url = paramsUrl(APIs.chatDeleteUrl, {
      filename,
    });

    const response = await fetch(url, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data?.message || data?.error || "File deletion failed"
      );
    }

    return data;
  }
}

export const chatRepository = new ChatRepository();
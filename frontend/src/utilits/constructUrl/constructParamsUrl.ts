

export default function paramsUrl(url: string, params: Record<string, string | number>): string {
    let constructedUrl = url;
    Object.entries(params).forEach(([key, value]) => {
      constructedUrl = constructedUrl.replace(`:${key}`, String(value));
    });
    return constructedUrl;
  
}
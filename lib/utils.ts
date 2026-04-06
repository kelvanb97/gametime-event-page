
export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
 
  // Vercel provides this automatically in preview/production
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
 
  return "http://localhost:3000";
}
 
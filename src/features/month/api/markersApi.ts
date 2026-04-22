import { apiGet } from "@/lib/api/api";

export async function getMonthMarkers(month: string) {
  return apiGet(`/month/${month}/markers`);
}

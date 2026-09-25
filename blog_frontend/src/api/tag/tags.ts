import { http } from "../http";

export async function getTagsSum() {
  return http.get<number, number>("/tags/getSum")
}
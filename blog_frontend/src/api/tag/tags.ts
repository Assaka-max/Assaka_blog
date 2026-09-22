import { http } from "../http";

export async function getTagsSum() {
  const res = await http.get<number>("/tags/getSum")
  return res.data
}
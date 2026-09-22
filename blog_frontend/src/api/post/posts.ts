import { http } from "../http";

export async function getPostsSum() {
  const res = await http.get<number>("/posts/getSum")
  return res.data
}
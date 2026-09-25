import { http } from "../http";

export async function getPostsSum() {
  return http.get<number, number>("/posts/getSum")
}
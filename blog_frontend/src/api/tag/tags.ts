import { http } from "../http";

export interface TagWithCount {
  id: number;
  name: string;
  slug: string;
  count: number;
}

export async function getTagsSum() {
  return http.get<number, number>("/tags/getSum")
}

export async function getTagList() {
  return http.get<TagWithCount[], TagWithCount[]>("/tags")
}
import useSWR from "swr";

const fetcher = (url) =>
  fetch(url, {
    credentials: "include",
  }).then((res) => res.json());

export function useUser() {
  return useSWR("/api/profile", fetcher);
}

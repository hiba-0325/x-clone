"use client";

import { useEffect } from "react";
import { fetchSearchUsers } from "@/lib/store/thunks/chat-thunks";
import { useAppDispatch, useAppSelector } from "./store/hook";

export default function useDebounce({ query }: { query: string }) {
  const { users } = useAppSelector((state) => state.chat);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim()) {
        dispatch(fetchSearchUsers(query));
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query, dispatch]);
  return users;
}
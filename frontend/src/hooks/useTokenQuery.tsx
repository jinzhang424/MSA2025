import { useSelector } from "react-redux";
import { useEffect } from "react";
import type { RootState } from "../store/store";

export function useTokenQuery<T extends any[]>(
  apiCall: (token: string, ...args: T) => void,
  ...args: T
) {
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (user?.token != '') {
      apiCall(user.token, ...args);
    }
  }, [user?.token]);
}
import { useToastStore } from "../components/Toast.jsx";

export function useToast() {
  const push = useToastStore((state) => state.push);
  return { toast: push };
}

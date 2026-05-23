import { create } from "zustand";

export const useToastStore = create((set) => ({
  toasts: [],
  push: (message, tone = "info") => {
    const id = crypto.randomUUID();
    set((state) => ({ toasts: [...state.toasts, { id, message, tone }] }));
    window.setTimeout(() => set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) })), 3000);
  },
  remove: (id) => set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) })),
}));

export function ToastViewport() {
  const { toasts, remove } = useToastStore();

  return (
    <div className="toast-viewport" aria-live="polite">
      {toasts.map((toast) => (
        <button className={`app-toast toast-${toast.tone}`} key={toast.id} onClick={() => remove(toast.id)}>
          {toast.message}
        </button>
      ))}
    </div>
  );
}

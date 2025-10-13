import { StateType } from "@/lib/definations";
import {
  startTransition,
  useActionState,
  useEffect,
  useState,
  useCallback,
} from "react";
import { toast } from "sonner";

export default function useAction<State extends StateType, Payload>(
  func: (
    s: Awaited<State> | undefined,
    p: Payload | undefined
  ) => State | Promise<State>,
  initData: Awaited<State>,
  other?: {
    loading?: string;
    success?: string | { title: string; description: string };
    error?: string | { title: string; description: string };
    onSuccess?: (state: NonNullable<Awaited<State>>) => void;
    onError?: (data: { cause: string; message: string }) => void;
  }
): {
  state: Awaited<State>;
  isPending: boolean;
  action: (payload?: Payload) => void;
  refresh: () => void;
  reset: () => void;
} {
  const [state, action, isPending] = useActionState(func, initData),
    [toastId, setToastId] = useState<string | number>();

  const handleAction = useCallback(
    (v?: Payload) => {
      startTransition(() => {
        action(v);
      });
    },
    [action]
  );

  const refresh = useCallback(() => {
    startTransition(() => {
      action(undefined);
    });
  }, [action]);

  const showToast = useCallback(
    (
      type: "loading" | "success" | "error",
      message: string | { title: string; description: string }
    ) => {
      if (type === "loading") {
        setToastId(toast.loading(message as string));
      } else {
        toast[type](typeof message === "string" ? message : message.title, {
          description:
            typeof message === "string" ? undefined : message.description,
          id: toastId,
        });
      }
    },
    [toastId]
  );

  useEffect(() => {
    if (isPending && other?.loading) {
      showToast("loading", other.loading);
    }
  }, [isPending]);

  useEffect(() => {
    if (state) {
      if (state.status) {
        if (other?.success) showToast("success", other.success);
        other?.onSuccess?.(state);
      } else {
        if (other?.error) showToast("error", other.error);
        other?.onError?.({
          cause: state.cause,
          message: state.message,
        });
      }
      // Don't automatically refresh - let the component handle state reset
    }
  }, [state]);

  useEffect(() => {
    return () => {
      toast.dismiss(toastId);
    };
  }, []);

  const reset = useCallback(() => {
    // Reset the action state to initial state
    startTransition(() => {
      action(undefined);
    });
  }, [action]);

  return {
    state,
    isPending,
    action: handleAction,
    refresh,
    reset,
  };
}

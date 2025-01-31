import { Toast } from "@/hooks/use-toast";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { NextRouter } from "next/router";
import { create } from "zustand";

interface TimerState {
  currentTime: number;
  isVisible: boolean;
  timerStarted: boolean;
  intervalId: NodeJS.Timeout | null;
  toggleTimer: (
    limit: number,
    toast: (val: Toast) => object,
    router: AppRouterInstance,
    onClose: () => void
  ) => void;
  toggleVisibiliy: (isVisible: boolean) => void;
  startTimer: (
    limit: number,
    toast: (val: Toast) => object,
    router: AppRouterInstance,
    onClose: () => void
  ) => void;
  stopTimer: () => void;
}

export const useTimerStore = create<TimerState>((set, get) => ({
  currentTime: 0,
  isVisible: true,
  timerStarted: false,
  intervalId: null,

  toggleTimer: (limit, toast, router, onClose) => {
    if (!get().timerStarted) {
      get().startTimer(limit, toast, router, onClose);
    } else if (get().timerStarted && !get().intervalId) {
      get().startTimer(limit, toast, router, onClose);
    } else if (get().timerStarted && get().intervalId) {
      get().stopTimer();
    }
  },
  toggleVisibiliy: () => {
    set({ isVisible: !get().isVisible });
  },

  startTimer: (limit, toast, router, onClose) => {
    const intervalId = setInterval(() => {
      if (get().currentTime >= limit) {
        toast({
          title: "Time's up",
          description: "You have reached the limit",
        });
        onClose();
        router.push("/signup");
        clearInterval(get().intervalId!);
      }

      set((state) => ({ currentTime: state.currentTime + 1 }));
    }, 1000);
    set({ timerStarted: true, intervalId });
  },

  stopTimer: () => {
    const { timerStarted, intervalId } = get();
    if (!timerStarted) return; // Clear the interval
    if (intervalId) clearInterval(intervalId);
    set({ intervalId: null }); // Reset state
  },

  
}));

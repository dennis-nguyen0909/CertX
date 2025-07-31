type Callback<T = unknown> = (data?: T) => void;

const listeners: Record<string, Callback[]> = {};

export const eventBus = {
  on<T = unknown>(event: string, callback: Callback<T>) {
    listeners[event] = listeners[event] || [];
    listeners[event].push(callback as Callback);
  },
  off<T = unknown>(event: string, callback: Callback<T>) {
    listeners[event] = (listeners[event] || []).filter((cb) => cb !== callback);
  },
  emit<T = unknown>(event: string, data?: T) {
    (listeners[event] || []).forEach((callback) => {
      (callback as Callback<T>)(data);
    });
  },
};

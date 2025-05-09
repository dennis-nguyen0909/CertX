interface Window {
  ethereum?: {
    request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    on: (eventName: string, handler: (...args: unknown[]) => void) => void;
    removeAllListeners: (eventName: string) => void;
  };
}

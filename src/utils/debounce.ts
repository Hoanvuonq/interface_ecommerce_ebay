/* eslint-disable @typescript-eslint/no-explicit-any */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

export function debouncePromise<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  wait = 300
) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let pending: {
    resolve: (value: any) => void;
    reject: (reason?: any) => void;
  }[] = [];
  let lastArgs: any[] = [];

  return (...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> => {
    lastArgs = args;
    if (timer) clearTimeout(timer);

    return new Promise<Awaited<ReturnType<T>>>((resolve, reject) => {
      pending.push({ resolve, reject });

      timer = setTimeout(async () => {
        timer = null;
        const currentPending = pending;
        pending = [];

        try {
          const result = await fn(...lastArgs);
          currentPending.forEach(({ resolve }) => resolve(result));
        } catch (err) {
          currentPending.forEach(({ reject }) => reject(err));
        }
      }, wait);
    });
  };
}
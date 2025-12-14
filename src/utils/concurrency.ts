/**
 * WINNER: Function with Options Pattern ✅
 *
 * Why:
 * 1. Simpler - no class overhead
 * 2. More idiomatic JavaScript/TypeScript
 * 3. Tree-shakeable (better for bundle size)
 * 4. Easier to test
 * 5. Familiar API (like fetch, Promise.all, etc.)
 */

export interface ConcurrencyOptions {
  limit?: number;
  retries?: number;
  retryDelay?: number;
  retryBackoff?: number;
  onRetry?: (attempt: number, error: Error, index: number) => void;
  onProgress?: (completed: number, total: number) => void;
}

export async function limitConcurrency<T, R>(
  items: T[],
  fn: (item: T, index: number) => Promise<R>,
  options: ConcurrencyOptions = {}
): Promise<R[]> {
  const {
    limit = 5,
    retries = 0,
    retryDelay = 500,
    retryBackoff = 2,
    onRetry,
    onProgress,
  } = options;

  if (limit <= 0) throw new Error('Concurrency limit must be greater than 0');
  if (retries < 0) throw new Error('Retries must be non-negative');

  const results: R[] = new Array(items.length);
  const executing = new Set<Promise<void>>();
  let completed = 0;

  for (let i = 0; i < items.length; i++) {
    const executeWithRetry = async (): Promise<R> => {
      if (retries === 0) {
        return await fn(items[i], i);
      }

      let lastError: Error;
      for (let attempt = 1; attempt <= retries + 1; attempt++) {
        try {
          return await fn(items[i], i);
        } catch (error) {
          lastError = error as Error;

          if (attempt === retries + 1) {
            throw lastError;
          }

          onRetry?.(attempt, lastError, i);

          const delay = retryDelay * Math.pow(retryBackoff, attempt - 1);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }

      throw lastError!;
    };

    const promise = executeWithRetry()
      .then(result => {
        results[i] = result;
        completed++;
        onProgress?.(completed, items.length);
      })
      .finally(() => {
        executing.delete(promise);
      });

    executing.add(promise);

    if (executing.size >= limit) {
      await Promise.race(executing);
    }
  }

  await Promise.all(executing);
  return results;
}

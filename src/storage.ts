// Treat persisted data as untrusted: older versions and manual edits may change it.
export function readStoredJSON(key: string): unknown {
  try {
    const value = localStorage.getItem(key);
    return value === null ? null : JSON.parse(value);
  } catch {
    return null;
  }
}

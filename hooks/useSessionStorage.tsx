/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

// Hook
function useSessionStorage<T>() {
  // Update sessionStorage when state changes
  const setValue = (key: string, value: any) => {
    try {
      const valueToStore = value instanceof Function ? value() : value;
      sessionStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Error setting sessionStorage key "${key}":`, error);
    }
  };

  const getAllValues = (): { key: string; value: any }[] => {
    const items: { key: string; value: any }[] = [];

    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key) {
        const value = sessionStorage.getItem(key);
        try {
          items.push({ key, value: value ? JSON.parse(value) : value });
        } catch (error) {
          console.warn(`Error parsing sessionStorage item "${key}":`, error);
          items.push({ key, value });
        }
      }
    }
    return items;
  };

  function clearAllValues() {
    sessionStorage.clear();
  }

  return { setValue, getAllValues, clearAllValues } as const;
}

export default useSessionStorage;

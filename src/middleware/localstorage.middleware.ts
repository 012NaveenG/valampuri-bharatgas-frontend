interface ExpiringItem<T> {
    value: T;
    expiry: number;
}

// Utility function to set data with an expiry time (in hours)
export function setItemWithExpiry<T>(key: string, value: T, hours: number): void {
    const now = new Date();
  
    // Calculate the expiry time in milliseconds
    const expiryTime = now.getTime() + hours * 60 * 60 * 1000; // Convert hours to milliseconds
  
    const data = {
      value: value,
      expiry: expiryTime,
    };
  
    localStorage.setItem(key, JSON.stringify(data));
  }
  


export function getItemWithExpiry<T>(key: string): T | null {
    const itemStr = localStorage.getItem(key);

    // If the item doesn't exist, return null
    if (!itemStr) {
        return null;
    }

    const item: ExpiringItem<T> = JSON.parse(itemStr);
    const now = new Date();

    // Check if the item has expired
    if (now.getTime() > item.expiry) {
        // If expired, remove the item from localStorage and return null
        localStorage.removeItem(key);
        return null;
    }

    return item.value;
}

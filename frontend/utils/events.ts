// Create a simple event emitter for cart and wishlist updates
class EventEmitter {
  private listeners: (() => void)[] = [];
  
  subscribe(callback: () => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }
  
  emit() {
    this.listeners.forEach(listener => listener());
  }
}

// Global event emitters
export const cartEvents = new EventEmitter();
export const wishlistEvents = new EventEmitter();


// Export functions to trigger refreshes from other components
export const triggerCartRefresh = () => {
  cartEvents.emit();
};

export const triggerWishlistRefresh = () => {
  wishlistEvents.emit();
};
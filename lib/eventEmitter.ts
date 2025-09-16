/**
 * Simple event emitter for cross-platform communication
 * Used to notify components when mood entries are saved/updated
 */

type EventCallback = (data?: any) => void;

class EventEmitter {
  private events: { [key: string]: EventCallback[] } = {};

  on(event: string, callback: EventCallback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  off(event: string, callback: EventCallback) {
    if (!this.events[event]) return;
    
    this.events[event] = this.events[event].filter(cb => cb !== callback);
  }

  emit(event: string, data?: any) {
    if (!this.events[event]) return;
    
    this.events[event].forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in event callback for ${event}:`, error);
      }
    });
  }

  removeAllListeners(event?: string) {
    if (event) {
      delete this.events[event];
    } else {
      this.events = {};
    }
  }
}

// Create a singleton instance
export const eventEmitter = new EventEmitter();

// Export convenience functions
export const emitMoodEntrySaved = (moodEntry: any) => {
  eventEmitter.emit('moodEntrySaved', { moodEntry, timestamp: Date.now() });
};

export const onMoodEntrySaved = (callback: EventCallback) => {
  eventEmitter.on('moodEntrySaved', callback);
};

export const offMoodEntrySaved = (callback: EventCallback) => {
  eventEmitter.off('moodEntrySaved', callback);
};

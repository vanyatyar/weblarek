export class EventEmitter {
  private events: { [eventName: string]: Function[] } = {};

  on(eventName: string, callback: Function) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
  }

  emit(eventName: string, data?: any) {
    const eventCallbacks = this.events[eventName];
    if (eventCallbacks) {
      eventCallbacks.forEach(callback => {
        callback(data);
      });
    }
  }

  off(eventName: string, callback: Function) {
    const eventCallbacks = this.events[eventName];
    if (eventCallbacks) {
      this.events[eventName] = eventCallbacks.filter(cb => cb !== callback);
    }
  }
}
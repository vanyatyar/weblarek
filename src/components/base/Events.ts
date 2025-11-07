type EventHandler<T = unknown> = (data: T) => void;

export class EventEmitter {
  private events: { [event: string]: EventHandler[] } = {};

  on<T = unknown>(event: string, callback: EventHandler<T>) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback as EventHandler);
  }

  emit<T = unknown>(event: string, data?: T) {
    const handlers = this.events[event];
    if (handlers) {
      handlers.forEach(handler => handler(data));
    }
  }

  off(event: string, callback: EventHandler) {
    const handlers = this.events[event];
    if (handlers) {
      this.events[event] = handlers.filter(handler => handler !== callback);
    }
  }
}
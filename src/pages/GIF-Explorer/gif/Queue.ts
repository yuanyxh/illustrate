class Element<T> {
  value?: T;
  next: Element<T> | null;

  constructor(value?: T) {
    this.value = value;
    this.next = null;
  }
}

class Queue<T> {
  queue: Element<T> | null;
  private _size = 0;

  constructor() {
    this.queue = new Element<T>();
  }

  enqueue(value: T) {
    let next = this.queue;

    if (this.isEmpty()) {
      this.queue = new Element(value);

      return ++this._size;
    }

    while (next?.next) {
      next = next.next;
    }

    if (next) {
      next.next = new Element(value);
      return ++this._size;
    }
  }

  dequeue() {
    if (this.queue === null) return this.queue;

    const temp = this.queue;

    this.queue = this.queue.next;

    --this._size;

    return temp;
  }

  clear() {
    this.queue = null;
  }

  isEmpty() {
    return this.size === 0;
  }

  get size() {
    return this._size;
  }
}

export default Queue;

import type { Donation } from './definitions';

class LinkedListNode<T> {
  value: T;
  next: LinkedListNode<T> | null = null;

  constructor(value: T) {
    this.value = value;
  }
}

export class LinkedList<T> {
  head: LinkedListNode<T> | null = null;

  static fromArray<U>(arr: U[]): LinkedList<U> {
    const list = new LinkedList<U>();
    if (!arr || arr.length === 0) return list;
    
    list.head = new LinkedListNode(arr[0]);
    let current = list.head;
    for (let i = 1; i < arr.length; i++) {
      current.next = new LinkedListNode(arr[i]);
      current = current.next;
    }
    return list;
  }

  toArray(): T[] {
    const arr: T[] = [];
    let current = this.head;
    while (current) {
      arr.push(current.value);
      current = current.next;
    }
    return arr;
  }

  sort(compareFn: (a: T, b: T) => number): void {
    if (!this.head || !this.head.next) {
      return;
    }

    this.head = this.mergeSort(this.head, compareFn);
  }

  private mergeSort(node: LinkedListNode<T> | null, compareFn: (a: T, b: T) => number): LinkedListNode<T> | null {
    if (!node || !node.next) {
      return node;
    }

    const middle = this.getMiddle(node);
    const nextOfMiddle = middle.next;
    middle.next = null;

    const left = this.mergeSort(node, compareFn);
    const right = this.mergeSort(nextOfMiddle, compareFn);

    return this.sortedMerge(left, right, compareFn);
  }

  private sortedMerge(a: LinkedListNode<T> | null, b: LinkedListNode<T> | null, compareFn: (a: T, b: T) => number): LinkedListNode<T> | null {
    if (!a) return b;
    if (!b) return a;

    let result: LinkedListNode<T> | null;
    if (compareFn(a.value, b.value) <= 0) {
      result = a;
      result.next = this.sortedMerge(a.next, b, compareFn);
    } else {
      result = b;
      result.next = this.sortedMerge(a, b.next, compareFn);
    }
    return result;
  }

  private getMiddle(node: LinkedListNode<T>): LinkedListNode<T> {
    if (!node) return node;

    let slow: LinkedListNode<T> = node;
    let fast: LinkedListNode<T> | null = node;

    while (fast && fast.next && fast.next.next) {
      slow = slow.next!;
      fast = fast.next.next;
    }
    return slow;
  }
}

export function sortDonations(
  donations: Donation[],
  sortBy: keyof Donation | 'default',
  sortDirection: 'asc' | 'desc'
): Donation[] {
  if (sortBy === 'default') {
    return [...donations].sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  const list = LinkedList.fromArray(donations);

  list.sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    let comparison = 0;

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      comparison = aValue.localeCompare(bValue);
    } else if (typeof aValue === 'number' && typeof bValue === 'number') {
      comparison = aValue - bValue;
    } else if (aValue instanceof Date && bValue instanceof Date) {
      comparison = aValue.getTime() - bValue.getTime();
    }

    return sortDirection === 'asc' ? comparison : -comparison;
  });

  return list.toArray();
}

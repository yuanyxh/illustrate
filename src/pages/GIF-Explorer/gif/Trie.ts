class TrieNode {
  children: TrieNode[];
  isEndOfWord: boolean;
  code!: number;

  constructor() {
    this.children = new Array(4096);
    this.isEndOfWord = false;
  }
}

class Trie {
  root = new TrieNode();
  count = 0;

  insert(nums: number[]) {
    let node = this.root;

    for (let i = 0; i < nums.length; i++) {
      const index = nums[i];

      if (!node.children[index]) {
        node.children[index] = new TrieNode();
      }

      node = node.children[index];
    }

    node.isEndOfWord = true;
    node.code = this.count;

    this.count++;
  }

  search(nums: number[]) {
    let node = this.root;
    for (let i = 0; i < nums.length; i++) {
      const index = nums[i];

      if (!node.children[index]) {
        return false;
      }

      node = node.children[index];
    }

    return node;
  }

  clear() {
    this.root = new TrieNode();
    this.count = 0;
  }
}

export default Trie;

import type { ColorObject } from '../types';

class OctreeNode {
  children: OctreeNode[] = [];
  color: ColorObject | null;
  pixelCount = 0;

  constructor() {
    this.color = null;
  }
}

class Octree {
  private maxDepth = 8;
  private count = 1;

  root: OctreeNode;

  constructor(maxDepth = 8) {
    if (maxDepth > 8) {
      throw new Error('the maximum depth cannot exceed 8');
    }

    this.maxDepth = maxDepth;
    this.root = new OctreeNode();
  }

  insertColor(color: ColorObject) {
    let node = this.root;

    node.pixelCount++;

    for (let depth = this.maxDepth - 1; depth >= 0; depth--) {
      const index = this.getColorIndex(color, depth);

      if (!node.children[index]) {
        node.children[index] = new OctreeNode();
      }

      node = node.children[index];

      node.pixelCount++;
    }

    if (node.color === null) {
      this.count++;

      return (node.color = color);
    }

    const rgb = ['r', 'g', 'b'] as const;

    for (let i = 0; i < rgb.length; i++) {
      node.color[rgb[i]] += color[rgb[i]];
    }
  }

  getColorIndex(color: ColorObject, depth: number) {
    let index = 0;
    const mask = 1 << depth;

    if (color.r & mask) {
      index |= 1;
    }

    if (color.g & mask) {
      index |= 2;
    }

    if (color.b & mask) {
      index |= 4;
    }

    return index;
  }

  shrink(maxCount: number) {
    if (this.count <= maxCount) return [];

    for (let depth = this.maxDepth - 1; depth >= 0; depth--) {
      this.reduceColor(this.root, depth, 0, maxCount);

      if (this.count <= maxCount) break;
    }

    return this.collectColor();
  }

  reduceColor(
    node: OctreeNode,
    depth: number,
    currDepth: number,
    maxCount: number
  ) {
    if (this.count <= maxCount) return;

    const children = [...node.children];

    if (depth === currDepth) {
      this._reduceColor(node, maxCount);
    } else if (depth > currDepth) {
      for (let i = 0; i < children.length; i++) {
        if (children[i] === null || children[i] === undefined) continue;

        this.reduceColor(children[i], depth, currDepth + 1, maxCount);
      }
    }
  }

  _reduceColor(node: OctreeNode, maxCount: number) {
    let isClear = true;

    const children = [...node.children];

    children.sort((a, b) => a.pixelCount - b.pixelCount);

    for (let i = 0; i < children.length; i++) {
      if (children[i] === null || children[i] === undefined) continue;

      const color = children[i].color;

      if (color === null) continue;

      if (node.color === null) {
        node.color = color;

        continue;
      }

      const rgb = ['r', 'g', 'b'] as const;

      for (let j = 0; j < rgb.length; j++) {
        node.color[rgb[j]] += color[rgb[j]];
      }

      this.count--;

      if (this.count <= maxCount) {
        isClear = false;

        for (let j = 0; j < i; j++) {
          const index = node.children.indexOf(children[j]);

          node.children.splice(index, 1, null as unknown as OctreeNode);
        }

        break;
      }
    }
    if (isClear) node.children = [];
  }

  quantizeColor(color: ColorObject) {
    let node = this.root;

    for (let depth = this.maxDepth - 1; depth >= 0; depth--) {
      const index = this.getColorIndex(color, depth);
      if (!node.children[index]) {
        break;
      }
      node = node.children[index];
    }

    return node.color;
  }

  collectColor(node = this.root) {
    if (node === null || node === undefined) return [];

    const colors: ColorObject[] = [];
    const children = node.children;

    for (let i = 0; i < children.length; i++) {
      if (children[i] === null || children[i] === undefined) continue;

      const { color } = children[i];
      if (color) {
        if (!color.normalize) {
          const { r, g, b } = color;

          color.r = Math.round(r / children[i].pixelCount) || 0;
          color.g = Math.round(g / children[i].pixelCount) || 0;
          color.b = Math.round(b / children[i].pixelCount) || 0;
          color.normalize = true;
        }

        colors.push(color);
      }

      colors.push(...this.collectColor(children[i]));
    }

    return colors;
  }

  calcColorDistance(color_1: ColorObject, color_2: ColorObject) {
    const d = Math.sqrt(
      (color_1.r - color_2.r) ** 2 +
        (color_1.g - color_2.g) ** 2 +
        (color_1.b - color_2.b) ** 2
    );

    return Math.floor(
      (1 - d / Math.sqrt(255 ** 2 + 255 ** 2 + 255 ** 2)) * 100
    );
  }
}

export default Octree;

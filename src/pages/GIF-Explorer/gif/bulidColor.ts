import Octree from './Octree';

function bulidColor(pixels: Uint8ClampedArray) {
  const octree = new Octree();

  // 八叉树颜色量化
  for (let i = 0; i < pixels.length; i += 4) {
    octree.insertColor({ r: pixels[i], g: pixels[i + 1], b: pixels[i + 2] });
  }

  // 减色至 256 色
  octree.shrink(256);

  // 获取颜色列表
  const colorList = octree.collectColor();

  return { colorList, octree };
}

export default bulidColor;

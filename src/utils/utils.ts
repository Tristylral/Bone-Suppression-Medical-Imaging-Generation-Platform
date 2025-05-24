/**
 * 计算骨骼抑制后的图像
 * @param cxr - 原始胸片图像数据
 * @param bs - 骨骼抑制后的图像数据 (由后端计算得出)
 * @param suppressionRate - 骨骼抑制率 (0-100)
 * @param width - 图片宽度
 * @param height - 图片高度
 * @returns 处理后的图像数据，可直接用于canvas渲染
 */
function calculateResult(
  cxr: ImageData,
  bs: ImageData,
  suppressionRate: number,
  width: number,
  height: number
): ImageData {
  // 验证输入参数
  if (suppressionRate < 0 || suppressionRate > 100) {
    throw new Error("骨骼抑制率必须在0-100之间");
  }

  // 验证图片尺寸是否一致
  if (
    cxr.width != width ||
    cxr.height != height ||
    bs.width != width ||
    bs.height != height
  ) {
    throw new Error("图片尺寸不一致");
  }

  // 创建骨骼数据 (Bone)
  const boneData = new Uint8ClampedArray(cxr.data.length);
  for (let i = 0; i < cxr.data.length; i += 4) {
    // 根据公式 CXR - BS = Bone 计算骨骼数据
    boneData[i] = cxr.data[i] - bs.data[i];
    boneData[i + 1] = cxr.data[i + 1] - bs.data[i + 1];
    boneData[i + 2] = cxr.data[i + 2] - bs.data[i + 2];
    boneData[i + 3] = 255;
  }

  // 创建结果数据
  const resultData = new Uint8ClampedArray(cxr.data.length);
  const boneRatio = (100 - suppressionRate) / 100; // 转换为0-1之间的比例

  // 根据公式 BS + (100% - 骨抑制率) × Bone = result 计算结果
  for (let i = 0; i < cxr.data.length; i += 4) {
    for (let j = 0; j < 3; j++) {
      resultData[i + j] = Math.min(
        255,
        Math.max(0, bs.data[i + j] + boneRatio * boneData[i + j])
      );
    }
    resultData[i + 3] = 255;
  }

  return new ImageData(resultData, width, height);
}

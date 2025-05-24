// UI类型
export const uiType = {
  SELECT: 'select',
  COLOR: 'color',
  NUMBER: 'number',
};

// 有参数滤镜
export const paramsFilters = [
  {
    type: 'Brightness',
    status: true,
    params: [
      {
        key: 'brightness',
        value: 0,
        uiType: uiType.NUMBER,
        min: -1,
        max: 1,
        step: 0.01,
      },
    ],
  },
  {
    type: 'Contrast',
    status: true,
    params: [
      {
        key: 'contrast',
        value: 0,
        uiType: uiType.NUMBER,
        min: -1,
        max: 1,
        step: 0.01,
      },
    ],
  },
];

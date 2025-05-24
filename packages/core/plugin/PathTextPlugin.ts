
//这是夹角插件
import { fabric } from 'fabric';
import Editor from '../Editor';

type IEditor = Editor;

export default class IntersectingLinesPlugin implements IPluginTempl {
  static pluginName = 'IntersectingLinesPlugin';
  static apis = ['startIntersectingLinesDraw', 'endIntersectingLinesDraw', 'endTextPathDraw'];
  private lines: fabric.Line[] = [];
  private isDrawing = false;
  private startPoint?: { x: number; y: number };

  constructor(public canvas: fabric.Canvas, public editor: IEditor) { }

  _lineDrawnHandler = (opt: any) => {
    const pointer = this.canvas.getPointer(opt.e);

    if (!this.isDrawing) {
      // 开始绘制新的直线
      this.startPoint = { x: pointer.x, y: pointer.y };
      this.isDrawing = true;
    } else if (this.startPoint) {
      // 结束绘制直线
      const line = new fabric.Line([this.startPoint.x, this.startPoint.y, pointer.x, pointer.y], {
        stroke: 'white',
        strokeWidth: 2,
      });

      // 如果已经有两条直线，移除最早的一条
      if (this.lines.length === 2) {
        const oldLine = this.lines.shift();
        if (oldLine) {
          this.canvas.remove(oldLine); // 仅在 oldLine 不为 undefined 时执行移除
        }
      }

      this.lines.push(line);
      this.canvas.add(line);
      this.isDrawing = false;

      // 如果已经绘制了两条直线，计算并显示夹角
      if (this.lines.length === 2) {
        this._calculateAndDisplayAngle();
      }
    }
  };

  _calculateAndDisplayAngle() {
    const [line1, line2] = this.lines;

    let angle = this._calculateAngleBetweenLines(line1, line2);
    angle = 180 - angle;
    const midPoint = this._getMidPoint(line1, line2);

    const text = new fabric.Text(angle.toFixed(2) + '°', {
      fontSize: 20,
      fill: 'white',
      left: midPoint.x,
      top: midPoint.y,
      originX: 'center',
      originY: 'center',
    });

    this.canvas.add(text);
    this.canvas.renderAll();

    // 重置 lines 数组，准备下一次绘制
    this.lines = [];
  }

  _calculateAngleBetweenLines(line1: fabric.Line, line2: fabric.Line): number {
    const angle1 = Math.atan2((line1.y2 ?? 0) - (line1.y1 ?? 0), (line1.x2 ?? 0) - (line1.x1 ?? 0));
    const angle2 = Math.atan2((line2.y2 ?? 0) - (line2.y1 ?? 0), (line2.x2 ?? 0) - (line2.x1 ?? 0));
    let angle = Math.abs((angle1 - angle2) * (180 / Math.PI));
    return angle > 180 ? 360 - angle : angle;
  }

  _getMidPoint(line1: fabric.Line, line2: fabric.Line) {
    const midX = ((line1.x2 ?? 0) + (line2.x1 ?? 0)) / 2;
    const midY = ((line1.y2 ?? 0) + (line2.y1 ?? 0)) / 2;
    return { x: midX, y: midY };
  }

  _bindEvent() {
    this.canvas.on('mouse:down', this._lineDrawnHandler);
  }

  _unbindEvent() {
    this.canvas.off('mouse:down', this._lineDrawnHandler);
  }

  startIntersectingLinesDraw() {
    this._bindEvent();
  }

  endIntersectingLinesDraw() {
    this.isDrawing = false;
    this.startPoint = undefined;
    this._unbindEvent();
  }

  endTextPathDraw() {
    this.canvas.isDrawingMode = false;
    this._unbindEvent();
  }
}


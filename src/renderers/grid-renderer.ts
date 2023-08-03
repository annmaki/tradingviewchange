import { BitmapCoordinatesRenderingScope } from 'fancy-canvas';

import { ensureNotNull } from '../helpers/assertions';

import { PriceMark } from '../model/price-scale';

import { BitmapCoordinatesPaneRenderer } from './bitmap-coordinates-pane-renderer';
import { LineStyle, setLineStyle, strokeInPixel } from './draw-line';

export interface GridMarks {
	coord: number;
}
export interface GridRendererData {
	vertLinesVisible: boolean;
	vertLinesColor: string;
	vertLineStyle: LineStyle;
	timeMarks: GridMarks[];

	horzLinesVisible: boolean;
	horzLinesColor: string;
	horzLineStyle: LineStyle;
	priceMarks: PriceMark[];
}

export class GridRenderer extends BitmapCoordinatesPaneRenderer {
	private _data: GridRendererData | null = null;

	public setData(data: GridRendererData | null): void {
		this._data = data;
	}

	protected override _drawImpl({ context: ctx, bitmapSize, horizontalPixelRatio, verticalPixelRatio }: BitmapCoordinatesRenderingScope): void {
		if (this._data === null) {
			return;
		}

		const lineWidth = Math.max(1, Math.floor(horizontalPixelRatio));
		ctx.lineWidth = lineWidth;

		strokeInPixel(ctx, () => {
			const data = ensureNotNull(this._data);
			if (data.vertLinesVisible) {
				ctx.strokeStyle = data.vertLinesColor;
				setLineStyle(ctx, data.vertLineStyle);
				ctx.beginPath();
				var xgrid = [ 0, window.innerWidth/3, window.innerWidth*2/3,  window.innerWidth ]
				for (const x of xgrid) {
					ctx.moveTo(x, -lineWidth);
					ctx.lineTo(x, bitmapSize.height + lineWidth);   
				}
				ctx.stroke();
			}
			if (data.horzLinesVisible) {
				ctx.strokeStyle = data.horzLinesColor;
				setLineStyle(ctx, data.horzLineStyle);
				ctx.beginPath();
				var ygrid = [  window.innerHeight/7, window.innerHeight*2/7, window.innerHeight*3/7,  window.innerHeight*4/7,  window.innerHeight*7/10 - 1, window.innerHeight*7/10 + 28, window.innerHeight*6/7]
				for (const y of ygrid) {
					ctx.moveTo(-lineWidth, y);
					ctx.lineTo(bitmapSize.width + lineWidth, y);   
				}
				ctx.stroke();
			}
		});
	}
}

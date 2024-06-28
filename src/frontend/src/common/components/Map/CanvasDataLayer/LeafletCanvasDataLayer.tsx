import L, {Bounds, DomUtil, GridLayerOptions, latLngBounds as toLatLngBounds, LatLngExpression, PathOptions, Util} from 'leaflet';

class LeafletCanvasDataLayer extends L.GridLayer {

  _nCols: number = 0;

  _nRows: number = 0;

  _data: number[][] = [[]];

  _bounds: L.LatLngBounds = new L.LatLngBounds([0, 0], [0, 0]);

  _rotation: number = 0;

  _getRGBColor: (value: number) => string = () => '';

  _scalingFactor: number = 10;

  _canvas: null | HTMLCanvasElement = null;

  _interactive: boolean = true;

  _onHover: (value: number | null) => void = () => {
  };

  _zoomAnimated: boolean = true;

  options: GridLayerOptions = {};

  constructor(data: number[][], bounds: LatLngExpression[], rotation: number, getRGBColor: (value: number) => string, onHover: (value: number | null) => void, scalingFactor?: number, options?: GridLayerOptions) {
    super(options);
    this.initialize(data, bounds, rotation, getRGBColor, onHover, scalingFactor, options);
  }

  initialize(data: number[][], bounds: LatLngExpression[], rotation: number, getRGBColor: (value: number) => string, onHover: (value: number | null) => void, scalingFactor?: number, options?: GridLayerOptions) {

    if (!data || !bounds || !getRGBColor) {
      return;
    }

    this._nCols = data[0].length;
    this._nRows = data.length;
    this._data = data;
    this._bounds = toLatLngBounds(bounds);
    this._rotation = rotation;
    this._getRGBColor = getRGBColor;
    this._scalingFactor = scalingFactor || 1;

    this._interactive = true;
    this._onHover = onHover;
    this._zoomAnimated = true;

    this.options = options || {};

    if (options) {
      Util.setOptions(this, options);
    }
  }

  onAdd(map: L.Map) {
    if (!this._canvas) {
      this._initCanvas();
    }

    if (this._interactive) {
      if (this._canvas) {
        DomUtil.addClass(this._canvas, 'leaflet-interactive');
        this.addInteractiveTarget(this._canvas);
      }
    }

    map.createPane('canvasDataLayer');
    const pane = this.getPane('canvasDataLayer');
    if (this._canvas && pane) {
      pane.appendChild(this._canvas);
    }

    this._reset();
    return this;
  }

  onRemove(map: L.Map) {
    if (this._canvas) {
      DomUtil.remove(this._canvas);
      this.removeInteractiveTarget(this._canvas);
    }

    return this;
  }

  getEvents() {
    return {
      zoom: this._reset,
      viewreset: this._reset,
    };
  }

  setStyle(options: PathOptions) {
    if (options.opacity) {
      this.setOpacity(options.opacity);
    }
    return this;
  }

  bringToFront() {
    if (this._map && this._canvas) {
      DomUtil.toFront(this._canvas);
    }
    return this;
  }

  bringToBack() {
    if (this._map && this._canvas) {
      DomUtil.toBack(this._canvas);
    }
    return this;
  }

  setNCols(nCols: number) {
    this._nCols = nCols;

    if (this._canvas) {
      this._canvas.width = nCols;
      this._runDraw();
    }

    return this;
  }

  setNRows(nRows: number) {
    this._nRows = nRows;

    if (this._canvas) {
      this._canvas.height = nRows;
      this._runDraw();
    }

    return this;
  }

  setData(data: number[][]) {
    this._data = data;

    if (this._map) {
      this._runDraw();
    }
    return this;
  }

  setBounds(bounds: LatLngExpression[]) {
    this._bounds = toLatLngBounds(bounds);

    if (this._map) {
      this._reset();
    }
    return this;
  }

  setGetRGBColor(getRGBColor: (value: number) => string) {
    this._getRGBColor = getRGBColor;

    if (this._map) {
      this._runDraw();
    }
    return this;
  }

  setScalingFactor(scalingFactor: number) {
    this._scalingFactor = scalingFactor;

    if (this._map) {
      this._runDraw();
    }
    return this;
  }

  setZIndex(value: number) {
    this.options.zIndex = value;
    this._updateZIndex();
    return this;
  }

  getElement() {
    return this._canvas;
  }

  _initCanvas() {
    this._canvas = DomUtil.create(
      'canvas',
      `leaflet-layer ${this._zoomAnimated ? 'leaflet-zoom-animated' : ''} ${this.options.className || ''}`,
    ) as HTMLCanvasElement;


    this._canvas.width = this._nCols * this._scalingFactor;
    this._canvas.height = this._nRows * this._scalingFactor;

    this._canvas.onselectstart = Util.falseFn;

    this._canvas.onmousemove = (event: MouseEvent) => {
      if (!this._canvas || !this._onHover || !this._data || !this._interactive) {
        return;
      }

      this._onHover(this._getValueAtMousePosition(event) || null);
    };

    this._canvas.onload = Util.bind(this.fire, this, 'load');
    this._canvas.onerror = Util.bind(this._overlayOnError, this, 'error');

    if (this.options.zIndex) {
      this._updateZIndex();
    }

    const ctx = this._canvas.getContext('2d');
    if (ctx) {
      ctx.scale(this._scalingFactor, this._scalingFactor);
    }

    this._runDraw();
  }

  _reset() {

    if (!this._canvas) {
      return;
    }

    const bounds = new Bounds(
      this._map.latLngToLayerPoint(this._bounds.getNorthWest()),
      this._map.latLngToLayerPoint(this._bounds.getSouthEast()),
    );

    if (bounds.min) {
      const size = bounds.getSize();
      DomUtil.setPosition(this._canvas, bounds.min);
      this._canvas.style.width = size.x + 'px';
      this._canvas.style.height = size.y + 'px';
    }
  }

  _calculateRelativeInnerRectangleDimensions(theta: number) {
    const cosTheta = Math.abs(Math.cos(theta));
    const sinTheta = Math.abs(Math.sin(theta));

    // Matrix coefficients
    const a = cosTheta;
    const b = sinTheta;
    const c = sinTheta;
    const d = cosTheta;

    // Constants
    const e = 1;
    const f = 1;

    // Solve the linear system using Cramer's Rule
    const det = a * d - b * c;
    const w = (e * d - b * f) / det;
    const h = (a * f - e * c) / det;

    return [w, h];
  }

  _getValueAtMousePosition(event: MouseEvent) {

    if (!this._canvas || !this._data) {
      return;
    }

    const ctx = this._canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    // Get the bounding rectangle of the canvas
    const rect = this._canvas.getBoundingClientRect();

    // Calculate the mouse coordinates relative to the canvas
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Calculate the center of the canvas
    const canvasCenterX = rect.width / 2;
    const canvasCenterY = rect.height / 2;

    // Adjust mouse coordinates to be relative to the center of the canvas
    const xFromCenter = mouseX - canvasCenterX;
    const yFromCenter = mouseY - canvasCenterY;

    // Apply inverse rotation to adjust for canvas rotation
    const angle = -this._rotation * Math.PI / 180;
    const cosAngle = Math.cos(angle);
    const sinAngle = Math.sin(angle);

    const rotatedX = cosAngle * xFromCenter + sinAngle * yFromCenter;
    const rotatedY = -sinAngle * xFromCenter + cosAngle * yFromCenter;

    // calculate inner rectangle dimensions
    const [relWidth, relHeight] = this._calculateRelativeInnerRectangleDimensions(angle);


    // calculate scaling factor
    // There is an inaccuracy in the scaling factor calculation, and it is not clear why
    // The calculated scaling factor is slightly off, which causes inconsistencies in the mouse position calculation
    // In my example, the relative width and height are 0.7, but calculated 0.76
    // Don't know why and how to fix it
    const sX = this._nCols / relWidth / rect.width;
    const sY = this._nRows / relHeight / rect.height;

    // Calculate the scaled coordinates in the rotated space
    const scaledX = rotatedX * sX + this._nCols / 2;
    const scaledY = rotatedY * sY + this._nRows / 2;

    // Calculate the row and column based on the scaled coordinates
    const row = Math.floor(scaledY);
    const col = Math.floor(scaledX);

    // Ensure row and col are within bounds
    if (0 > row || row >= this._data.length || 0 > col || col >= this._data[0].length) {
      return null;
    }

    // Retrieve the value from your data structure
    return this._data[row][col];
  }

  _runDraw() {
    if (!this._canvas) {
      return;
    }

    const ctx = this._canvas?.getContext('2d');
    if (!ctx) {
      return;
    }

    // Original content dimensions
    const originalWidth = this._nCols * this._scalingFactor;
    const originalHeight = this._nRows * this._scalingFactor;

    // Calculate the bounding box of the rotated rectangle
    const angle = this._rotation * Math.PI / 180;
    const cos = Math.abs(Math.cos(angle));
    const sin = Math.abs(Math.sin(angle));
    const newWidth = originalWidth * cos + originalHeight * sin;
    const newHeight = originalWidth * sin + originalHeight * cos;

    // Resize the canvas to fit the rotated content
    this._canvas.width = newWidth;
    this._canvas.height = newHeight;

    ctx.clearRect(0, 0, newWidth, newHeight);

    if (this._rotation) {
      ctx.save(); // Save the current state
      ctx.translate(newWidth / 2, newHeight / 2);
      ctx.rotate(-this._rotation * Math.PI / 180);
      ctx.translate(-originalWidth / 2, -originalHeight / 2);
    }

    this._data.forEach((row: number[], nRow: number) => {
      row.forEach((value, nCol) => {
        const x = nCol * this._scalingFactor;
        const y = nRow * this._scalingFactor;
        ctx.fillStyle = null === value ? 'transparent' : this._getRGBColor(value);
        ctx.fillRect(x, y, this._scalingFactor, this._scalingFactor);
      });
    });

    if (this._rotation) {
      ctx.restore();
    }

    this._updateOpacity();
  }

  _updateOpacity() {
    if (!this._canvas) {
      return;
    }

    DomUtil.setOpacity(this._canvas, this.options.opacity || 1);
  }

  setOpacity(opacity: number): this {
    if (!this._canvas) {
      return this;
    }
    DomUtil.setOpacity(this._canvas, opacity);
    this.options.opacity = opacity;
    return this;
  }

  _updateZIndex() {
    if (!this._canvas) {
      return;
    }

    if (!this.options.zIndex) {
      return;
    }

    this._canvas.style.zIndex = this.options.zIndex.toString();
  }

  _overlayOnError() {
    this.fire('error');
  }
}

export default LeafletCanvasDataLayer;

export class LPFStream {
  smoothing: number = 0.5; // must be smaller than 1
  buffer: number[] = []; // FIFO queue
  bufferMaxSize: number;

  constructor(bufferMaxSize: number, smoothing: number) {
    this.smoothing = smoothing || 0.5; // must be smaller than 1
    this.bufferMaxSize = bufferMaxSize;
  }

  init(values: number[]) {
    for (var i = 0; i < values.length; i++) {
      this.__push(values[i]);
    }
    return this.buffer;
  }

  __push(value: number) {
    var removed =
      this.buffer.length === this.bufferMaxSize ? this.buffer.shift() : 0;
    this.buffer.push(value);
    return removed;
  }

  /**
   * Smooth value from stream
   *
   * @param {integer|float} nextValue
   * @returns {integer|float}
   * @access public
   */
  next(nextValue: number) {
    var self = this;
    // push new value to the end, and remove oldest one
    var removed = this.__push(nextValue);
    // smooth value using all values from buffer
    var result = this.buffer.reduce(function (last, current) {
      return self.smoothing * current + (1 - self.smoothing) * last;
    }, removed);
    // replace smoothed value
    this.buffer[this.buffer.length - 1] = result;
    return result;
  }
}

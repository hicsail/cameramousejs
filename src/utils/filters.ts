export function lowPassFilter(
  samples: number[],
  cutoff: number,
  sampleRate: number,
  numChannels = 1
) {
  let rc = 1.0 / (cutoff * 2 * Math.PI);
  let dt = 1.0 / sampleRate;
  let alpha = dt / (rc + dt);
  let last_val = [];
  let offset;
  for (let i = 0; i < numChannels; i++) {
    last_val[i] = samples[i];
  }
  for (let i = 0; i < samples.length; i++) {
    for (let j = 0; j < numChannels; j++) {
      offset = i * numChannels + j;
      last_val[j] = last_val[j] + alpha * (samples[offset] - last_val[j]);
      samples[offset] = last_val[j];
    }
  }

  return samples;
}

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
  // keep init . instantiate with global FIFO( wh has same length as bifferSize)
  //addtoBuffer
  //isBufferFull()

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

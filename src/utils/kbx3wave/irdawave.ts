import type { ByteArray } from './utils';
import { range, strToNumber } from './utils';

const FRAME_HIGH_16BIT = strToNumber('\x00\x80\xff\x7f');
const FRAME_MIDDLE_16BIT = strToNumber('\x00\x00\x00\x00');
const FRAME_LOW_16BIT = strToNumber('\xff\x7f\x00\x80');

type WaveWrite = {
  writeframesraw: (frame: Uint8Array) => void;
};

function _write_bit(wf: WaveWrite, b: boolean, invert = false) {
  range(8).forEach(() => {
    wf.writeframesraw(invert ? FRAME_HIGH_16BIT : FRAME_LOW_16BIT);
  });
  range(6).forEach(() => {
    wf.writeframesraw(b ^ invert ? FRAME_LOW_16BIT : FRAME_HIGH_16BIT);
  });
  range(6).forEach(() => {
    wf.writeframesraw(invert ? FRAME_HIGH_16BIT : FRAME_LOW_16BIT);
  });
}

export function write_packet(wf: WaveWrite, packet: ByteArray, invert = false) {
  packet.forEach((c) => {
    _write_bit(wf, false, invert);
    range(8).forEach((i) => {
      _write_bit(wf, Boolean(c & (1 << i)), invert);
    });
    _write_bit(wf, true, invert);
  });
}

export function write_preamble(wf: WaveWrite, invert = false) {
  // 200ms preamble
  range(9600).forEach(() => {
    wf.writeframesraw(invert ? FRAME_HIGH_16BIT : FRAME_LOW_16BIT);
  });
}

export function write_pause(wf: WaveWrite) {
  // 100ms blank
  range(4800).forEach(() => {
    wf.writeframesraw(FRAME_MIDDLE_16BIT);
  });
}

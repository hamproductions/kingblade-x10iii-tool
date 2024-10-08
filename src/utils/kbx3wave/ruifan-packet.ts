import { bytes, range, type ByteArray, type Bytes, type RGB } from './utils';

const MAGIC: ByteArray = Buffer.from('&015$2#8)@_!(D^."', 'ascii');

export const ruifan_encode = (wave_data: ByteArray, defaultNonce?: number) => {
  let nonce = defaultNonce;
  if (!nonce) nonce = Math.random() * 256;
  range(1, 12).forEach((i) => {
    wave_data[i] = wave_data[i] ^ nonce ^ MAGIC[i - 1 + (nonce % 5)];
  });
  wave_data[12] = MAGIC[wave_data[1] & 0xf] ^ nonce;
  const swap_addr = (wave_data[1] % 10) + 2;
  const tmp = wave_data[12];
  wave_data[12] = wave_data[swap_addr];
  wave_data[swap_addr] = tmp;
};

export const ruifan_decode = (wave_data: ByteArray) => {
  const swap_addr = (wave_data[1] % 10) + 2;
  const tmp = wave_data[12];
  wave_data[12] = wave_data[swap_addr];
  wave_data[swap_addr] = tmp;
  const nonce = wave_data[12] ^ MAGIC[wave_data[1] & 0xf];
  range(1, 12).forEach((i) => (wave_data[i] = wave_data[i] ^ nonce ^ MAGIC[i - 1 + (nonce % 5)]));
};

export const ruifan_packet = (cmd: number, data: Bytes): ByteArray => {
  const wave_data = new Uint8Array(14);
  wave_data[0] = 0xaa;
  wave_data[1] = cmd;
  data.forEach((byte, idx) => {
    wave_data[2 + idx] = byte;
  });
  wave_data[13] = 0x55;
  return wave_data;
};

// memory: preamble, memory0, memory1, ... memoryN, eof1, eof2
export const ruifan_memory_packet = (cnt: number, rgb: RGB, w: number): ByteArray => {
  return ruifan_packet(0x80 + cnt, bytes([...rgb, w]));
};

export const ruifan_preview_packet = (rgb: RGB, w: number): ByteArray => {
  return ruifan_packet(0x41, bytes([...rgb, w]));
};

export const ruifan_eof1_packet = (cnt: number): ByteArray => {
  return ruifan_packet(0x9e, bytes([cnt]));
};

export const ruifan_eof2_packet = (cnt: number): ByteArray => {
  return ruifan_packet(0x9f, bytes([cnt]));
};

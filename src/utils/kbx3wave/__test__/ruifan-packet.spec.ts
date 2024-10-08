import { describe, expect, it } from 'vitest';
import {
  ruifan_encode,
  ruifan_eof1_packet,
  ruifan_memory_packet,
  ruifan_packet
} from '../ruifan-packet';
import { buf2hex, type RGB } from '../utils';

describe('ruifan-packet', () => {
  describe('ruifan_encode', () => {
    it('encodes stuff', () => {
      const testData = [
        ['aa80ff0000000000000000000055', 'aaacc53b222e382932234a553f55'],
        ['aa810000ff000000000000000055', 'aaad3a3bc04e382932234a552e55'],
        ['aa82000000ff0000000000000055', 'aaae3a3b3fd1542932234a553855'],
        ['aa83e01f00000000000000000055', 'aaafda243f2e382432234a552955'],
        ['aa8400ff00000000000000000055', 'aaa83ac43f2e3829322323554a55'],
        ['aa851b00e4000000000000000055', 'aaa9213bdb2e382932234a4a5555'],
        ['aa86c5003a000000000000000055', 'aaaa553b052e382932234a55ff55'],
        ['aa87718e00000000000000000055', 'aaab4b2b3f2e382932234a55b555'],
        ['aa8800a814000000000000000055', 'aaa43a932b2e2e2932234a553855'],
        ['aa89008877070000000000000055', 'aaa53ab34829383832234a552955'],
        ['aa8aac2034000000000000000055', 'aaa6961b0b2e382929234a553255'],
        ['aa8b4600b9000000000000000055', 'aaa77c3b862e382932324a552355'],
        ['aa8c41be00000000000000000055', 'aaa02c853f2e382932234a557b55'],
        ['aa8d00ba450c0000000000000055', 'aaa13a3a7a22382932234a558155'],
        ['aa8eef0010000000000000000055', 'aaa2d53b3b2e382932234a552f55'],
        ['aa9e0f0000000000000000000055', 'aab2353b3f2e382932233b554a55'],
        ['aa9f0f0000000000000000000055', 'aab3353b3f2e382932234a3f5555']
      ] as const;
      testData.forEach((test) => {
        const data = Buffer.from(test[0], 'hex') as unknown as Uint8Array;
        ruifan_encode(data, 10);
        expect(buf2hex(data)).toEqual(test[1]);
      });
    });
  });
  describe.todo('ruifan_decode', () => {});
  describe('ruifan_memory_packet', () => {
    it('creates memory packet', () => {
      const testData = [
        [0, [255, 0, 0], 0, 'aa80ff0000000000000000000055'],
        [1, [0, 0, 255], 0, 'aa810000ff000000000000000055'],
        [2, [0, 0, 0], 255, 'aa82000000ff0000000000000055'],
        [3, [224, 31, 0], 0, 'aa83e01f00000000000000000055'],
        [4, [0, 255, 0], 0, 'aa8400ff00000000000000000055'],
        [5, [27, 0, 228], 0, 'aa851b00e4000000000000000055'],
        [6, [197, 0, 58], 0, 'aa86c5003a000000000000000055'],
        [7, [113, 142, 0], 0, 'aa87718e00000000000000000055'],
        [8, [0, 168, 20], 0, 'aa8800a814000000000000000055'],
        [9, [0, 136, 119], 7, 'aa89008877070000000000000055'],
        [10, [172, 32, 52], 0, 'aa8aac2034000000000000000055'],
        [11, [70, 0, 185], 0, 'aa8b4600b9000000000000000055'],
        [12, [65, 190, 0], 0, 'aa8c41be00000000000000000055'],
        [13, [0, 186, 69], 12, 'aa8d00ba450c0000000000000055'],
        [14, [239, 0, 16], 0, 'aa8eef0010000000000000000055']
      ] as const;
      testData.forEach((test) => {
        expect(buf2hex(ruifan_memory_packet(test[0], test[1] as RGB, test[2]))).toEqual(test[3]);
      });
    });
  });
  describe.todo('ruifan_preview_packet', () => {});
  describe('ruifan_eof1_packet', () => {
    it('matches', () => {
      const test = [15, 'aa9e0f0000000000000000000055'] as const;
      expect(buf2hex(ruifan_eof1_packet(test[0]))).toEqual(test[1]);
    });
  });
  describe('ruifan_eof2_packet', () => {
    it('matches', () => {
      const test = [15, 'aa9e0f0000000000000000000055'] as const;
      expect(buf2hex(ruifan_eof1_packet(test[0]))).toEqual(test[1]);
    });
  });
  describe('ruifan_packet', () => {
    it('creates packet', () => {
      const testData = [
        [128, '\xff\x00\x00\x00', 'aa80ff0000000000000000000055'],
        [129, '\x00\x00\xff\x00', 'aa810000ff000000000000000055'],
        [130, '\x00\x00\x00\xff', 'aa82000000ff0000000000000055'],
        [131, '\xe0\x1f\x00\x00', 'aa83e01f00000000000000000055'],
        [132, '\x00\xff\x00\x00', 'aa8400ff00000000000000000055'],
        [133, '\x1b\x00\xe4\x00', 'aa851b00e4000000000000000055'],
        [134, '\xc5\x00:\x00', 'aa86c5003a000000000000000055'],
        [135, 'q\x8e\x00\x00', 'aa87718e00000000000000000055'],
        [136, '\x00\xa8\x14\x00', 'aa8800a814000000000000000055'],
        [137, '\x00\x88w\x07', 'aa89008877070000000000000055'],
        [138, '\xac 4\x00', 'aa8aac2034000000000000000055'],
        [139, 'F\x00\xb9\x00', 'aa8b4600b9000000000000000055'],
        [140, 'A\xbe\x00\x00', 'aa8c41be00000000000000000055'],
        [141, '\x00\xbaE\x0c', 'aa8d00ba450c0000000000000055'],
        [142, '\xef\x00\x10\x00', 'aa8eef0010000000000000000055'],
        [158, '\x0f', 'aa9e0f0000000000000000000055'],
        [159, '\x0f', 'aa9f0f0000000000000000000055']
      ] as const;
      testData.forEach((test) => {
        expect(
          buf2hex(ruifan_packet(test[0], Buffer.from(test[1], 'ascii') as unknown as Uint8Array))
        ).toEqual(test[2]);
      });
    });
  });
});

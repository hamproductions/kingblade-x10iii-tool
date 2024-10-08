import { readFile } from 'fs/promises';
import { describe, expect, it } from 'vitest';
import { join } from 'path-browserify';
import { write_packet } from '../irdawave';
import { buf2hex } from '../utils';

describe('irdawave', () => {
  describe('write_packet', () => {
    it('writes packet', async () => {
      const TEST_WRITE = await readFile(join(__dirname, './test-write-packet.txt'));

      const samples: number[] = [];

      const wf = {
        writeframesraw: (frame: Uint8Array) => {
          const l = frame.slice(0, Math.ceil(frame.length / 2));
          const r = frame.slice(Math.floor(frame.length / 2), frame.length);
          samples.push(...l);
          samples.push(...r);
        }
      };

      write_packet(wf, Buffer.from('aaacc53b222e382932234a553f55', 'hex') as unknown as Uint8Array);
      expect(buf2hex(new Uint8Array(samples))).toEqual(TEST_WRITE.toString());
    });
  });
});

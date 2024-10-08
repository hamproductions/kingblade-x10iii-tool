import { Buffer } from 'buffer';

export type ByteArray = Uint8Array;
export type Bytes = Uint8Array;
export type RGB = [r: number, g: number, b: number];

export const strToNumber = (str: string) => {
  const buffer = Buffer.from(str, 'ascii');
  return buffer as unknown as Uint8Array;
};

export const range = (v1: number, v2?: number) => {
  let start, end;
  if (v2) {
    start = v1;
    end = v2;
  } else {
    start = 0;
    end = v1;
  }

  return Array(end - start)
    .fill(start)
    .map((n: number, idx) => n + idx);
};

export const bytes = (data: number[]) => {
  return Uint8Array.from(data);
};

export const fromHexString = (hexString: string) =>
  Uint8Array.from(hexString.match(/.{1,2}/g)?.map((byte: string) => parseInt(byte, 16)) ?? []);

export function buf2hex(buffer: Uint8Array) {
  // buffer is an ArrayBuffer
  return [...new Uint8Array(buffer)].map((x) => x.toString(16).padStart(2, '0')).join('');
}

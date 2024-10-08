import { round, sum } from 'lodash-es';
import { WaveFile } from 'wavefile';
import { fromHexString, type ByteArray, type RGB } from './utils';
import {
  ruifan_encode,
  ruifan_eof1_packet,
  ruifan_eof2_packet,
  ruifan_memory_packet,
  ruifan_preview_packet
} from './ruifan-packet';
import { write_pause, write_preamble, write_packet } from './irdawave';

const color_normalization = (rgb_tuple: RGB): RGB => {
  const [r, g, b] = rgb_tuple;
  const color_sum = sum(rgb_tuple);
  if (color_sum > 255) return rgb_tuple.map((x) => round((x / color_sum) * 255)) as RGB;
  return rgb_tuple;
};

const colors_to_packets = (colors: ByteArray[], no_normalization = false, preview = false) => {
  const packets = [];
  colors.map((color_set, n) => {
    let rgb = [color_set[0], color_set[1], color_set[2]] as RGB;
    const w = color_set[3];
    const y = color_set[4];
    if (!no_normalization) rgb = color_normalization(rgb);
    packets.push(preview ? ruifan_preview_packet(rgb, w) : ruifan_memory_packet(n, rgb, w));
  });

  if (!preview) {
    packets.push(ruifan_eof1_packet(colors.length));
    packets.push(ruifan_eof2_packet(colors.length));
  }

  return packets;
};

const generate_wave = async (packets: ByteArray[], invert = false) => {
  const samples: number[][] = [[], []];

  const wf = {
    writeframesraw: (frame: Uint8Array) => {
      // console.log(frame, frame.length);
      const l = frame.slice(0, Math.ceil(frame.length / 2));
      const r = frame.slice(Math.floor(frame.length / 2), frame.length);

      samples[0].push(Buffer.from(l).readIntLE(0, 2));
      samples[1].push(Buffer.from(r).readIntLE(0, 2));
      // s.push(...frame);
    }
  };

  write_pause(wf);
  write_preamble(wf, invert);

  packets.map((packet) => {
    ruifan_encode(packet);
    write_packet(wf, packet, invert);
    write_pause(wf);
  });

  const res = new WaveFile();
  res.fromScratch(2, 48000, '16', samples);
  await Bun.write('./out.wav', res.toBuffer());
};

const main = async () => {
  const colors = [
    'ff00000000',
    '0000ff0000',
    '000000ff00',
    'ff23000000',
    '00ff000000',
    '1e00ff0000',
    'ff004b0000',
    '93b9000000',
    '00a8140000',
    '00c6ae0700',
    'ff2f4d0000',
    '5000d30000',
    '57ff000000',
    '00ff5e0c00',
    'ff00110000'
  ].map((color) => {
    return fromHexString(color);
  });
  // console.log(colors);
  await generate_wave(colors_to_packets(colors));
};

await main();

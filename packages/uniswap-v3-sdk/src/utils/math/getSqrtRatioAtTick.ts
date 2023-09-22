import { type Fraction, createFraction } from "reverse-mirage";
import type { UniswapV3Tick } from "../../types/uniswapV3Tick.js";
import { Q96, Q128 } from "../constants.js";

export const getSqrtRatioAtTick = (tick: UniswapV3Tick): Fraction => {
  const x = tick.tick < 0 ? -tick.tick : tick.tick;
  let ratioX128: bigint = Q128;

  if ((x & 0x1) > 0)
    ratioX128 = (ratioX128 * 0xfffcb933bd6fad37aa2d162d1a594001n) >> 128n;
  if ((x & 0x2) > 0)
    ratioX128 = (ratioX128 * 0xfff97272373d413259a46990580e213an) >> 128n;
  if ((x & 0x4) > 0)
    ratioX128 = (ratioX128 * 0xfff2e50f5f656932ef12357cf3c7fdccn) >> 128n;
  if ((x & 0x8) > 0)
    ratioX128 = (ratioX128 * 0xffe5caca7e10e4e61c3624eaa0941cd0n) >> 128n;
  if ((x & 0x10) > 0)
    ratioX128 = (ratioX128 * 0xffcb9843d60f6159c9db58835c926644n) >> 128n;
  if ((x & 0x20) > 0)
    ratioX128 = (ratioX128 * 0xff973b41fa98c081472e6896dfb254c0n) >> 128n;
  if ((x & 0x40) > 0)
    ratioX128 = (ratioX128 * 0xff2ea16466c96a3843ec78b326b52861n) >> 128n;
  if ((x & 0x80) > 0)
    ratioX128 = (ratioX128 * 0xfe5dee046a99a2a811c461f1969c3053n) >> 128n;
  if ((x & 0x100) > 0)
    ratioX128 = (ratioX128 * 0xfcbe86c7900a88aedcffc83b479aa3a4n) >> 128n;
  if ((x & 0x200) > 0)
    ratioX128 = (ratioX128 * 0xf987a7253ac413176f2b074cf7815e54n) >> 128n;
  if ((x & 0x400) > 0)
    ratioX128 = (ratioX128 * 0xf3392b0822b70005940c7a398e4b70f3n) >> 128n;
  if ((x & 0x800) > 0)
    ratioX128 = (ratioX128 * 0xe7159475a2c29b7443b29c7fa6e889d9n) >> 128n;
  if ((x & 0x1000) > 0)
    ratioX128 = (ratioX128 * 0xd097f3bdfd2022b8845ad8f792aa5825n) >> 128n;
  if ((x & 0x2000) > 0)
    ratioX128 = (ratioX128 * 0xa9f746462d870fdf8a65dc1f90e061e5n) >> 128n;
  if ((x & 0x4000) > 0)
    ratioX128 = (ratioX128 * 0x70d869a156d2a1b890bb3df62baf32f7n) >> 128n;
  if ((x & 0x8000) > 0)
    ratioX128 = (ratioX128 * 0x31be135f97d08fd981231505542fcfa6n) >> 128n;
  if ((x & 0x10000) > 0)
    ratioX128 = (ratioX128 * 0x9aa508b5b7a84e1c677de54f3e99bc9n) >> 128n;
  if ((x & 0x20000) > 0)
    ratioX128 = (ratioX128 * 0x5d6af8dedb81196699c329225ee604n) >> 128n;
  if ((x & 0x40000) > 0)
    ratioX128 = (ratioX128 * 0x2216e584f5fa1ea926041bedfe98n) >> 128n;
  if ((x & 0x80000) > 0)
    ratioX128 = (ratioX128 * 0x48a170391f7dc42444e8fa2n) >> 128n;
  // Stop computation here since |strike| < 2**20

  // Inverse r since base = 1/1.0001
  if (tick.tick > 0) ratioX128 = (2n ** 256n - 1n) / ratioX128;

  // down cast to Q96 and round up
  return createFraction(
    (ratioX128 >> 32n) + (ratioX128 % (1n << 32n) === 0n ? 0n : 1n),
    Q96,
  );
};

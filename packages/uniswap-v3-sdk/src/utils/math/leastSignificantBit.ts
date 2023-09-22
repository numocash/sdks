import invariant from "tiny-invariant";

export const leastSignificantBit = (y: bigint): number => {
  invariant(y > 0);

  let x = y;
  let r = 255;

  if ((x & (2n ** 128n - 1n)) > 0) {
    r -= 128;
  } else {
    x >>= 128n;
  }
  if ((x & (2n ** 64n - 1n)) > 0) {
    r -= 64;
  } else {
    x >>= 64n;
  }
  if ((x & (2n ** 32n - 1n)) > 0) {
    r -= 32;
  } else {
    x >>= 32n;
  }
  if ((x & (2n ** 16n - 1n)) > 0) {
    r -= 16;
  } else {
    x >>= 16n;
  }
  if ((x & (2n ** 8n - 1n)) > 0) {
    r -= 8;
  } else {
    x >>= 8n;
  }
  if ((x & 0xfn) > 0) {
    r -= 4;
  } else {
    x >>= 4n;
  }
  if ((x & 0x3n) > 0) {
    r -= 2;
  } else {
    x >>= 2n;
  }
  if ((x & 0x1n) > 0) r -= 1;

  return r;
};

import invariant from "tiny-invariant";

export const mostSignificantBit = (y: bigint): number => {
  invariant(y > 0n);

  let x = y;
  let r = 0;

  if (x >= 0x100000000000000000000000000000000n) {
    x >>= 128n;
    r += 128;
  }
  if (x >= 0x10000000000000000n) {
    x >>= 64n;
    r += 64;
  }
  if (x >= 0x100000000) {
    x >>= 32n;
    r += 32;
  }
  if (x >= 0x10000) {
    x >>= 16n;
    r += 16;
  }
  if (x >= 0x100) {
    x >>= 8n;
    r += 8;
  }
  if (x >= 0x10) {
    x >>= 4n;
    r += 4;
  }
  if (x >= 0x4) {
    x >>= 2n;
    r += 2;
  }
  if (x >= 0x2) r += 1;

  return r;
};

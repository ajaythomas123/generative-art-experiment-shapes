function getRandomIntFromInterval(random, min, max) {
  return Math.floor(random * (max - min + 1) + min);
}

export function getRandomIterator(list, seed) {
  let a = seed;
  function getRandomValue() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    var t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  function next() {
    const index = getRandomIntFromInterval(getRandomValue(), 0, list.length - 1);
    return list[index];
  }

  return {
    next,
  };
}

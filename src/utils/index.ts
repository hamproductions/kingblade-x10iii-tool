export const calculateCardUse = <T extends { value: number }>(
  cards: T[],
  remaining: number,
  target: number
): T[] => {
  const dp = {
    [remaining]: []
  };
};

// const _calculateCardUse = <T extends { value: number }>(
//   acc: T[],
//   cards: T[],
//   remaining: number
// ): T[] => {
//   if (remaining < 0) return acc;
//   const maxTries = remaining / (minBy(cards, (c) => c.value)?.value ?? 1) + 20;
//   if (acc.length > maxTries) return [];
//   const sub = cards.map((c) => _calculateCardUse([...acc, c], cards, remaining + c.value));
//   return minBy(sub, (s) => s.length) as T[];
// };

export const getRandomMultiplier = (): number => {
  const table = [
    { chance: 40, value: 2.5 },
    { chance: 35, value: 2.86 },
    { chance: 30, value: 3.33 },
    { chance: 25, value: 4.0 },
    { chance: 20, value: 5.0 },
    { chance: 15, value: 6.67 },
    { chance: 10, value: 10.0 },
    { chance: 5, value: 20.0 },
    { chance: 2, value: 50.0 },
    { chance: 1, value: 100.0 },
    { chance: 0.5, value: 200.0 },
    { chance: 0.25, value: 400.0 },
    { chance: 0.1, value: 1000.0 },
    { chance: 0.05, value: 2000.0 },
    { chance: 0.02, value: 5000.0 },
  ];

  const total = table.reduce((sum, row) => sum + row.chance, 0);
  const rand = Math.random() * total;
  let acc = 0;

  for (let row of table) {
    acc += row.chance;
    if (rand <= acc) return row.value;
  }
  return 2.0;
};

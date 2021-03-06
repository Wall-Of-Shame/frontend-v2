export const formatEffectCount = (count: number): string => {
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "K" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "B" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];

  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return count >= item.value;
    });
  const divide = item ? count / item?.value : 0;
  return item
    ? divide.toFixed(divide >= 10 ? 0 : 1).replace(rx, "$1") + item.symbol
    : "0";
};

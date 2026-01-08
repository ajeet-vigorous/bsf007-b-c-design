export function formatNumber(value) {
    return (Math.floor(Number(value) * 100) / 100);
  }

  export function formatNumberToFixed(value) {
    return (Math.floor(Number(value) * 100) / 100).toFixed(2);
  }

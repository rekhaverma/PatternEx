export default (total, value, decimals = 2) => ((value * 100) / total).toFixed(decimals);

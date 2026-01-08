export default function FormateValueNumber(reqNumber) {
  if (reqNumber >= 1000000000) {
    return (reqNumber / 1000000000).toFixed(1) + 'B';
  } else if (reqNumber >= 1000000) {
    return (reqNumber / 1000000).toFixed(1) + 'M';
  } else if (reqNumber >= 1000) {
    return (reqNumber / 1000).toFixed(1) + 'K';
  } else {
    return reqNumber?.toString();
  }
}

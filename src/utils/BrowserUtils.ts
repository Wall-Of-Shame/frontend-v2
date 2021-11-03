export const isFacebookApp = () => {
  // https://stackoverflow.com/questions/31569518
  var ua = navigator.userAgent || navigator.vendor || (window as any).opera;
  return ua.indexOf("FBAN") > -1 || ua.indexOf("FBAV") > -1;
};

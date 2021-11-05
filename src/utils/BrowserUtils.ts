export const isInstagramBrowser = () => {
  // https://stackoverflow.com/questions/31569518
  var ua = navigator.userAgent || navigator.vendor || (window as any).opera;
  return ua.indexOf("Instagram") > -1;
};

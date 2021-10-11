export default interface CacheContextInterface {
  isLatestVersion: boolean;
  currentVersion: string;
  latestVersion: string;
  refreshCacheAndReload: () => void;
}

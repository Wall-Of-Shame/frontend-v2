import React, { useEffect, useState } from "react";
import { getRedirectResult } from "firebase/auth";
import LoadingSpinner from "../components/loadingSpinner/LoadingSpinner";
import { useUser } from "../contexts/UserContext";
import { useCache } from "../contexts/CacheContext";
import AuthenticatedApp from "./AuthenticatedApp";
import UnauthenticatedApp from "./UnauthenticatedApp";
import "./App.scss";
import { auth } from "../firebase";
import AuthService from "../services/AuthService";
import { isInstagramBrowser } from "../utils/BrowserUtils";
import Alert from "../components/alert";

const App: React.FC = () => {
  const user = useUser();
  const { isLatestVersion, refreshCacheAndReload } = useCache();
  const [isAlertVisible, setIsAlertVisible] = useState(true);

  useEffect(() => {
    if (!isInstagramBrowser()) {
      // skip if not instagram browser
      return;
    }
    getRedirectResult(auth).then(async user => {
      if (!user) {
        return;
      }
      const token = await user.user.getIdToken();
      await AuthService.login(token);
      window.location.href = '';
    });
  }, []);

  return (
    <React.Suspense
      fallback={
        <LoadingSpinner
          loading={true}
          closeLoading={(): void => {}}
          message='Loading'
        />
      }
    >
      {user.user ? <AuthenticatedApp /> : <UnauthenticatedApp />}
      {!isLatestVersion && (
        <Alert
          showAlert={isAlertVisible}
          closeAlert={() => {
            setIsAlertVisible(false);
            refreshCacheAndReload();
          }}
          alertHeader={"App Update"}
          alertMessage={
            "A new version of the app is now available! This update will only take a few seconds."
          }
          hasConfirm={false}
          confirmHandler={() => {}}
          okHandler={refreshCacheAndReload}
        />
      )}
    </React.Suspense>
  );
};

export default App;

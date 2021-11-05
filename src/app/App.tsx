import React, { useState } from "react";
import LoadingSpinner from "../components/loadingSpinner/LoadingSpinner";
import { useUser } from "../contexts/UserContext";
import { useCache } from "../contexts/CacheContext";
import AuthenticatedApp from "./AuthenticatedApp";
import UnauthenticatedApp from "./UnauthenticatedApp";
import "./App.scss";
import Alert from "../components/alert";

const App: React.FC = () => {
  const user = useUser();
  const { isLatestVersion, refreshCacheAndReload } = useCache();
  const [isAlertVisible, setIsAlertVisible] = useState(true);

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

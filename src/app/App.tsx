import React, { useEffect, useState } from "react";
import LoadingSpinner from "../components/loadingSpinner/LoadingSpinner";
import { useUser } from "../contexts/UserContext";
import AuthenticatedApp from "./AuthenticatedApp";
import UnauthenticatedApp from "./UnauthenticatedApp";
import "./App.scss";
import Alert from "../components/alert";

const App: React.FC = () => {
  const user = useUser();
  const [showBrowserAlert, setShowBroserAlert] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent;
    if (
      userAgent.indexOf("Chrome") === -1 &&
      window.localStorage.getItem("browserWarning") !== "true"
    ) {
      setShowBroserAlert(true);
      window.localStorage.setItem("browserWarning", "true");
    }
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
      <Alert
        showAlert={showBrowserAlert}
        alertHeader={"Notice"}
        alertMessage={"This app is best optimised for Google Chrome :)"}
        hasConfirm={false}
        closeAlert={() => setShowBroserAlert(false)}
        confirmHandler={() => {}}
      />
    </React.Suspense>
  );
};

export default App;

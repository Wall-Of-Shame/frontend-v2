import React, { useEffect } from "react";
import { getRedirectResult } from "firebase/auth";

import LoadingSpinner from "../components/loadingSpinner/LoadingSpinner";
import { useUser } from "../contexts/UserContext";
import AuthenticatedApp from "./AuthenticatedApp";
import UnauthenticatedApp from "./UnauthenticatedApp";
import "./App.scss";
import { auth } from "../firebase";
import AuthService from "../services/AuthService";
import { isFacebookApp } from "../utils/BrowserUtils";

const App: React.FC = () => {
  const user = useUser();

  useEffect(() => {
    if (!isFacebookApp()) {
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
    </React.Suspense>
  );
};

export default App;

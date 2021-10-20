import React from "react";
import LoadingSpinner from "../components/loadingSpinner/LoadingSpinner";
import { useUser } from "../contexts/UserContext";
import AuthenticatedApp from "./AuthenticatedApp";
import UnauthenticatedApp from "./UnauthenticatedApp";
import "./App.scss";
import { useWindowSize } from "../utils/WindowUtils";
import { useEffect, useState } from "react";
import { isPlatform } from "@ionic/react";

const App: React.FC = () => {
  const user = useUser();
  const { isDesktop } = useWindowSize();
  const [isDesktopBefore, setIsDesktopBefore] = useState(isDesktop);

  useEffect(() => {
    if (isDesktop !== isDesktopBefore && !isPlatform("desktop")) {
      setIsDesktopBefore(isDesktop);
      window.location.reload();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDesktop]);

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

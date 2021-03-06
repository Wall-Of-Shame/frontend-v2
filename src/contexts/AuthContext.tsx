/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { useAsync } from "react-async";

import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  User,
  FacebookAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";
import { auth } from "../firebase";
import LoadingSpinner from "../components/loadingSpinner/LoadingSpinner";
import AuthContextInterface from "../interfaces/contexts/AuthContext";
import AuthService from "../services/AuthService";
import { FirebaseError } from "@firebase/util";
import TokenUtils from "../utils/TokenUtils";
import { UserData } from "../interfaces/models/Users";
import { getToken } from "@firebase/messaging";
import { useSocket } from "./SocketContext";
import { isInstagramBrowser } from "../utils/BrowserUtils";

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

const AuthContext = React.createContext<AuthContextInterface | undefined>(
  undefined
);

const AuthProvider: React.FunctionComponent = (props) => {
  const [firstAttemptFinished, setFirstAttemptFinished] = React.useState(false);
  const { connect } = useSocket();
  const {
    data = null,
    error,
    isRejected,
    isPending,
    isSettled,
    reload,
  } = useAsync({
    promiseFn: AuthService.getUser,
  });

  // Uses useLayoutEffect as auth status directly affects the view
  React.useLayoutEffect(() => {
    if (isSettled) {
      setFirstAttemptFinished(true);
    }
  }, [isSettled]);

  if (!firstAttemptFinished) {
    if (isPending) {
      return (
        <LoadingSpinner
          loading={true}
          closeLoading={(): void => {}}
          message='Loading'
        />
      );
    }
    if (isRejected && error) {
      return (
        <div>
          <p>There&apos;s a problem. Try refreshing the app.</p>
          <pre>{error.message}</pre>
        </div>
      );
    }
  }

  const signup = async (email: string, password: string): Promise<void> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await sendEmailVerification(user);
      const token = await user.getIdToken();
      // Added security checks
      AuthService.login(token);
      await AuthService.getUser();
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const continueWithGoogle = async (callback: () => void): Promise<void> => {
    try {
      let token: string;

      if (isInstagramBrowser()) {
        // if instagram browser
        await getRedirectResult(auth).then(async user => {
          if (!user) {
            await signInWithRedirect(auth, googleProvider);
          } else {
            token = await user.user.getIdToken();
          }
        })
      } else {
        const result = await signInWithPopup(auth, googleProvider);
        callback();
        token = await result.user.getIdToken();
      }

      await AuthService.login(token!);
      await connect();
      await AuthService.getUser();
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const continueWithFacebook = async (callback: () => void): Promise<void> => {
    try {
      let token: string;

      if (isInstagramBrowser()) {
        // if instagram browser
        await getRedirectResult(auth).then(async user => {
          if (!user) {
            await signInWithRedirect(auth, facebookProvider);
          } else {
            token = await user.user.getIdToken();
          }
        })
      } else {
        const result = await signInWithPopup(auth, facebookProvider);
        callback();
        token = await result.user.getIdToken();
      }

      await AuthService.login(token!);
      await connect();
      await AuthService.getUser();
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const token = await user.getIdToken();
      await AuthService.login(token);
      await connect();
      await AuthService.getUser();
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const refreshUser = async (): Promise<UserData | null> => {
    try {
      const user = await AuthService.getUser();
      return user;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const refreshFirebaseUser = async (): Promise<void> => {
    try {
      const user = auth.currentUser;
      return user?.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const getFirebaseUser = (): User | null => {
    return auth.currentUser;
  };

  const resendVerificationEmail = async (): Promise<void> => {
    try {
      const user = auth.currentUser;
      if (!user) {
        Promise.reject(new Error("User does not exist"));
      }
      sendEmailVerification(user!);
    } catch (error) {
      Promise.reject(new Error("Something went wrong"));
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const logout = (): Promise<void> =>
    AuthService.logout().then(() => {
      window.location.href = "onboarding";
    });

  return (
    <AuthContext.Provider
      value={{
        data,
        signup,
        login,
        continueWithGoogle,
        continueWithFacebook,
        refreshUser,
        refreshFirebaseUser,
        getFirebaseUser,
        resendVerificationEmail,
        resetPassword,
        logout,
      }}
      {...props}
    />
  );
};

const useAuth = (): AuthContextInterface => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error(`useAuth must be used within a AuthProvider`);
  }
  return context;
};

export { AuthProvider, useAuth };

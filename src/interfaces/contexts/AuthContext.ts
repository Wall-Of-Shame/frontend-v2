import { User } from "@firebase/auth";
import { UserData } from "../models/Users";

export default interface AuthContextInterface {
  data: UserData | null;
  signup(email: string, password: string): Promise<void>;
  login(email: string, password: string): Promise<void>;
  continueWithGoogle(callback: () => void): Promise<void>;
  continueWithFacebook(callback: () => void): Promise<void>;
  refreshUser(): Promise<UserData | null>;
  refreshFirebaseUser(): Promise<void>;
  getFirebaseUser(): User | null;
  resendVerificationEmail(): Promise<void>;
  resetPassword(email: string): Promise<void>;
  logout(): Promise<void>;
}

import store from "../app/store";
import { UserData } from "../interfaces/models/Users";
import { clearUser, setFriends, setUser } from "../reducers/MiscDux";
import APIService from "../services/APIService";
import TokenUtils from "../utils/TokenUtils";

const logout = (): Promise<void> => {
  TokenUtils.removeToken();
  store.dispatch(clearUser());
  return Promise.resolve();
};

const login = async (
  token: string,
  registrationToken?: string
): Promise<void> => {
  const data = {
    token: token,
    messagingToken: registrationToken,
  };
  try {
    const response = await APIService.post("auth", data);
    await TokenUtils.storeToken(response);
    store.dispatch(setUser(response.data.user));
  } catch (error: any) {
    return Promise.reject(error);
  }
};

const getUser = async (): Promise<UserData | null> => {
  const token = TokenUtils.getToken();
  if (!token) {
    return Promise.resolve(null);
  }

  try {
    const userResponse = await APIService.get("self");
    const friendsResponse = await APIService.get("friends");
    let authenticatedUser: UserData | null = null;
    if (userResponse.status === 200) {
      const user = userResponse.data;
      store.dispatch(setUser(user));
      authenticatedUser = user;
    }
    if (friendsResponse.status === 200) {
      const friends = friendsResponse.data;
      store.dispatch(setFriends(friends));
    }
    return authenticatedUser;
  } catch (error) {
    logout();
    return Promise.reject(error);
  }
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  login,
  logout,
  getUser,
};

import { AxiosResponse } from "axios";
import { ThrowItemPost } from "../interfaces/models/Shame";
import APIService from "../services/APIService";

const sendShame = async (shames: ThrowItemPost[]): Promise<void> => {
  try {
    let promises: Promise<AxiosResponse<any>>[] = [];
    shames.forEach((s) => {
      promises.push(APIService.post("shame", s));
    });
    await Promise.all(promises);
  } catch (error) {
    return Promise.reject(error);
  }
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  sendShame,
};

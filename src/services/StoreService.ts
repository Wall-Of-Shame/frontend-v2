import { PurchasePost } from "../interfaces/models/Store";
import APIService from "../services/APIService";

const purchaseItem = async (order: PurchasePost): Promise<void> => {
  try {
    await APIService.post(`store`, order);
  } catch (error) {
    return Promise.reject(error);
  }
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  purchaseItem,
};

import React from "react";

import StoreContextInterface from "../interfaces/contexts/StoreContext";
import { PurchasePost } from "../interfaces/models/Store";
import StoreService from "../services/StoreService";

const StoreContext = React.createContext<StoreContextInterface | undefined>(
  undefined
);

// Allows user data to be accessible from everywhere
const StoreProvider: React.FunctionComponent = (props) => {
  const purchaseItem = async (order: PurchasePost): Promise<void> => {
    try {
      await StoreService.purchaseItem(order);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  return (
    <StoreContext.Provider
      value={{
        purchaseItem,
      }}
      {...props}
    />
  );
};

const useStore = (): StoreContextInterface => {
  const context = React.useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};

export { StoreProvider, useStore };

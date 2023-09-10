
import React, { createContext, useContext, useState } from 'react';

const PopupContext = createContext();

export function usePopup() {
  return useContext(PopupContext);
}

export function CartProviderPopUp({ children }) {
  const [openPopUp, setOpenPopUp] = useState(false);

  return (
    <PopupContext.Provider value={{ openPopUp, setOpenPopUp }}>
      {children}
    </PopupContext.Provider>
  );
}

import React, { createContext, useContext, useState } from "react";

type FavoritesContextType = {
  favorites: string[];
  addFavorite: (item: string) => void;
  removeFavorite: (item: string) => void;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<string[]>([]);

  const addFavorite = (item: string) => {
    setFavorites((prev) => (prev.includes(item) ? prev : [...prev, item]));
  };

  const removeFavorite = (item: string) => {
    setFavorites((prev) => prev.filter((fav) => fav !== item));
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite }}>{children}</FavoritesContext.Provider>
  );
};

// Hook para usar el contexto fácilmente
export const useFavorites = () => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites debe usarse dentro de un FavoritesProvider");
  return ctx;
};

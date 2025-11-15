import React, { createContext, useContext, useState, useEffect } from "react";

type FavoritesContextType = {
  favorites: string[];
  addFavorite: (item: string) => void;
  removeFavorite: (item: string) => void;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const STORAGE_KEY = "selotengo_favorites";

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Cargar favoritos desde localStorage al iniciar
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Error loading favorites from localStorage:", error);
      return [];
    }
  });

  // Guardar favoritos en localStorage cuando cambien
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error("Error saving favorites to localStorage:", error);
    }
  }, [favorites]);

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

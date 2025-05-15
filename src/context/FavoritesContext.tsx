import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Dog } from '../types/types';

interface FavoritesContextType {
  favorites: Dog[];
  addFavorite: (dog: Dog) => void;
  removeFavorite: (dogId: string) => void;
  clearFavorites: () => void;
  isFavorite: (dogId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<Dog[]>([]);

  const addFavorite = (dog: Dog) => {
    if (!isFavorite(dog.id)) {
      setFavorites((prev) => [...prev, dog]);
    }
  };

  const removeFavorite = (dogId: string) => {
    setFavorites((prev) => prev.filter((dog) => dog.id !== dogId));
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  const isFavorite = (dogId: string) => {
    return favorites.some((dog) => dog.id === dogId);
  };

  const value = {
    favorites,
    addFavorite,
    removeFavorite,
    clearFavorites,
    isFavorite,
  };

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};

export default FavoritesContext; 
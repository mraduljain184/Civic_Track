"use client";

import { createContext, useContext, useState, useEffect } from "react";

const LocationContext = createContext();

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
};

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLoading(false);
      },
      (error) => {
        setError("Unable to retrieve your location");
        setLoading(false);
        // Set default location (you can change this)
        setLocation({
          latitude: 23.0225, // Ahmedabad coordinates as fallback
          longitude: 72.5714,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 600000,
      }
    );
  };

  const updateLocation = (newLocation) => {
    setLocation(newLocation);
  };

  return (
    <LocationContext.Provider
      value={{
        location,
        loading,
        error,
        getCurrentLocation,
        updateLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

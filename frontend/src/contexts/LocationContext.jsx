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
  const [location, setLocation] = useState(() => {
    const storedLocation = localStorage.getItem("userLocation");
    return storedLocation ? JSON.parse(storedLocation) : null;
  });
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
        const newLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setLocation(newLocation);
        // Store in localStorage for other components to use
        localStorage.setItem("userLocation", JSON.stringify(newLocation));
        setLoading(false);
      },
      (error) => {
        setError("Unable to retrieve your location");
        setLoading(false);
        // Set default location (you can change this)
        const defaultLocation = {
          latitude: 23.0225, // Ahmedabad coordinates as fallback
          longitude: 72.5714,
        };
        setLocation(defaultLocation);
        localStorage.setItem("userLocation", JSON.stringify(defaultLocation));
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
    localStorage.setItem("userLocation", JSON.stringify(newLocation));
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

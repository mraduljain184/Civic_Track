"use client";

import { useState, useEffect } from "react";
import { useLocation } from "../contexts/LocationContext";
import MapView from "./MapView";

const ReportIssueModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Roads",
    isAnonymous: false,
    photos: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [locationData, setLocationData] = useState(null);

  const { location } = useLocation();

  const categories = [
    "Roads",
    "Lighting",
    "Water Supply",
    "Cleanliness",
    "Public Safety",
    "Obstructions",
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 3) {
      setError("Maximum 3 photos allowed");
      return;
    }

    // Convert files to base64 for demo purposes
    // In production, you'd upload to a file storage service
    const photoPromises = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(photoPromises).then((photos) => {
      setFormData((prev) => ({ ...prev, photos }));
    });
  };

  const getCurrentLocationDetails = async () => {
    if (!location) return;

    try {
      // In a real app, you'd use a geocoding service like Google Maps API
      // For demo, we'll use a mock address
      const mockAddress = `${location.latitude.toFixed(
        4
      )}, ${location.longitude.toFixed(4)}, Ahmedabad, Gujarat`;

      setLocationData({
        address: mockAddress,
        coordinates: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
      });
    } catch (error) {
      console.error("Error getting location details:", error);
      setError("Unable to get location details");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!location) {
      setError("Location is required to report an issue");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const issueData = {
        ...formData,
        location: {
          type: "Point",
          coordinates: [location.longitude, location.latitude],
          address:
            locationData?.address ||
            `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`,
        },
      };

      const response = await fetch("http://localhost:8080/api/issues/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(issueData),
      });

      const data = await response.json();

      if (response.ok) {
        onSuccess();
      } else {
        setError(data.message || "Failed to report issue");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Auto-detect location on modal open
  useState(() => {
    if (location) {
      getCurrentLocationDetails();
    }
  }, [location]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Report New Issue</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition duration-200"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Add/Upload Photos (up to 3)
              </label>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className="cursor-pointer text-blue-400 hover:text-blue-300"
                >
                  <svg
                    className="w-8 h-8 mx-auto mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Click to upload photos
                </label>
                {formData.photos.length > 0 && (
                  <div className="mt-2 text-sm text-gray-400">
                    {formData.photos.length} photo(s) selected
                  </div>
                )}
              </div>
            </div>

            {/* Location Display */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Location (Auto-detected)
              </label>
              <div className="bg-gray-700 p-3 rounded-lg">
                <div className="text-sm text-gray-300">
                  {"Detecting location..."}
                </div>

                {MapView}
                <div className="mt-4 rounded-lg overflow-hidden">
                  {" "}
                  {/* Added margin-top for spacing and rounded corners */}
                  <MapView />
                </div>
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Brief title for the issue"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe the issue in detail"
              />
            </div>

            {/* Anonymous Reporting */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isAnonymous"
                checked={formData.isAnonymous}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
              />
              <label className="ml-2 text-sm text-gray-300">
                Report Anonymous
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition duration-200"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Submitting Issue...
                </div>
              ) : (
                "Submit Issue"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportIssueModal;
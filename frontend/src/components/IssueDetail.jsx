"use client";

import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

const IssueDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [flagReason, setFlagReason] = useState("");

  const isLoggedIn = localStorage.getItem("token");
  const currentUser = localStorage.getItem("username");

  useEffect(() => {
    fetchIssue();
  }, [id]);

  const fetchIssue = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/issues/${id}`);
      const data = await response.json();

      if (response.ok) {
        setIssue(data.issue);
      } else {
        setError(data.message || "Issue not found");
      }
    } catch (error) {
      setError("Error fetching issue details");
    } finally {
      setLoading(false);
    }
  };

  const handleFlag = async () => {
    if (!flagReason.trim()) {
      alert("Please provide a reason for flagging");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8080/api/issues/${id}/flag`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({ reason: flagReason }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Issue flagged successfully");
        setShowFlagModal(false);
        setFlagReason("");
      } else {
        alert(data.message || "Failed to flag issue");
      }
    } catch (error) {
      alert("Error flagging issue");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Reported":
        return "bg-red-500";
      case "In Progress":
        return "bg-yellow-500";
      case "Resolved":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading issue details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">{error}</div>
          <Link to="/" className="text-blue-400 hover:text-blue-300">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="text-blue-400 hover:text-blue-300 mr-4">
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
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </Link>
              <h1 className="text-xl font-bold text-white">CivicTrack</h1>
            </div>
            <div className="flex items-center space-x-4">
              {isLoggedIn && (
                <>
                  <button
                    onClick={() => setShowFlagModal(true)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200"
                  >
                    Report Spam
                  </button>
                  <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200">
                    Edit
                  </button>
                  <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200">
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          {/* Issue Header */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-2xl font-bold text-white">{issue.title}</h1>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white ${getStatusColor(
                  issue.status
                )}`}
              >
                {issue.status}
              </span>
            </div>

            <div className="text-sm text-gray-400 mb-4">
              Reported by:{" "}
              {issue.isAnonymous
                ? "Anonymous"
                : issue.reportedBy?.username || "Unknown"}
            </div>

            <div className="text-sm text-gray-500">
              {formatDate(issue.createdAt)}
            </div>
          </div>

          {/* Issue Photos */}
          {issue.photos && issue.photos.length > 0 && (
            <div className="p-6 border-b border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {issue.photos.map((photo, index) => (
                  <div
                    key={index}
                    className="aspect-video bg-gray-700 rounded-lg overflow-hidden"
                  >
                    <img
                      src={photo || "/placeholder.svg"}
                      alt={`Issue photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Issue Description */}
          <div className="p-6 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-3">
              Description
            </h3>
            <p className="text-gray-300 leading-relaxed">{issue.description}</p>
          </div>

          {/* Location */}
          <div className="p-6 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-3">
              📍 Location
            </h3>
            <p className="text-gray-300 mb-4">{issue.location.address}</p>

            {/* Mock Map */}
            <div className="bg-gray-700 rounded-lg h-48 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">🗺️</div>
                <div className="text-gray-400">Map View</div>
                <div className="text-sm text-gray-500 mt-1">
                  {issue.location.coordinates.latitude.toFixed(4)},{" "}
                  {issue.location.coordinates.longitude.toFixed(4)}
                </div>
              </div>
            </div>
          </div>

          {/* Activity Log */}
          <div className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Activity</h3>
            <div className="space-y-4">
              {issue.activity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-300">
                      <span className="font-medium">
                        {formatDate(activity.timestamp)}
                      </span>
                      {" - "}
                      <span>{activity.action}</span>
                    </div>
                    {activity.description && (
                      <div className="text-sm text-gray-500 mt-1">
                        {activity.description}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Flag Modal */}
      {showFlagModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-white mb-4">
              Report as Spam
            </h3>
            <textarea
              value={flagReason}
              onChange={(e) => setFlagReason(e.target.value)}
              placeholder="Please provide a reason for flagging this issue..."
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:ring-red-500 focus:border-red-500 mb-4"
              rows={4}
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowFlagModal(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleFlag}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-200"
              >
                Flag Issue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IssueDetail;

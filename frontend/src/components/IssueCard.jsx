import { Link } from "react-router-dom";

const IssueCard = ({ issue }) => {
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

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Roads":
        return "🛣️";
      case "Lighting":
        return "💡";
      case "Water Supply":
        return "💧";
      case "Cleanliness":
        return "🗑️";
      case "Public Safety":
        return "⚠️";
      case "Obstructions":
        return "🚧";
      default:
        return "📍";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in kilometers
    return d.toFixed(1);
  };

  // Get user's location from localStorage or context
  const userLocation = JSON.parse(
    localStorage.getItem("userLocation") ||
      '{"latitude": 23.0225, "longitude": 72.5714}'
  );
  const distance = calculateDistance(
    userLocation.latitude,
    userLocation.longitude,
    issue.location.coordinates.latitude,
    issue.location.coordinates.longitude
  );

  return (
    <Link to={`/issue/${issue._id}`} className="block">
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden hover:border-gray-600 transition duration-200 transform hover:scale-[1.02]">
        {/* Image */}
        {issue.photos && issue.photos.length > 0 ? (
          <div className="h-48 bg-gray-700 overflow-hidden">
            <img
              src={issue.photos[0] || "/placeholder.svg"}
              alt={issue.title}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="h-48 bg-gray-700 flex items-center justify-center">
            <div className="text-6xl">{getCategoryIcon(issue.category)}</div>
          </div>
        )}

        {/* Content */}
        <div className="p-4">
          {/* Category and Status */}
          <div className="flex items-center justify-between mb-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
              {getCategoryIcon(issue.category)} {issue.category}
            </span>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${getStatusColor(
                issue.status
              )}`}
            >
              {issue.status}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
            {issue.title}
          </h3>

          {/* Description */}
          <p className="text-gray-400 text-sm mb-3 line-clamp-2">
            {issue.description}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {distance} km
            </div>
            <div className="flex items-center">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {formatDate(issue.createdAt)}
            </div>
          </div>

          {/* Reporter */}
          <div className="mt-2 text-xs text-gray-500">
            Reported by:{" "}
            {issue.isAnonymous
              ? "Anonymous"
              : issue.reportedBy?.username || "Unknown"}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default IssueCard;

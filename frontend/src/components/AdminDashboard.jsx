"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalIssues: 0,
    reportedIssues: 0,
    inProgressIssues: 0,
    resolvedIssues: 0,
    flaggedIssues: 0,
  })
  const [flaggedIssues, setFlaggedIssues] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data for admin dashboard
    setStats({
      totalIssues: 156,
      reportedIssues: 45,
      inProgressIssues: 32,
      resolvedIssues: 79,
      flaggedIssues: 8,
    })

    setFlaggedIssues([
      {
        _id: "1",
        title: "Fake pothole report",
        category: "Roads",
        flags: [
          { flaggedBy: { username: "user1" }, reason: "Spam content" },
          { flaggedBy: { username: "user2" }, reason: "Fake report" },
        ],
        createdAt: new Date().toISOString(),
      },
    ])

    setLoading(false)
  }, [])

  const handleApproveIssue = (issueId) => {
    // Implementation for approving flagged issue
    console.log("Approving issue:", issueId)
  }

  const handleRejectIssue = (issueId) => {
    // Implementation for rejecting flagged issue
    console.log("Rejecting issue:", issueId)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading admin dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="text-blue-400 hover:text-blue-300 mr-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="text-2xl font-bold text-white mb-2">{stats.totalIssues}</div>
            <div className="text-gray-400">Total Issues</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="text-2xl font-bold text-red-400 mb-2">{stats.reportedIssues}</div>
            <div className="text-gray-400">Reported</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="text-2xl font-bold text-yellow-400 mb-2">{stats.inProgressIssues}</div>
            <div className="text-gray-400">In Progress</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="text-2xl font-bold text-green-400 mb-2">{stats.resolvedIssues}</div>
            <div className="text-gray-400">Resolved</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="text-2xl font-bold text-orange-400 mb-2">{stats.flaggedIssues}</div>
            <div className="text-gray-400">Flagged</div>
          </div>
        </div>

        {/* Flagged Issues */}
        <div className="bg-gray-800 rounded-lg border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">Flagged Issues</h2>
          </div>
          <div className="p-6">
            {flaggedIssues.length === 0 ? (
              <div className="text-center text-gray-400 py-8">No flagged issues to review</div>
            ) : (
              <div className="space-y-4">
                {flaggedIssues.map((issue) => (
                  <div key={issue._id} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-white font-medium">{issue.title}</h3>
                        <div className="text-sm text-gray-400 mt-1">Category: {issue.category}</div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleApproveIssue(issue._id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition duration-200"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectIssue(issue._id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition duration-200"
                        >
                          Reject
                        </button>
                      </div>
                    </div>

                    <div className="text-sm text-gray-400 mb-2">Flagged by {issue.flags.length} user(s):</div>

                    <div className="space-y-1">
                      {issue.flags.map((flag, index) => (
                        <div key={index} className="text-xs text-gray-500">
                          • {flag.flaggedBy.username}: {flag.reason}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard
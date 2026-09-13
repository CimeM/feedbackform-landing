import React, { useState, useEffect } from "react";
import FeedbackTicket from "../components/FeedbackTicket";

// Expanded AI Conversational & Feedback Demo Data
const feedbacksData = {
  origin: "feedbackform.rivieraapps.com",
  count: 5,
  entries: [
    {
      _id: "681736b4422da3f1a698043f",
      title: "E-Bike Rental Availability Inquiry",
      message: "User asked if E-Bikes are available for a family of 4 tomorrow morning in Antibes. AI provided pricing (€35/day) and direct booking link.",
      createdAt: "2026-09-13",
      type: "High Intent",
      sentiment: "Positive",
      intent: "Pricing & Availability",
      tags: ["E-Bike", "Family Rental", "High-Intent"],
      comments: [
        { id: 1, text: "AI successfully converted user to booking flow." }
      ]
    },
    {
      _id: "681736b4422da3f1a698043e",
      title: "Unmet Demand: Child Seat Request",
      message: "Visitor asked if child trailers or rear seats can be attached to E-Bikes. AI noted that child seats are currently out of stock for online booking.",
      createdAt: "2026-09-12",
      type: "Unmet Demand",
      sentiment: "Neutral",
      intent: "Gear & Accessories",
      tags: ["Child Seat", "Inventory Gap", "Feature Request"],
      comments: [
        { id: 2, text: "Need to order 5 extra rear child seats for autumn traffic." }
      ]
    },
    {
      _id: "681736b4422da3f1a698043b",
      title: "Coastal Route & Map Recommendations",
      message: "User asked for safe cycling paths to Cap d'Antibes avoiding heavy car traffic. AI suggested the coastal bike route.",
      createdAt: "2026-09-11",
      type: "Feedback",
      sentiment: "Positive",
      intent: "Route Info",
      tags: ["Cap d'Antibes", "Route Advice", "AI Guidance"],
      comments: []
    },
    {
      _id: "681736b4422da3f1a698043a",
      title: "Widget Mobile Overlay Issue",
      message: "The chat widget bubble covers the 'Checkout' button on iOS Safari screens under 390px width.",
      createdAt: "2026-09-10",
      type: "Bug",
      sentiment: "Frustrated",
      intent: "Technical Issue",
      tags: ["Mobile", "UI Bug", "Safari"],
      comments: [
        { id: 3, text: "Investigating z-index and bottom padding on mobile." }
      ]
    },
    {
      _id: "681736b4422da3f1a6980433",
      title: "Dark Mode Request for Plugin Widget",
      message: "User requested an automatic dark mode trigger based on system preference for nighttime browsing.",
      createdAt: "2026-09-08",
      type: "Feature Request",
      sentiment: "Neutral",
      intent: "UI/UX",
      tags: ["Dark Theme", "Customization"],
      comments: []
    }
  ]
};

const typeOptions = ["All", "High Intent", "Unmet Demand", "Feedback", "Bug", "Feature Request"];

// Fetch feedbacks from API
async function fetchFeedbacks(url, selectedHostname) {
  try {
    const sanitizedHost = encodeURIComponent(selectedHostname);
    const response = await fetch(`${url}?origin=${sanitizedHost}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.entries.map((fb) => ({
      _id: fb._id || Date.now().toString(),
      title: fb.title || "Untitled Conversation",
      message: fb.message || "",
      type: fb.type || "Feedback",
      sentiment: fb.sentiment || "Neutral",
      intent: fb.intent || "General Inquiries",
      tags: Array.isArray(fb.tags) ? fb.tags : [],
      comments: Array.isArray(fb.comments) ? fb.comments : [],
      createdAt: fb.createdAt || new Date().toISOString(),
      origin: fb.origin || "unknown",
      updatedAt: fb.updatedAt || new Date().toISOString()
    }));
  } catch (e) {
    console.warn("Fetch error, defaulting to fallback data:", e);
    return feedbacksData.entries.map((fb) => ({
      ...fb,
      comments: Array.isArray(fb.comments) ? fb.comments : [],
      tags: Array.isArray(fb.tags) ? fb.tags : [],
      createdAt: fb.createdAt || new Date().toISOString(),
      updatedAt: fb.updatedAt || new Date().toISOString()
    }));
  }
}

// Update feedback via API
async function updateFeedback(url, feedback) {
  try {
    const response = await fetch(`${url}/${feedback._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest"
      },
      body: JSON.stringify({
        title: feedback.title.substring(0, 100),
        message: feedback.message.substring(0, 1000),
        type: feedback.type,
        tags: feedback.tags.filter((t) => t.length <= 20),
        comments: feedback.comments
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Update failed");
    }

    return await response.json();
  } catch (e) {
    console.error("Update error:", e);
    throw e;
  }
}

const Dashboard = () => {
  const [selectedType, setSelectedType] = useState("All");
  const [selectedHostname, setSelectedHostname] = useState("feedbackform.rivieraapps.com");
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [comment, setComment] = useState("");
  const [tag, setTag] = useState("");
  const [search, setSearch] = useState("");

  const apiurl = "https://api.feedbackform.rivieraapps.com/api/feedback";

  useEffect(() => {
    fetchFeedbacks(apiurl, selectedHostname).then((fbs) => {
      setFeedbacks(fbs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    });
  }, [selectedHostname]);

  // Filtering logic: by type and search query
  const filteredFeedbacks = feedbacks.filter((fb) => {
    const matchesType = selectedType === "All" || fb.type === selectedType;
    const searchLower = search.toLowerCase();
    const matchesSearch =
      fb.title?.toLowerCase().includes(searchLower) ||
      fb.message?.toLowerCase().includes(searchLower) ||
      (fb.tags && fb.tags.some((t) => t.toLowerCase().includes(searchLower)));
    return matchesType && (!search || matchesSearch);
  });

  const handleAddComment = async () => {
    if (!comment.trim() || !selectedFeedback) return;

    const newComments = [
      ...(selectedFeedback.comments || []),
      { id: Date.now(), text: comment.trim() }
    ];

    await updateFeedback(apiurl, { ...selectedFeedback, comments: newComments });

    setFeedbacks((prev) =>
      prev.map((fb) =>
        fb._id === selectedFeedback._id ? { ...fb, comments: newComments } : fb
      )
    );

    setSelectedFeedback((prev) => ({
      ...prev,
      comments: newComments
    }));

    setComment("");
  };

  const handleAddTag = async () => {
    if (!tag.trim() || !selectedFeedback) return;
    const updated = {
      ...selectedFeedback,
      tags: [...(selectedFeedback.tags || []), tag.trim()]
    };
    await updateFeedback(apiurl, updated);
    setFeedbacks((prev) =>
      prev.map((fb) => (fb._id === updated._id ? updated : fb))
    );
    setSelectedFeedback((prev) =>
      prev && prev._id === updated._id ? { ...prev, tags: updated.tags } : prev
    );
    setTag("");
  };

  const handleRemoveTag = (tagIdx) => {
    const newTags = selectedFeedback.tags.filter((_, idx) => idx !== tagIdx);

    updateFeedback(apiurl, { ...selectedFeedback, tags: newTags });

    setSelectedFeedback((prev) => ({
      ...prev,
      tags: newTags
    }));

    setFeedbacks((prev) =>
      prev.map((fb) =>
        fb._id === selectedFeedback._id ? { ...fb, tags: newTags } : fb
      )
    );
  };

  const handleHostChange = async () => {
    const newFeedbacks = await fetchFeedbacks(apiurl, selectedHostname);

    setFeedbacks(
      newFeedbacks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    );

    setSelectedFeedback((prev) =>
      newFeedbacks.find((fb) => fb._id === prev?._id) || null
    );
  };

  const handleSelectFeedback = (fb) => {
    setSelectedFeedback({
      ...fb,
      comments: Array.isArray(fb.comments) ? fb.comments : [],
      tags: Array.isArray(fb.tags) ? fb.tags : []
    });
  };

  class ErrorBoundary extends React.Component {
    state = { hasError: false };
    static getDerivedStateFromError() {
      return { hasError: true };
    }
    componentDidCatch(error, info) {
      console.error(error, info);
    }
    resetError = () => this.setState({ hasError: false });
    render() {
      if (this.state.hasError) {
        return (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg">
            <div>Error loading conversation details. Please try again.</div>
            <button
              onClick={this.resetError}
              className="mt-2 text-xs bg-red-600 text-white px-2 py-1 rounded"
            >
              Try Again
            </button>
          </div>
        );
      }
      return this.props.children;
    }
  }

  // Helper for Sentiment badge colors
  const getSentimentBadge = (sentiment) => {
    switch (sentiment) {
      case "Positive":
        return "bg-green-100 text-green-700 border-green-200";
      case "Frustrated":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      {/* Header Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            AI Analytics & Conversational Insights
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Real-time intent tracking, user feedback, and lead conversion logs.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
            <span className="w-2 h-2 mr-1.5 bg-green-500 rounded-full animate-pulse"></span>
            AI Engine Live
          </span>
        </div>
      </div>

      {/* KPI Stats Analytics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Total Conversations
          </p>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-extrabold text-gray-900">
              {feedbacks.length}
            </span>
            <span className="text-xs font-semibold text-green-600">+12% this week</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            AI Resolution Rate
          </p>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-extrabold text-blue-600">84.2%</span>
            <span className="text-xs text-gray-500">Automated</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            High-Intent Leads
          </p>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-extrabold text-emerald-600">
              {feedbacks.filter((f) => f.type === "High Intent").length}
            </span>
            <span className="text-xs text-emerald-600 font-semibold">Ready to Convert</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Customer Sentiment
          </p>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-extrabold text-gray-800">78% Positive</span>
            <span className="text-xs text-gray-400">Gemini Evaluated</span>
          </div>
        </div>
      </div>

      {/* Filter and Host Settings Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-wrap items-center gap-3 mb-6">
        <div className="flex items-center space-x-2">
          <label className="text-xs font-semibold text-gray-600 uppercase">Category:</label>
          <select
            className="border border-gray-300 rounded-lg text-sm px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            {typeOptions.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-xs font-semibold text-gray-600 uppercase">Host Domain:</label>
          <input
            className="border border-gray-300 rounded-lg text-sm px-3 py-1.5 w-48 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            type="text"
            placeholder="Hostname"
            value={selectedHostname}
            onChange={(e) => setSelectedHostname(e.target.value)}
          />
          <button
            className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
            onClick={handleHostChange}
          >
            Apply
          </button>
        </div>

        <div className="flex-1 min-w-[200px]">
          <input
            className="w-full border border-gray-300 rounded-lg text-sm px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            type="text"
            placeholder="Search logs by keyword, intent, or tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Main Conversation List & Detail Split View */}
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Ticket List View */}
        {!selectedFeedback || window.innerWidth >= 640 ? (
          <div key="feedbacklist" className="w-full sm:w-[448px] sm:max-w-md">
            <ul className="space-y-3">
              {filteredFeedbacks.length > 0 ? (
                filteredFeedbacks.map((fb) => (
                  <li
                    key={fb._id}
                    className={`p-4 rounded-xl shadow-sm cursor-pointer border transition-all ${
                      selectedFeedback && selectedFeedback._id === fb._id
                        ? "bg-blue-50/70 border-blue-500 ring-1 ring-blue-500"
                        : "bg-white border-gray-200 hover:border-blue-300 hover:shadow"
                    }`}
                    onClick={() => handleSelectFeedback(fb)}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h2 className="text-base font-bold text-gray-900 line-clamp-1">
                        {fb.title || "Conversation"}
                      </h2>
                      <span className="text-xs text-gray-400 font-mono">
                        #{fb._id.slice(-4)}
                      </span>
                    </div>

                    <p className="text-xs text-gray-600 line-clamp-2 mb-3">
                      {fb.message}
                    </p>

                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-0.5 rounded-md font-medium text-[10px] border ${getSentimentBadge(
                            fb.sentiment
                          )}`}
                        >
                          {fb.sentiment || "Neutral"}
                        </span>
                        <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md text-[10px] font-semibold">
                          {fb.type}
                        </span>
                      </div>
                      <span className="text-gray-400 text-[11px]">
                        {fb.createdAt}
                      </span>
                    </div>

                    {fb.tags && fb.tags.length > 0 && (
                      <div className="flex gap-1.5 mt-2 flex-wrap">
                        {fb.tags.map((t, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px]"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </li>
                ))
              ) : (
                <div className="p-8 text-center bg-white rounded-xl border border-gray-200 text-gray-500">
                  No conversations match your current search/filter criteria.
                </div>
              )}
            </ul>
          </div>
        ) : null}

        {/* Selected Feedback Detail Panel */}
        {selectedFeedback ? (
          <div key={`feedback-${selectedFeedback._id}`} className="flex-1 min-w-0">
            <ErrorBoundary>
              <FeedbackTicket
                feedback={selectedFeedback}
                tag={tag}
                setTag={setTag}
                handleAddTag={handleAddTag}
                handleRemoveTag={handleRemoveTag}
                comment={comment}
                setComment={setComment}
                handleAddComment={handleAddComment}
                onBack={
                  window.innerWidth < 640
                    ? () => setSelectedFeedback(null)
                    : undefined
                }
              />
            </ErrorBoundary>
          </div>
        ) : (
          /* Desktop Empty State */
          window.innerWidth >= 640 && (
            <div className="flex-1 border-2 border-dashed border-gray-200 rounded-xl p-12 text-center text-gray-400 bg-gray-50/50 flex flex-col items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-300 mb-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <p className="text-base font-medium text-gray-600">No Conversation Selected</p>
              <p className="text-xs text-gray-400 mt-1">
                Select a log from the left sidebar to inspect AI interactions, add tags, or review notes.
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Dashboard;
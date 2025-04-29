import React, { useState, useEffect } from "react";

// Demo feedbacks data (for fallback)
const feedbacksData = [
  {
    id: 14421,
    content: "It would be great to have a dark mode for the plugin.",
    date: "2025-04-29",
    type: "Feature Request",
    tags: ["UI", "Accessibility"],
    comments: [
      { id: 1, text: "Great idea!" }
    ]
  },
  {
    id: 14422,
    content: "The feedback form doesn't submit on mobile devices.",
    date: "2025-04-28",
    type: "Bug",
    tags: ["Mobile", "Form"],
    comments: []
  },
  {
    id: 14424,
    content: "Please add the dark theme to the plugin!.",
    date: "2025-04-18",
    type: "Feedback",
    tags: ["Mobile", "Form"],
    comments: []
  },
  {
    id: 14425,
    content: "The feedback form doesn't submit on mobile devices.",
    date: "2025-04-28",
    type: "Bug",
    tags: ["Mobile", "Form"],
    comments: []
  },
  {
    id: 14428,
    content: "Please add the dark theme to the plugin!.",
    date: "2025-04-18",
    type: "Feedback",
    tags: ["Mobile", "Form"],
    comments: []
  }
];

const typeOptions = ["All", "Feature Request", "Bug", "Other"];

// Fetch feedbacks from API
async function fetchFeedbacks() {
  try {
    const response = await fetch('https://feedbackform.rivieraapps.com/api/feedbacks');
    if (!response.ok) throw new Error("Failed to fetch");
    const data = await response.json();
    // Ensure comments and tags always exist
    return data.map(fb => ({
      ...fb,
      comments: Array.isArray(fb.comments) ? fb.comments : [],
      tags: Array.isArray(fb.tags) ? fb.tags : [],
    }));
  } catch (e) {
    // Fallback to demo data
    return feedbacksData.map(fb => ({
      ...fb,
      comments: Array.isArray(fb.comments) ? fb.comments : [],
      tags: Array.isArray(fb.tags) ? fb.tags : [],
    }));
  }
}

// Update feedback via API
async function updateFeedback(feedback) {
  try {
    const response = await fetch(`https://feedbackform.rivieraapps.com/api/feedbacks/${feedback.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(feedback)
    });
    if (!response.ok) throw new Error("Failed to update");
    return await response.json();
  } catch (e) {
    // For demo, just return the feedback
    return feedback;
  }
}

const Dashboard = () => {
  const [selectedType, setSelectedType] = useState("All");
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [comment, setComment] = useState("");
  const [tag, setTag] = useState("");

  // Load feedbacks from API on mount
  useEffect(() => {
    fetchFeedbacks().then(fbs => {
      // Sort by date descending
      setFeedbacks(fbs.sort((a, b) => new Date(b.date) - new Date(a.date)));
    });
  }, []);

  // Filter feedbacks by type
  const filteredFeedbacks =
    selectedType === "All"
      ? feedbacks
      : feedbacks.filter((fb) => fb.type === selectedType);

  // Add a comment and update via API
  const handleAddComment = async () => {
    if (!comment.trim() || !selectedFeedback) return;
    const updated = {
      ...selectedFeedback,
      comments: [
        ...(selectedFeedback.comments || []),
        { id: Date.now(), text: comment.trim() }
      ]
    };
    await updateFeedback(updated);
    setFeedbacks((prev) =>
      prev.map((fb) => (fb.id === updated.id ? updated : fb))
    );
    setSelectedFeedback(updated);
    setComment("");
  };

  // Add a tag and update via API
  const handleAddTag = async () => {
    if (!tag.trim() || !selectedFeedback) return;
    const updated = {
      ...selectedFeedback,
      tags: [
        ...(selectedFeedback.tags || []),
        tag.trim()
      ]
    };
    await updateFeedback(updated);
    setFeedbacks((prev) =>
      prev.map((fb) => (fb.id === updated.id ? updated : fb))
    );
    setSelectedFeedback(updated);
    setTag("");
  };

  // When selecting a feedback, ensure comments/tags exist
  const handleSelectFeedback = (fb) => {
    setSelectedFeedback({
      ...fb,
      comments: Array.isArray(fb.comments) ? fb.comments : [],
      tags: Array.isArray(fb.tags) ? fb.tags : [],
    });
  };

  return (
    <div className="max-w-4xl mx-auto my-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Feedback Dashboard</h1>
      <div className="flex items-center mb-6 gap-4">
        <label className="font-semibold">Sort by type:</label>
        <select
          className="border rounded px-2 py-1"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          {typeOptions.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Feedback List */}
        <div>
          <ul>
            {filteredFeedbacks.map((fb) => (
              <li
                key={fb.id}
                className={`mb-4 p-4 rounded shadow cursor-pointer border hover:border-blue-400 transition ${
                  selectedFeedback && selectedFeedback.id === fb.id
                    ? "bg-blue-50 border-blue-400"
                    : "bg-white border-gray-200"
                }`}
                onClick={() => handleSelectFeedback(fb)}
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-blue-700">{fb.type}</h2> #{fb.id}
                  <span className="text-xs text-gray-500">{fb.date}</span>
                </div>
                <div className="flex gap-2 mt-2">
                  {fb.tags && fb.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded text-xs"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
        {/* Feedback Details */}
        <div>
          {selectedFeedback ? (
            <div className="p-4 bg-white rounded shadow border border-gray-200">
              <h2 className="text-2xl font-bold mb-2 text-blue-700">{selectedFeedback.type}</h2>
              <div className="mb-2 text-sm text-gray-500">{selectedFeedback.date}</div>
              <div className="mb-4 text-gray-800">{selectedFeedback.content}</div>
              <div className="mb-4">
                <h3 className="font-semibold mb-1">Tags:</h3>
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedFeedback.tags &&
                    selectedFeedback.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded text-xs"
                      >
                        {t}
                      </span>
                    ))}
                </div>
                <div className="flex gap-2">
                  <input
                    className="border rounded px-2 py-1 text-sm"
                    type="text"
                    placeholder="Add tag"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                  />
                  <button
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    onClick={handleAddTag}
                  >
                    Add
                  </button>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Comments:</h3>
                <ul className="mb-2">
                  {selectedFeedback.comments &&
                    selectedFeedback.comments.map((c) => (
                      <li key={c.id} className="mb-1 text-gray-700">
                        • {c.text}
                      </li>
                    ))}
                </ul>
                <div className="flex gap-2">
                  <input
                    className="border rounded px-2 py-1 text-sm"
                    type="text"
                    placeholder="Add comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <button
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    onClick={handleAddComment}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 text-gray-400 text-center">Select a feedback to view details.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

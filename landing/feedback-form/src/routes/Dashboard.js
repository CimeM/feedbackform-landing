import React, { useState, useEffect } from "react";

import FeedbackTicket from '../components/FeedbackTicket';

// Demo feedbacks data (for fallback)
const feedbacksData = {
  origin: "localhost",
  count: 1,
  entries: [
    {
      _id: "681736b4422da3f1a698043b",
      message: "It would be great to have a dark mode for the plugin.",
      title: "Mobile friendly",
      createdAt	: "2025-04-29",
      type: "Feature Request",
      tags: ["UI", "Accessibility"],
      comments: [
        { id: 1, text: "Great idea!" }
      ]
    },
    {
      _id: "681736b4422da3f1a698043a",
      title: "Mobile friendly",
      message: "The feedback form doesn't submit on mobile devices.",
      createdAt	: "2025-04-28",
      type: "Bug",
      tags: ["Mobile", "Form"],
      comments: []
    },
    {
      _id: "681736b4422da3f1a6980433",
      title: "Dark theme",
      message: "Please add the dark theme to the plugin!.",
      createdAt	: "2025-04-18",
      type: "Feedback",
      tags: ["Mobile", "Form"],
      comments: []
    },
    {
      _id: "681736b4422da3f1a698043e",
      title: "Mobile support",
      message: "The feedback form doesn't submit on mobile devices.",
      createdAt	: "2025-04-28",
      type: "Bug",
      tags: ["Mobile", "Form"],
      comments: []
    },
    {
      _id: "681736b4422da3f1a698043h",
      title: "Dark theme",
      message: "Please add the dark theme to the plugin!.",
      createdAt	: "2025-04-18",
      type: "Feedback",
      tags: ["Mobile", "Form"],
      comments: []
    }
  ]
};

const typeOptions = ["All", "Feedback", "Bug", "Other"];

// Fetch feedbacks from API
async function fetchFeedbacks(url, selectedHostname ) {
  try {
    const sanitizedHost = encodeURIComponent(selectedHostname);
    const response = await fetch(`${url}?origin=${sanitizedHost}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("fetchFeedbacks data", data)
    // Ensure required fields with fallbacks
    return data.entries.map((fb: any) => ({
      _id: fb._id || Date.now().toString(),
      title: fb.title || 'Untitled Feedback',
      message: fb.message || '',
      type: fb.type || 'Other',
      tags: Array.isArray(fb.tags) ? fb.tags : [],
      comments: Array.isArray(fb.comments) ? fb.comments : [],
      createdAt: fb.createdAt || new Date().toISOString(),
      origin: fb.origin || 'unknown',
      updatedAt: fb.updatedAt || new Date().toISOString()
    }));
    
  } catch (e) {
    console.error('Fetch error:', e);
    // Return sanitized demo data
    return feedbacksData.entries.map(fb => ({
      ...fb,
      comments: Array.isArray(fb.comments) ? fb.comments : [],
      tags: Array.isArray(fb.tags) ? fb.tags : [],
      createdAt: fb.createdAt || new Date().toISOString(),
      updatedAt: fb.updatedAt || new Date().toISOString()
    }));
  }
}

// Update feedback via API
async function updateFeedback(url, feedback: any) {
  try {
    console.log("feedback", feedback)
    const response = await fetch(`${url}/${feedback._id}`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest"
      },
      body: JSON.stringify({
        title: feedback.title.substring(0, 100), // Sanitize input
        message: feedback.message.substring(0, 1000),
        type: ['Bug', 'Feature Request', 'Other'].includes(feedback.type) 
          ? feedback.type 
          : 'Other',
        tags: feedback.tags.filter((t: string) => t.length <= 20),
        comments: feedback.comments
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Update failed');
    }

    return await response.json();
  } catch (e) {
    console.error('Update error:', e);
    throw e; // Propagate error for UI handling
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

  const apiurl = "https://api.feedbackform.rivieraapps.com/api/feedback"
  useEffect(() => {
    fetchFeedbacks(apiurl, selectedHostname).then(fbs => {
      setFeedbacks(fbs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    });
  }, []);

  // Filtering logic: by type and search
  const filteredFeedbacks = feedbacks.filter(fb => {
    const matchesType = selectedType === "All" || fb.type === selectedType;
    const searchLower = search.toLowerCase();
    const matchesSearch =
      fb.title?.toLowerCase().includes(searchLower) ||
      fb.message?.toLowerCase().includes(searchLower) ||
      (fb.tags && fb.tags.some(t => t.toLowerCase().includes(searchLower)));
    return matchesType && (!search || matchesSearch);
  });

  const handleAddComment = async () => {
    if (!comment.trim() || !selectedFeedback) return;
    
    // Create NEW comments array (but keep other feedback properties)
    const newComments = [...(selectedFeedback.comments || []), 
      { id: Date.now(), text: comment.trim() }
    ];
  
    // Update backend
    await updateFeedback(apiurl, { ...selectedFeedback, comments: newComments });
  
    // Update parent state WITHOUT new object
    setFeedbacks(prev => 
      prev.map(fb => 
        fb._id === selectedFeedback._id 
          ? { ...fb, comments: newComments } 
          : fb
      )
    );
  
    // Preserve object reference unless comments changed
    setSelectedFeedback(prev => ({
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
    setFeedbacks(prev =>
      prev.map(fb => (fb._id === updated._id ? updated : fb))
    );
    setSelectedFeedback(prev =>
      prev && prev._id === updated._id
        ? { ...prev, tags: updated.tags }
        : prev
    );
    setTag("");
  };

  // Tag removal handler
  const handleRemoveTag = (tagIdx) => {
    const newTags = selectedFeedback.tags.filter((_, idx) => idx !== tagIdx);
    
    updateFeedback(apiurl, { ...selectedFeedback, tags: newTags });
    
    setSelectedFeedback(prev => ({
      ...prev,
      tags: newTags
    }));
    
    setFeedbacks(prev => 
      prev.map(fb => 
        fb._id === selectedFeedback._id 
          ? { ...fb, tags: newTags } 
          : fb
      )
    );
  };

  const handleHostChange = async () => {
    const newFeedbacks = await fetchFeedbacks(selectedHostname);
    
    setFeedbacks(newFeedbacks.sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    ));
  
    // Preserve selected feedback if it still exists
    setSelectedFeedback(prev => 
      newFeedbacks.find(fb => fb._id === prev?._id) || null
    );
  };

  const handleSelectFeedback = (fb) => {
    setSelectedFeedback({
      ...fb,
      comments: Array.isArray(fb.comments) ? fb.comments : [],
      tags: Array.isArray(fb.tags) ? fb.tags : [],
    });
  };

  class ErrorBoundary extends React.Component {
    state = { hasError: false };
    static getDerivedStateFromError() { return { hasError: true }; }
    componentDidCatch(error, info) { /* log error */ }
    resetError = () => this.setState({ hasError: false });
    render() {
      if (this.state.hasError) {
        return (
          <div>
            <div>Error loading dashboard. Please refresh.</div>
            <button onClick={this.resetError}>Try Again</button>
          </div>
        );
      }
      return this.props.children;
    }
  }

  // Responsive: show sidebar as drawer on mobile
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        
        <h1 className="text-3xl font-bold mb-6 text-blue-700">Feedback Dashboard</h1>
        <div className="flex flex-wrap items-center mb-4 gap-2">
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
          <label className="font-semibold">Host</label>
          <input
            className="border rounded px-2 py-1 text-sm"
            type="text"
            placeholder="Hostname"
            value={selectedHostname}
            onChange={(e) => setSelectedHostname(e.target.value)}
          />
          <button
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
            onClick={handleHostChange}
          >
            Set
          </button>
          {/* Search field */}
          <input
            className="border rounded px-2 py-1 text-sm flex-1 min-w-[120px]"
            type="text"
            placeholder="Search by title, tag, or message"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
    
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Feedback List */}
          {!selectedFeedback || window.innerWidth >= 640 ? (
            <div key="feedbacklist"
              className="w-full sm:w-[448px] sm:max-w-md"
            >
              <ul>
                {filteredFeedbacks.map((fb) => (
                  <li
                    key={fb._id}
                    className={`mb-4 p-4 rounded shadow cursor-pointer border hover:border-blue-400 transition ${
                      selectedFeedback && selectedFeedback._id === fb._id
                        ? "bg-blue-50 border-blue-400"
                        : "bg-white border-gray-200"
                    }`}
                    onClick={() => handleSelectFeedback(fb)}
                  >
                    <div className="flex justify-between items-center">
                      <h2 className="text-lg font-semibold text-blue-700">{fb.title || "Feedback"}</h2> #{fb._id.slice(-5)}
                      <span className="text-xs text-gray-500">{fb.createdAt}</span>
                    </div>
                    <div className="flex gap-2 mt-2 flex-wrap">
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
          ) : null}
    
          {/* Feedback Details */}
          {selectedFeedback && (
            <div key={`feedback-${selectedFeedback._id}`} className="flex-1 min-w-0" >
              <ErrorBoundary>
              </ErrorBoundary>

                <FeedbackTicket 
                  feedback={selectedFeedback}
                  tag={tag}
                  setTag={setTag}
                  handleAddTag={handleAddTag}
                  handleRemoveTag={handleRemoveTag}
                  comment={comment}
                  setComment={setComment}
                  handleAddComment={handleAddComment}
                  onBack={window.innerWidth < 640 ? () => setSelectedFeedback(null) : undefined}
                />
            </div>
          )}
          
    
          {/* Show placeholder if no feedback is selected and on desktop */}
          {!selectedFeedback && window.innerWidth >= 640 && (
            <div className="p-6 text-gray-400 text-center">
              Select a feedback to view details.
            </div>
          )}
        </div>
      </div>
    
  );
  
};

export default Dashboard;
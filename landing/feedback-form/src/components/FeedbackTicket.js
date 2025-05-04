import React from "react";

export default function FeedbackTicket({
  feedback,
  tag,
  setTag,
  handleAddTag,
  handleRemoveTag,
  comment,
  setComment,
  handleAddComment,
  onBack // optional, for mobile back button
}) {
  if (!feedback) return null;
  return (
    <div className="p-4 sm:p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      {onBack && (
        <div className="flex items-center mb-4 sm:hidden">
          <button
            onClick={onBack}
            className="text-blue-600 font-semibold flex items-center"
          >
            ← Back to List
          </button>
        </div>
      )}
      <TicketHeader type={feedback.type} createdAt={feedback.createdAt} title={feedback.title} />
      <TicketMessage message={feedback.message} />
      <TagList
        tags={feedback.tags}
        tag={tag}
        setTag={setTag}
        onAddTag={handleAddTag}
        onRemoveTag={handleRemoveTag}
      />
      <CommentList comments={feedback.comments} />
      <CommentInput
        comment={comment}
        setComment={setComment}
        onAddComment={handleAddComment}
      />
    </div>
  );
}

function TicketHeader({ type, createdAt, title }) {
  const typeStyles = {
    "Bug": "bg-red-100 text-red-700",
    "Feature Request": "bg-blue-100 text-blue-700",
    "Other": "bg-gray-100 text-gray-700",
    "Feedback": "bg-green-100 text-green-700"
  };
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between">
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${typeStyles[type] || "bg-gray-100 text-gray-700"}`}>
          {type}
        </span>
        <span className="text-xs text-gray-400">{new Date(createdAt).toLocaleString()}</span>
      </div>
      <h2 className="text-xl font-bold mt-2 mb-1 text-gray-900">{title}</h2>
    </div>
  );
}

function TicketMessage({ message }) {
  return (
    <p className="mb-6 text-gray-700 text-base leading-relaxed border-l-4 border-blue-100 pl-4 italic">
      {message}
    </p>
  );
}

function TagList({ tags = [], tag, setTag, onAddTag, onRemoveTag }) {
  return (
    <div className="mb-6">
      <h3 className="font-semibold mb-2 text-gray-800">Tags</h3>
      <div className="flex flex-wrap gap-2 mb-3">
        {tags.map((t, idx) => (
          <span
            key={idx}
            className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium"
          >
            #{t}
            <button
              className="ml-2 text-blue-400 hover:text-blue-700 focus:outline-none"
              onClick={() => onRemoveTag(idx)}
              aria-label="Remove tag"
            >
              &times;
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="border rounded-full px-3 py-1 text-sm focus:ring-2 focus:ring-blue-200"
          type="text"
          placeholder="Add tag"
          value={tag}
          onChange={e => setTag(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold hover:bg-blue-700"
          onClick={onAddTag}
        >
          Add
        </button>
      </div>
    </div>
  );
}

function CommentList({ comments = [] }) {
  return (
    <div className="mb-4">
      <h3 className="font-semibold mb-2 text-gray-800">Comments</h3>
      <ul className="mb-3 space-y-3">
        {comments.length > 0 ? (
          comments.map((c, idx) => (
            <li key={c.id || idx} className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold mr-2">
                {c.user ? c.user[0].toUpperCase() : "U"}
              </div>
              <div className="bg-gray-100 rounded-lg px-4 py-2 flex-1">
                <div className="text-sm text-gray-800">{c.text}</div>
                <div className="text-xs text-gray-400 mt-1">
                  {c.user && <span className="mr-2">{c.user}</span>}
                  {c.createdAt ? new Date(c.createdAt).toLocaleString() : ""}
                </div>
              </div>
            </li>
          ))
        ) : (
          <li className="text-gray-400 italic">No comments yet.</li>
        )}
      </ul>
    </div>
  );
}

function CommentInput({ comment, setComment, onAddComment }) {
  return (
    <div className="flex gap-2 items-center">
      <input
        className="border rounded-full px-3 py-1 text-sm flex-1 focus:ring-2 focus:ring-blue-200"
        type="text"
        placeholder="Add a comment"
        value={comment}
        onChange={e => setComment(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter") onAddComment(); }}
      />
      <button
        className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold hover:bg-blue-700"
        onClick={onAddComment}
      >
        Post
      </button>
    </div>
  );
}

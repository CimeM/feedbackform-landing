function feedbackPlugin() {
  // Create a container div for the plugin to isolate it
  const container = document.createElement("div");
  container.id = "customer-feedback-plugin-container";
  container.style.position = "fixed";
  container.style.bottom = "10px";
  container.style.left = "10px";
  container.style.zIndex = "1000";
  container.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
  
  // Insert plugin HTML inside container (no direct body.innerHTML manipulation)
  container.innerHTML = `
    <style>
      /* Scoped styles */
      #customer-feedback-button button {
        background-color: #007BFF;
        color: white;
        border: none;
        padding: 15px;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        cursor: pointer;
        box-shadow: rgba(0,0,0,0.3) 0px 4px 6px;
      }
      #customer-feedback-button button:hover {
        background-color: #0056b3;
      }
      #feedback-modal {
        width: 300px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        background-color: white;
        border: 1px solid #ccc;
        padding: 20px;
        border-radius: 10px;
        position: fixed;
        bottom: 70px;
        left: 10px;
        z-index: 1001;
        display: none;
      }
      #feedback-modal h2 {
        margin: 0;
      }
      #feedback-modal button {
        background-color: #28A745;
        color: white;
        border: none;
        padding: 5px 10px;
        margin: 5px 0;
        border-radius: 5px;
        cursor: pointer;
      }
      #close-feedback {
        background-color: transparent;
        color: gray;
        border: none;
        font-size: 18px;
        cursor: pointer;
      }
      #feedback-modal .feedback-type-button {
        width: 100%;
        padding-top: 8px;
        padding-bottom: 8px;
        margin-bottom: 5px;
        cursor: pointer;
      }
      #confirmation-div {
        width: 100%;
        text-align: center;
        color: green;
        font-weight: bold;
        display: none;
      }
      textarea {
        width: 100%;
        margin-top: 10px;
        resize: vertical;
      }
    </style>

    <div id="customer-feedback-button">
      <button id="open-feedback" aria-label="Open feedback form">&#128172;</button>
    </div>

    <div id="feedback-modal" role="dialog" aria-modal="true" aria-labelledby="feedback-form-title">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h2 id="feedback-form-title">Feedback Form</h2>
        <button id="close-feedback" aria-label="Close feedback form">&times;</button>
      </div>
      <div>
        <button id="bug-button" class="feedback-type-button">Bug</button>
        <button id="feedback-button" class="feedback-type-button">Feedback</button>
        <button id="other-button" class="feedback-type-button">Other</button>
      </div>
      <div id="textarea-container" style="display: none; margin-top: 5px;">
        <p>Please type your feedback.</p>
        <textarea id="feedback-text" rows="5" placeholder="Type your feedback here..."></textarea>
      </div>
      <button id="send-feedback" style="margin-top: 10px; display:none;">Send</button>
      <div id="confirmation-div">Your request has been sent!</div>
    </div>
  `;

  // Append container to body once
  document.body.appendChild(container);

  // Cache elements inside container (scoped queries)
  const feedbackButton = container.querySelector("#customer-feedback-button");
  const feedbackModal = container.querySelector("#feedback-modal");
  const openButton = container.querySelector("#open-feedback");
  const closeButton = container.querySelector("#close-feedback");
  const textareaContainer = container.querySelector("#textarea-container");
  const feedbackText = container.querySelector("#feedback-text");
  const sendButton = container.querySelector("#send-feedback");
  const confirmationDiv = container.querySelector("#confirmation-div");
  const bugButton = container.querySelector("#bug-button");
  const feedbackTypeButton = container.querySelector("#feedback-button");
  const otherButton = container.querySelector("#other-button");
  const formTitle = container.querySelector("#feedback-form-title");

  // Helper to toggle modal visibility
  function toggleModal(show) {
    if (show) {
      feedbackModal.style.display = "block";
      confirmationDiv.style.display = "none";
      textareaContainer.style.display = "none";
      sendButton.style.display = "none";
      bugButton.style.display = "block";
      feedbackTypeButton.style.display = "block";
      otherButton.style.display = "block";
      feedbackText.value = "";
      formTitle.textContent = "Feedback Form";
    } else {
      feedbackModal.style.display = "none";
    }
  }

  // Open modal
  openButton.addEventListener("click", () => {
    toggleModal(true);
  });

  // Close modal
  closeButton.addEventListener("click", () => {
    toggleModal(false);
  });

  // Close modal on Escape key only when modal is open
  function onKeyDown(event) {
    if (event.key === "Escape" && feedbackModal.style.display === "block") {
      toggleModal(false);
    }
  }
  container.addEventListener("keydown", onKeyDown);

  // Clicking outside modal closes it (only inside plugin container)
  container.addEventListener("click", (event) => {
    if (event.target === feedbackModal) {
      toggleModal(false);
    }
  });

  // Feedback type buttons show textarea and send button
  function showTextarea(type) {
    textareaContainer.style.display = "block";
    sendButton.style.display = "inline-block";
    bugButton.style.display = "none";
    feedbackTypeButton.style.display = "none";
    otherButton.style.display = "none";
    formTitle.textContent = `Feedback Form - ${type}`;
    feedbackText.focus();
  }

  var feedbackType="";
  bugButton.addEventListener("click", () => {showTextarea("Bug"); feedbackType="Bug"});
  feedbackTypeButton.addEventListener("click", () => {showTextarea("Feedback"); feedbackType="Feedback"});
  otherButton.addEventListener("click", () => {showTextarea("Other"); feedbackType="Other"});

  // Send feedback handler
  sendButton.addEventListener("click", async () => {
    const feedback = feedbackText.value.trim();
    if (!feedback) {
      alert("Please enter your feedback before sending.");
      return;
    }
    // Disable send button to prevent multiple clicks
    sendButton.disabled = true;

    const success = await sendFeedback(feedback);
    sendButton.disabled = false;

    if (success) {
      formTitle.textContent = "Thank you!";
      confirmationDiv.style.display = "block";
      textareaContainer.style.display = "none";
      sendButton.style.display = "none";
      feedbackText.value = "";
    } else {
      formTitle.textContent = "Error sending feedback. Please try again.";
    }
  });

  // Send feedback function (same as your original)
  async function sendFeedback(text) {
    // const endpoint = "http://localhost:3001/api/feedback";
    const endpoint = "https://api.feedbackform.rivieraapps.com/api/feedback";
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, type: feedbackType }),
      });
      if (response.ok) {
        return true;
      } else {
        console.error("Error sending feedback:", response.statusText);
        return false;
      }
    } catch (error) {
      console.error("Network error:", error);
      return false;
    }
  }
}

// Initialize plugin once after DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", feedbackPlugin);
} else {
  feedbackPlugin();
}

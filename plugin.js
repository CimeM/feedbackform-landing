// JavaScript Functionality
window.onload = function () { 

    var feedbackFormHTML = `
    <style>
      /* Feedback Button */
      #customer-feedback-button button {
        background-color: #007BFF; /* Blue color */
        color: white;
        border: none;
        padding: 15px;
        border-radius: 50%; /* Makes it round */
        width: 50px;
        height: 50px;
        cursor: pointer;
        
        box-shadow: rgba(0,0,0,0.3) 0px 4px 6px; /* Adds shadow for a modern look */
        
      }
  
      #feedback-button button:hover {
          background-color: #0056b3; /* Slightly darker blue on hover */
          
      }
  
      /* Modal Window */
      #feedback-modal {
        width: 300px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      }
  
      #feedback-modal h2 {
        margin: 0;
      }
  
      #feedback-modal button {
        background-color: #28A745;
        color: white;
        border: none;
        padding: 5px 10px;
        margin: 5px;
        margin-right: 0px;
        margin-left: 0px;
        border-radius: 5px;
      }
  
      #close-feedback {
        color: #333;
      }
      
      #feedback-modal .feedback-type-button {
        width:100%;
        padding-top:8px;
        padding-bottom:8px;
      }
      #feedback-modal #send-feedback {
        padding-top:8px;
        padding-bottom:8px;
      }
  
      #confirmation-div {
        width: 100%;
      }
  
      #confirmation-div svg {
          display: block;
          margin: auto;
          fill: white; /* White color for the checkmark */
      }
    </style>
    
    <!-- Feedback Button -->
    <div id="customer-feedback-button" style="position: fixed; bottom: 10px; left: 10px; z-index: 1000;">
      <button id="open-feedback" style="display: flex; align-items: center; justify-content: center;">
        &#128172; <!-- Speech bubble emoji -->
      </button>
    </div>
  
    <!-- Modal Window -->
    <div id="feedback-modal" style="display: none; position: fixed; bottom: 50px; left: 10px; z-index: 1001; background-color: white; border: 1px solid #ccc; padding: 20px; border-radius: 10px;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h2 id="feedback-form-title" style="margin: 0;">Feedback Form</h2>
        <button id="close-feedback" style="background-color: transparent; color: gray; border: none; font-size: 18px; cursor: pointer;">&times;</button>
      </div>
      <div>
        <button id="bug-button" class="feedback-type-button" >Bug</button>
        <button id="feedback-button" class="feedback-type-button" >Feedback</button>
        <button id="other-button" class="feedback-type-button" >Other</button>
      </div>
      <div id="textarea-container" style="display: none; margin-top: 5px; width:100%">
        <p>Please type your feedback.</p>
        <textarea style="margin-top:10px; width:100%" id="feedback-text" rows="5" cols="30" placeholder="Type your feedback here..."></textarea>
      </div>
      <button id="send-feedback" style="margin-top: 10px;">Send</button>
      
      <!-- Confirmation Div -->
      <div id="confirmation-div" style="display: none; width: 100%;">
        <div style="display: flex; justify-content: center; align-items: center; height: 100%; margin-bottom:25px;">
          <span style="font-size: 100px; color: white;">✔️</span>
        </div>
        <p>Your request has been sent!</p>
      </div>
  
    </div>
    `;
  
  
    document.querySelector("body").innerHTML += feedbackFormHTML;
  
  
    // Open Feedback Modal
    const mainFeedbackButton = document.getElementById('customer-feedback-button');
    const feedbackModal = document.getElementById('feedback-modal');
    const textareaContainer = document.getElementById('textarea-container');
    const submitButton = document.getElementById('send-feedback');
  
    // close modal when pressing esc key
    document.onkeydown = function(evt) {
      evt = evt || window.event;
      if (evt.keyCode == 27 && feedbackModal.style.display === 'block') {
            toggleModal();
      }
    };
    // Close Feedback Modal by Clicking Outside
    window.addEventListener('click', (event) => {
      if (event.target === feedbackModal ) {
  
        if(feedbackModal.style.display === 'block'){
          console.log("click in feedback modal detected")
          toggleModal();
        }
      }
    });
  
    mainFeedbackButton.addEventListener('click', () => {
        // Show the modal in bottom-left corner
        feedbackModal.style.display = feedbackModal.style.display === 'none' ? 'block' : 'none';
        submitButton.style.display = 'none';
        textareaContainer.style.display = 'none';
        bugButton.style.display = 'block';
        feedbackButtonOption.style.display = 'block';
        otherButton.style.display = 'block';
    });
    
    // Close Feedback Modal
    const closeFeedbackButton = document.getElementById('close-feedback');
    closeFeedbackButton.addEventListener('click', () => {
      toggleModal();
    
  
    // Reset modal state (optional)
    textareaContainer.style.display = 'none';
  
    document.getElementById('feedback-text').value = '';
    });
  
    // Button Click Handlers
    const feedbackButtonOption = document.getElementById('feedback-button');
    const bugButton = document.getElementById('bug-button');
    const otherButton = document.getElementById('other-button');
    const title = document.getElementById('feedback-form-title');
    const feedbackText = document.getElementById('feedback-text');
    const confirmationDiv = document.getElementById('confirmation-div');
  
    bugButton.addEventListener('click', () => {
        textareaContainer.style.display = 'block';
        submitButton.style.display = 'block';
        bugButton.style.display = 'none';
        feedbackButtonOption.style.display = 'none';
        otherButton.style.display = 'none';
    });
  
    feedbackButtonOption.addEventListener('click', () => {
        textareaContainer.style.display = 'block';
        submitButton.style.display = 'block';
        bugButton.style.display = 'none';
        feedbackButtonOption.style.display = 'none';
        otherButton.style.display = 'none';
    });
  
    otherButton.addEventListener('click', () => {
        textareaContainer.style.display = 'block';
        submitButton.style.display = 'block';
        bugButton.style.display = 'none';
        feedbackButtonOption.style.display = 'none';
        otherButton.style.display = 'none';
    });
  
    // Function to Close the Modal
    function toggleModal() {
      feedbackModal.style.display = feedbackModal.style.display === 'none' ? 'block' : 'none';
      submitButton.style.display = 'none';
      textareaContainer.style.display = 'none';
      bugButton.style.display = 'block';
      feedbackButtonOption.style.display = 'block';
      otherButton.style.display = 'block';
      document.getElementById('feedback-text').value = ''; // Reset text area
      title.innerHTML = "Feedback Form";
      confirmationDiv.style.display = "none";
      feedbackText.value = '';
    }
  
    // Send Feedback
    // const sendFeedbackButton = document.getElementById('send-feedback');
    
    submitButton.addEventListener('click', async () => {
        const feedback = feedbackText.value;
        
        
        if (feedback.trim() === '') {
          alert('Please enter your feedback before sending.');
          return;
        }
        var success = await sendFeedback(feedback);
        if(success) {
          title.innerHTML = "Thank you!";
          confirmationDiv.style.display = "block"
          textareaContainer.style.display = 'none';
          submitButton.style.display = 'none';
          feedbackText.value = '';
        }else{
          title.innerHTML = "X.X Try again!";
        }
    });
  
    // Function to send text to an endpoint
    async function sendFeedback(text) {
      const endpoint = 'http://localhost:3001/api/feedback';
  
      try {
        // Prepare the JSON payload
        const payload = {
          message: text, // Key-value pair for the feedback text
        };
  
        // Send a POST request to the endpoint
        const response = await fetch(endpoint, {
          method: 'POST', // HTTP method
          headers: {
            'Content-Type': 'application/json', // Specify JSON format
          },
          body: JSON.stringify(payload), // Convert the payload to a JSON string
        });
  
        // Handle the response
        if (response.ok) {
          const responseData = await response.json(); // Parse the response as JSON
          console.log('Feedback sent successfully:', responseData);
          return true;
        } else {
          console.error('Error sending feedback:', response.statusText);
          return false
        }
      } catch (error) {
        console.error('Network error:', error);
        // alert('Network error occurred. Please check your connection.');
      }
    }
    // Example usage:
    // Call this function with the feedback text you want to send
    // sendFeedback("test")
  
  }
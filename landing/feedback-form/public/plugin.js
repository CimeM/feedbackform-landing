/** ============================================================================
 * RIVIERA AI CHAT WIDGET - GLOBAL CONFIGURATION
 * ============================================================================ */
window.RIVIERA_CHAT_CONFIG = window.RIVIERA_CHAT_CONFIG || {
  api: {
    geminiApiKey: "__GEMINI_KEY_PLACEHOLDER__",
    preferredModel: "gemini-3.6-flash"
  },
  branding: {
    botName: "Leo",
    headerTitle: "Riviera Rides Concierge",
    avatarIcon: "🚲",
    triggerIcon: "💬",
    primaryColor: "#0056b3",
    headerTextColor: "#ffffff",
    userBubbleBg: "#0056b3",
    userTextColor: "#ffffff",
    botBubbleBg: "#ffffff",
    botTextColor: "#333333",
    position: "bottom-left",
    offsetX: "15px",
    offsetY: "15px"
  },
  behavior: {
    autoOpenDelayMs: 5000,
    showTeaserBadge: true,
    teaserDelayMs: 2000,
    teaserMessage: "👋 Planning a bike trip in Antibes?",
    welcomeMessage: "Bonjour! I'm Leo. Looking to explore Antibes by bike? Ask me about routes, rental options, or gear!"
  },
  quickReplies: [
    { label: "🚴 Cap d'Antibes Loop", prompt: "What is the best route for Cap d'Antibes?" },
    { label: "⚡ E-Bike Pricing", prompt: "How much does it cost to rent an E-Bike?" },
    { label: "👨‍👩‍👧‍👦 Family Routes", prompt: "Can we cycle to Nice safely with young kids?" }
  ],
  systemPrompt: `
You are "Leo", the virtual concierge for Riviera Rides in Antibes, France.
Your goal is to answer questions, recommend bikes based on routes, and guide users to book.
If not instructed otherwise, apways make concise answers in 2-3 sentences.

FLEET & PRICING:
- Classic City Bike: €18/day (flat coastal paths, Old Town)
- E-Bike: €40/day (Cap d'Antibes loop, 60km range)
- Carbon Road Bike: €65/day (steep climbs like Esterel)
- Kids Bikes: €15/day
Included free with all rentals: Helmet, heavy-duty lock, and local map.

CONVERSION RULES:
- Do NOT offer live availability checks.
- Always recommend the appropriate bike for the user's route.
- Direct users to view and reserve bikes at: https://rivierarides.com/fleet
`
};

/** ============================================================================
 * PLUGIN ENGINE WITH INTEGRATED MARKDOWN PARSER & SCOPED CSS
 * ============================================================================ */
(function initChatPlugin(config) {
  if (document.getElementById("riviera-chat-plugin-container")) return;

  // 1. Dynamic CDN Script Loader
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      if (window.marked || document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed loading script"));
      document.head.appendChild(script);
    });
  }

  // Pre-fetch marked library from CDN
  loadScript("https://cdn.jsdelivr.net/npm/marked/marked.min.js");

  let chatHistory = [];
  let cachedModelName = null;
  let autoOpenTimer = null;

  const isLeft = config.branding.position === "bottom-left";
  const posXStyle = isLeft ? `left: ${config.branding.offsetX};` : `right: ${config.branding.offsetX};`;

  // 2. DOM Container & Scoped CSS Rules
  const container = document.createElement("div");
  container.id = "riviera-chat-plugin-container";
  container.style.position = "fixed";
  container.style.bottom = config.branding.offsetY;
  container.style.zIndex = "9999";
  container.setAttribute("style", `${container.style.cssText} ${posXStyle}`);

  container.innerHTML = `
    <style>
      #riviera-chat-plugin-container * { box-sizing: border-box; }
      
      #chat-trigger-btn {
        background-color: ${config.branding.primaryColor};
        color: white;
        border: none;
        border-radius: 50%;
        width: 56px;
        height: 56px;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0,0,0,0.25);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        transition: transform 0.2s;
        position: relative;
      }
      #chat-trigger-btn:hover { transform: scale(1.05); }

      #chat-teaser-badge {
        position: absolute;
        bottom: 65px;
        ${isLeft ? "left: 0;" : "right: 0;"}
        background: white;
        color: #333;
        padding: 8px 12px;
        border-radius: 12px;
        font-size: 13px;
        box-shadow: 0 4px 14px rgba(0,0,0,0.15);
        white-space: nowrap;
        cursor: pointer;
        display: none;
        border: 1px solid #e2e8f0;
        animation: fadeIn 0.3s ease-in-out;
      }

      #chat-modal-window {
        width: 360px;
        height: 520px;
        background-color: #ffffff;
        border: 1px solid #e0e0e0;
        border-radius: 12px;
        position: fixed;
        bottom: calc(${config.branding.offsetY} + 65px);
        ${posXStyle}
        z-index: 10000;
        display: none;
        flex-direction: column;
        overflow: hidden;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      }

      @media (max-width: 480px) {
        #chat-modal-window {
          width: 100% !important;
          height: 100% !important;
          bottom: 0 !important;
          left: 0 !important;
          right: 0 !important;
          border-radius: 0 !important;
        }
      }

      .chat-header {
        background-color: ${config.branding.primaryColor};
        color: ${config.branding.headerTextColor};
        padding: 12px 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .chat-header h3 { margin: 0; font-size: 16px; font-weight: 600; }
      .chat-header button { background: none; color: white; border: none; font-size: 20px; cursor: pointer; }

      #chat-messages-list {
        flex: 1;
        padding: 12px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 10px;
        background-color: #f9f9fb;
      }

      .msg { max-width: 88%; padding: 10px 14px; border-radius: 14px; font-size: 14px; line-height: 1.45; word-break: break-word; }
      .msg.bot { background-color: ${config.branding.botBubbleBg}; color: ${config.branding.botTextColor}; align-self: flex-start; border: 1px solid #e2e8f0; border-bottom-left-radius: 2px; }
      .msg.user { background-color: ${config.branding.userBubbleBg}; color: ${config.branding.userTextColor}; align-self: flex-end; border-bottom-right-radius: 2px; }

      /* HIGH-SPECIFICITY MARKDOWN STYLES INSIDE BOT MESSAGES */
      #chat-messages-list .msg.bot p { margin: 0 0 8px 0; }
      #chat-messages-list .msg.bot p:last-child { margin-bottom: 0; }
      #chat-messages-list .msg.bot h3, 
      #chat-messages-list .msg.bot h4 { 
        margin: 10px 0 6px 0; 
        font-size: 14px; 
        font-weight: 700; 
        color: #1a202c; 
        display: block;
      }
      #chat-messages-list .msg.bot ol, 
      #chat-messages-list .msg.bot ul { 
        margin: 6px 0 8px 0 !important; 
        padding-left: 20px !important; 
        list-style-position: outside !important;
      }
      #chat-messages-list .msg.bot ol { list-style-type: decimal !important; }
      #chat-messages-list .msg.bot ul { list-style-type: disc !important; }
      #chat-messages-list .msg.bot li { margin-bottom: 4px; display: list-item !important; }
      #chat-messages-list .msg.bot strong { font-weight: 700; color: #000000; }
      #chat-messages-list .msg.bot em { font-style: italic; }
      #chat-messages-list .msg.bot a { color: ${config.branding.primaryColor}; font-weight: 700; text-decoration: underline; }

      .chips-container { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px; }
      .chip-btn {
        background: #ffffff;
        border: 1px solid ${config.branding.primaryColor};
        color: ${config.branding.primaryColor};
        border-radius: 16px;
        padding: 6px 12px;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.2s;
      }
      .chip-btn:hover { background: ${config.branding.primaryColor}; color: white; }

      .chat-footer { padding: 10px; background: #fff; border-top: 1px solid #e0e0e0; display: flex; gap: 8px; }
      .chat-footer input { flex: 1; padding: 10px 12px; border: 1px solid #ccc; border-radius: 20px; outline: none; font-size: 14px; }
      .chat-footer button { background-color: ${config.branding.primaryColor}; color: white; border: none; padding: 0 16px; border-radius: 20px; font-weight: 600; cursor: pointer; }
      .chat-footer button:disabled { background-color: #cccccc; cursor: not-allowed; }

      @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
    </style>

    <div id="chat-teaser-badge">${config.behavior.teaserMessage}</div>
    <button id="chat-trigger-btn" aria-label="Open Chat">${config.branding.triggerIcon}</button>

    <div id="chat-modal-window" role="dialog">
      <div class="chat-header">
        <h3>${config.branding.avatarIcon} ${config.branding.headerTitle}</h3>
        <button id="close-chat-btn">&times;</button>
      </div>

      <div id="chat-messages-list">
        <div class="msg bot">${config.behavior.welcomeMessage}</div>
        <div class="chips-container" id="quick-chips-box"></div>
      </div>

      <div class="chat-footer">
        <input id="chat-input-field" type="text" placeholder="Type your message..." />
        <button id="send-msg-btn">Send</button>
      </div>
    </div>
  `;

  document.body.appendChild(container);

  // Cache Elements
  const modal = container.querySelector("#chat-modal-window");
  const triggerBtn = container.querySelector("#chat-trigger-btn");
  const closeBtn = container.querySelector("#close-chat-btn");
  const sendBtn = container.querySelector("#send-msg-btn");
  const inputField = container.querySelector("#chat-input-field");
  const messagesList = container.querySelector("#chat-messages-list");
  const teaserBadge = container.querySelector("#chat-teaser-badge");
  const chipsBox = container.querySelector("#quick-chips-box");

  // Quick Chips
  if (config.quickReplies && config.quickReplies.length > 0) {
    config.quickReplies.forEach((chip) => {
      const btn = document.createElement("button");
      btn.className = "chip-btn";
      btn.textContent = chip.label;
      btn.onclick = () => {
        handleSendMessage(chip.prompt);
        chipsBox.style.display = "none";
      };
      chipsBox.appendChild(btn);
    });
  }

  // Handlers
  function toggleModal(show) {
    modal.style.display = show ? "flex" : "none";
    teaserBadge.style.display = "none";
    if (show) {
      inputField.focus();
      if (autoOpenTimer) clearTimeout(autoOpenTimer);
    }
  }

  triggerBtn.addEventListener("click", () => toggleModal(modal.style.display !== "flex"));
  closeBtn.addEventListener("click", () => toggleModal(false));
  teaserBadge.addEventListener("click", () => toggleModal(true));

  if (config.behavior.showTeaserBadge) {
    setTimeout(() => {
      if (modal.style.display !== "flex") teaserBadge.style.display = "block";
    }, config.behavior.teaserDelayMs);
  }

  if (config.behavior.autoOpenDelayMs > 0) {
    autoOpenTimer = setTimeout(() => {
      if (modal.style.display !== "flex") toggleModal(true);
    }, config.behavior.autoOpenDelayMs);
  }

  // 3. Fallback Synchronous Markdown Parsing Utility
  function parseMarkdown(rawText) {
    if (window.marked && typeof window.marked.parse === "function") {
      let parsedHTML = window.marked.parse(rawText);
      return parsedHTML.replace(/<a /g, '<a target="_blank" rel="noopener" ');
    }

    // Instant internal regex parse fallback if marked hasn't loaded
    let html = rawText
      .replace(/^### (.*$)/gim, "<h3>$1</h3>")
      .replace(/^## (.*$)/gim, "<h4>$1</h4>")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/^\d+\.\s+(.*$)/gim, "<li>$1</li>")
      .replace(/^\*\s+(.*$)/gim, "<li>$1</li>")
      .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>')
      .replace(/\n\n/g, "<br><br>");

    if (html.includes("<li>")) {
      html = html.replace(/(<li>.*<\/li>)/gs, "<ol>$1</ol>");
    }

    return html;
  }

  function appendMsg(sender, text) {
    const msgDiv = document.createElement("div");
    msgDiv.className = `msg ${sender}`;

    if (sender === "bot") {
      msgDiv.innerHTML = parseMarkdown(text);
    } else {
      const formattedText = text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
      msgDiv.innerHTML = formattedText;
    }

    messagesList.appendChild(msgDiv);
    messagesList.scrollTop = messagesList.scrollHeight;
    return msgDiv;
  }

  async function callGeminiApi(userText) {
    try {
      if (!config.api.geminiApiKey || config.api.geminiApiKey.includes("YOUR_ACTUAL")) {
        return "Configuration Error: Please specify a valid Gemini API Key.";
      }

      if (!cachedModelName) {
        try {
          const modelsRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${config.api.geminiApiKey}`);
          const modelsData = await modelsRes.json();
          const available = (modelsData.models || []).filter((m) => m.supportedGenerationMethods?.includes("generateContent"));
          const match = available.find((m) => m.name.includes(config.api.preferredModel)) || available.find((m) => m.name.includes("flash")) || available[0];
          cachedModelName = match ? match.name.replace(/^models\//, "") : "gemini-3.6-flash";
        } catch (e) {
          cachedModelName = "gemini-3.6-flash";
        }
      }

      chatHistory.push({ role: "user", parts: [{ text: userText }] });

      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${cachedModelName}:generateContent?key=${config.api.geminiApiKey}`;
      const payload = {
        systemInstruction: { parts: [{ text: config.systemPrompt }] },
        contents: chatHistory
      };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error.message);

      const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I apologize, but I couldn't process that.";
      chatHistory.push({ role: "model", parts: [{ text: botReply }] });
      return botReply;

    } catch (err) {
      console.error("Chat API Error:", err);
      return "Sorry, I am having technical difficulties right now. Please try again later.";
    }
  }

  async function handleSendMessage(textOverride = null) {
    const text = textOverride || inputField.value.trim();
    if (!text) return;

    appendMsg("user", text);
    if (!textOverride) inputField.value = "";
    sendBtn.disabled = true;

    const loadingIndicator = appendMsg("bot", "Thinking...");
    const botReply = await callGeminiApi(text);

    loadingIndicator.innerHTML = parseMarkdown(botReply);
    sendBtn.disabled = false;
  }

  sendBtn.addEventListener("click", () => handleSendMessage());
  inputField.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleSendMessage();
  });

})(window.RIVIERA_CHAT_CONFIG);
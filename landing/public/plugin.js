/** ============================================================================
 * RIVIERA AI CHAT WIDGET - GLOBAL CONFIGURATION
 * ============================================================================ */
window.RIVIERA_CHAT_CONFIG = window.RIVIERA_CHAT_CONFIG || {
  api: {
    geminiApiKey: "__GEMINI_KEY_PLACEHOLDER__",
    preferredModel: "gemini-3.6-flash"
  },
  branding: {
    botName: "Lérins AI",
    headerTitle: "Lérins AI — WordPress Assistant",
    avatarIcon: "⚡",
    triggerIcon: "💬",
    primaryColor: "#647b8c",
    headerTextColor: "#ffffff",
    userBubbleBg: "#647b8c",
    userTextColor: "#ffffff",
    botBubbleBg: "#fffdf8",
    botTextColor: "#4f4a43",
    position: "bottom-right",
    offsetX: "20px",
    offsetY: "20px"
  },
  behavior: {
    persistSession: true,
    sessionStorageKey: "lerins-ai-chat-session",
    autoOpenDelayMs: 100000,
    showTeaserBadge: true,
    teaserDelayMs: 1500,
    teaserMessage: "⚡ Tired of answering manual WordPress tickets?",
    welcomeMessage: "Bonjour! I'm Lérins AI. I can handle up to 70% of your incoming customer support on autopilot. Ask me how I integrate with your WordPress site!"
  },
  quickReplies: [
    { label: "⚡ How does it connect?", prompt: "How do I install Lérins AI on my WordPress site?" },
    { label: "🛒 WooCommerce support?", prompt: "Does this work with WooCommerce order tracking?" },
    { label: "💰 Pricing & Plans", prompt: "How much does the Lérins AI plugin cost?" }
  ],
  systemPrompt: `
You are "Lérins AI", an intelligent sales concierge and support assistant for the Lérins AI WordPress Plugin.
Your primary objective is to convince WordPress site owners, WooCommerce store managers, and agencies to install Lérins AI on their site.
Unless explicitly asked for detailed technical instructions, keep answers concise, persuasive, and limited to 2-3 sentences.

CORE VALUE PROPOSITION:
- Automates up to 70% of routine customer support tickets and contact form inquiries.
- Connects to any WordPress or WooCommerce site in 60 seconds (no coding required).
- Learns products, policies, and FAQs directly from the user's site pages.
- Reduces support workload, speeds up response times to 0 seconds, and drives conversions.

PRICING & PLANS:
- Free Tier: €0/month (Up to 100 automated messages/mo, basic AI training).
- Pro Tier: €29/month (Unlimited messages, WooCommerce order lookup, priority AI processing).
- Agency Tier: €79/month (Multi-site license up to 10 WordPress domains, custom branding).

KNOWLEDGE BASE & FAQ CASES:

[Q: How do I install it on WordPress?]
-> Install our 1-click WordPress plugin or paste our 1-line lightweight JavaScript snippet into your theme header. It takes less than 60 seconds to connect without touching code.

[Q: How does it learn my store or business info?]
-> Lérins AI automatically scans your WordPress pages, blog posts, and WooCommerce product catalog to train its Gemini AI engine on your exact business policies and inventory.

[Q: Does it slow down my WordPress site?]
-> Not at all. Lérins AI loads asynchronously off an external CDN, keeping your PageSpeed insights score completely unaffected.

[Q: Can it handle WooCommerce orders?]
-> Yes! In our Pro and Agency plans, Lérins AI connects directly to WooCommerce to answer order status questions, shipping updates, and product availability 24/7.

CONVERSION & CALL TO ACTION:
- Always encourage users to start with the free tier or test the live demo.
- Direct users to view plans and get started at: https://lerins.rivieraapps.com/get-started
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

  let chatHistory = loadChatHistory();
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
        box-shadow: 0 5px 16px rgba(92, 75, 57, 0.2);
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
        background: #fffaf2;
        color: #514b45;
        padding: 8px 12px;
        border-radius: 18px;
        font-size: 13px;
        box-shadow: 0 4px 14px rgba(0,0,0,0.15);
        white-space: nowrap;
        cursor: pointer;
        display: none;
        border: 1px solid #ded5c7;
        animation: fadeIn 0.3s ease-in-out;
      }

      #chat-modal-window {
        width: 360px;
        height: 520px;
        background-color: #fffaf2;
        border: 1px solid #ded5c7;
        border-radius: 24px;
        position: fixed;
        bottom: calc(${config.branding.offsetY} + 65px);
        ${posXStyle}
        z-index: 10000;
        display: none;
        flex-direction: column;
        overflow: hidden;
        box-shadow: 0 12px 32px rgba(92, 75, 57, 0.2);
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
        background-color: #f6f1e8;
      }

      .msg { max-width: 88%; padding: 10px 14px; border-radius: 14px; font-size: 14px; line-height: 1.45; word-break: break-word; }
      .chat-message-in { animation: chatMessageIn 560ms cubic-bezier(0.22, 1.2, 0.36, 1) both; }
      .msg.bot { background-color: ${config.branding.botBubbleBg}; color: ${config.branding.botTextColor}; align-self: flex-start; border: 1px solid #e6ddcf; border-bottom-left-radius: 8px; }
      .msg.user { background-color: ${config.branding.userBubbleBg}; color: ${config.branding.userTextColor}; align-self: flex-end; border-bottom-right-radius: 8px; }

      /* HIGH-SPECIFICITY MARKDOWN STYLES INSIDE BOT MESSAGES */
      #chat-messages-list .msg.bot p { margin: 0 0 8px 0; }
      #chat-messages-list .msg.bot p:last-child { margin-bottom: 0; }
      #chat-messages-list .msg.bot h3, 
      #chat-messages-list .msg.bot h4 { 
        margin: 10px 0 6px 0; 
        font-size: 14px; 
        font-weight: 700; 
        color: #514b45; 
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
      #chat-messages-list .msg.bot strong { font-weight: 700; color: #3f3a35; }
      #chat-messages-list .msg.bot em { font-style: italic; }
      #chat-messages-list .msg.bot a { color: ${config.branding.primaryColor}; font-weight: 700; text-decoration: underline; }

      .chips-container { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px; }
      .chip-btn {
        background: #fffaf2;
        border: 1px solid ${config.branding.primaryColor};
        color: ${config.branding.primaryColor};
        border-radius: 16px;
        padding: 6px 12px;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.2s;
      }
      .chip-btn:hover { background: ${config.branding.primaryColor}; color: white; }

      .chat-footer { padding: 12px; background: #fffaf2; border-top: 1px solid #ded5c7; display: flex; gap: 8px; }
      .chat-footer input { flex: 1; padding: 10px 12px; background: #fffdf8; border: 1px solid #d8cfc2; border-radius: 22px; outline: none; font-size: 14px; color: #4f4a43; }
      .chat-footer button { background-color: ${config.branding.primaryColor}; color: white; border: none; padding: 0 16px; border-radius: 22px; font-weight: 600; cursor: pointer; }
      .chat-footer button:disabled { background-color: #c8c0b5; cursor: not-allowed; }

      @keyframes chatMessageIn {
        0% { opacity: 0; transform: translate3d(0, 24px, 0); }
        70% { opacity: 1; transform: translate3d(0, -3px, 0); }
        100% { opacity: 1; transform: translate3d(0, 0, 0); }
      }
      @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
      @media (prefers-reduced-motion: reduce) { .chat-message-in { animation: none; } }
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
    msgDiv.className = `msg ${sender} chat-message-in`;

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

  function loadChatHistory() {
    if (!config.behavior.persistSession) return [];

    try {
      const savedHistory = sessionStorage.getItem(config.behavior.sessionStorageKey);
      const parsedHistory = savedHistory ? JSON.parse(savedHistory) : [];
      return Array.isArray(parsedHistory) ? parsedHistory : [];
    } catch (error) {
      console.warn("Unable to restore chat session:", error);
      return [];
    }
  }

  function saveChatHistory() {
    if (!config.behavior.persistSession) return;

    try {
      sessionStorage.setItem(
        config.behavior.sessionStorageKey,
        JSON.stringify(chatHistory)
      );
    } catch (error) {
      console.warn("Unable to save chat session:", error);
    }
  }

  function restoreChatMessages() {
    chatHistory.forEach((message) => {
      const text = message?.parts?.[0]?.text;
      if (!text) return;

      appendMsg(message.role === "model" ? "bot" : "user", text);
    });
  }

  restoreChatMessages();

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
      saveChatHistory();

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
      saveChatHistory();
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
    loadingIndicator.classList.remove("chat-message-in");
    void loadingIndicator.offsetWidth;
    loadingIndicator.classList.add("chat-message-in");
    sendBtn.disabled = false;
  }

  sendBtn.addEventListener("click", () => handleSendMessage());
  inputField.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleSendMessage();
  });

})(window.RIVIERA_CHAT_CONFIG);
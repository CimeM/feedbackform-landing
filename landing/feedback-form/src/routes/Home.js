import React from "react";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 text-gray-800">

      {/* Hero Section */}
      <header className="px-4 pt-20 pb-16 mx-auto max-w-7xl sm:px-6 lg:px-8 text-center">
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-2">
            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Powered by Gemini AI Engine
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl leading-tight">
            Turn Casual Browsers Into Buyers With Real-Time 
            <span className="block text-blue-600 mt-1">AI Conversation</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-600 leading-relaxed">
            Replace static feedback forms with an intelligent AI Concierge. Answer customer queries instantly, guide purchase decisions, and capture high-intent leads 24/7 with 1 line of code.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <button
              className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 transition-all transform hover:-translate-y-0.5"
              onClick={() => {
                const integrationSection = document.getElementById('integration');
                integrationSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Embed Widget Free
              <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
            <a 
              href="#/dashboard" 
              className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-all"
            >
              Explore Dashboard
            </a>
          </div>
        </div>
      </header>

      {/* Stats Proof Bar */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-4">
              <p className="text-4xl font-extrabold text-blue-600">+30%</p>
              <p className="mt-2 text-sm font-semibold text-gray-700">Average Conversion Lift</p>
              <p className="text-xs text-gray-500 mt-1">Conversational AI guides intent-driven buyers in real-time.</p>
            </div>
            <div className="p-4 border-t md:border-t-0 md:border-l border-gray-200">
              <p className="text-4xl font-extrabold text-blue-600">21x</p>
              <p className="mt-2 text-sm font-semibold text-gray-700">Faster Lead Qualification</p>
              <p className="text-xs text-gray-500 mt-1">Responding within 5 minutes yields 21x higher qualification rates (HBR).</p>
            </div>
            <div className="p-4 border-t md:border-t-0 md:border-l border-gray-200">
              <p className="text-4xl font-extrabold text-blue-600">80%</p>
              <p className="mt-2 text-sm font-semibold text-gray-700">Automated Support Resolution</p>
              <p className="text-xs text-gray-500 mt-1">Instantly resolves common objections and questions (IBM Research).</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Conversational Feedback Beats Static Forms */}
      <section className="py-16 bg-blue-50/50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Static Forms Fail (And AI Chat Converts)</h2>
          <blockquote className="text-lg text-gray-700 italic mb-6 bg-white p-6 rounded-xl shadow-sm border border-blue-100">
            “Traditional feedback forms sit idle while prospective customers leave with unanswered questions. Conversational AI transforms passive visitors into active conversations, resolving doubts right at the moment of decision.”
          </blockquote>
          <p className="text-gray-600 leading-relaxed">
            By engaging users through dynamic, contextual dialog rather than rigid form fields, you turn basic customer feedback into interactive sales opportunities and qualified leads.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Engineered For Higher Conversions</h2>
            <p className="mt-4 text-gray-600">Everything you need to automate customer support, collect feedback, and increase sales revenue.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6 text-blue-600 font-bold text-xl">
                💬
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Instant AI Concierge</h3>
              <p className="text-gray-600 leading-relaxed">
                Answers product queries, recommends items, and overcomes buying objections on autopilot using custom system prompts.
              </p>
            </div>

            <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6 text-blue-600 font-bold text-xl">
                🎯
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Smart Action Chips</h3>
              <p className="text-gray-600 leading-relaxed">
                Guide visitors with pre-configured prompt chips ("Pricing", "Routes", "Best Sellers") that drive immediate interaction.
              </p>
            </div>

            <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6 text-blue-600 font-bold text-xl">
                📊
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Real-Time Insights</h3>
              <p className="text-gray-600 leading-relaxed">
                Monitor transcript logs, analyze recurring user questions, and refine your marketing message from a central dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>



      {/* Integration Section */}
      <section id="integration" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">1-Minute Integration</h2>
            <p className="mt-3 text-lg text-gray-600">Add our lightweight AI widget before the closing <code className="bg-gray-100 px-2 py-1 rounded text-sm text-blue-600">&lt;/body&gt;</code> tag on any website.</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-6 max-w-3xl mx-auto shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-800">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="text-xs text-gray-400 font-mono">plugin-embed.html</span>
            </div>
            <pre className="text-sm text-blue-400 font-mono overflow-x-auto">
              <code>{`<script src="https://feedbackform.rivieraapps.com/plugin.js" async></script>`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 bg-blue-50/50">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 text-lg mb-1">How does the AI assistant improve conversion rates?</h3>
              <p className="text-gray-600 text-sm leading-relaxed">By providing immediate answers to buying questions, suggesting relevant products, and assisting users in real-time, the widget eliminates friction and hesitation before buyers exit your page.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 text-lg mb-1">Can I customize the system prompt and styling?</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Yes. You can customize colors, prompt chips, avatar icons, and the underlying AI system prompt to match your business tone and products.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 text-lg mb-1">Is it difficult to set up on React, WordPress, or Shopify?</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Not at all. You can paste the single script tag into your HTML, or call it inside a React <code className="bg-gray-100 px-1 py-0.5 rounded text-xs text-blue-600">useEffect</code> hook in under two minutes.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
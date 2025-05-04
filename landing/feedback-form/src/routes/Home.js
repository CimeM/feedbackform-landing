const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">

      {/* Hero Section */}
      <header className="px-4 py-24 mx-auto max-w-7xl sm:px-6 lg:px-8 text-center">
        <div className="space-y-4">
          <div className="inline-block p-2 bg-blue-50 rounded-lg mb-4">
            {/* Star Icon */}
            <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            Capture Customer Feedback
            <span className="block text-blue-600">That Actually Matters</span>
          </h1>
          <p className="max-w-xl mx-auto text-xl text-gray-500">
            Collect and analyze customer feedback seamlessly with our lightweight JavaScript plugin.
          </p>
          <div className="mt-8 space-x-4">
            <button
              className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
              onClick={() => {
                const faqSection = document.getElementById('integration');
                faqSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Get Started Free
              <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
            <a href="#/dashboard" className="button inline-flex items-center px-6 py-3 text-base font-medium text-gray-700 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200">
              Open Dashboard
            </a>
          </div>
        </div>
      </header>

      {/* Social Proof Section */}
      <section className="py-8 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Industry leaders and startups leverage feedback from customers
          </h2>
          <div className="flex flex-wrap justify-center gap-10">
            {/* Axios */}
            <span className="flex flex-col items-center">
              <img
                src="/images/axios.svg"
                alt="Axios Logo"
                className="mb-2 h-8 w-20 object-contain dark:invert"
              />
              <span className="text-gray-800 text-sm font-bold">Axios</span>
              <span className="text-xs text-gray-400">News Media</span>
            </span>
            {/* Mercury */}
            <span className="flex flex-col items-center">
              <img
                src="/images/mercury.svg"
                alt="Mercury Logo"
                className="mb-2 h-8 w-20 object-contain dark:invert"
              />
              <span className="text-gray-800 text-sm font-bold">Mercury</span>
              <span className="text-xs text-gray-400">Mobility & Tech</span>
            </span>
            {/* Strapi */}
            <span className="flex flex-col items-center">
              <img
                src="/images/strapi.svg"
                alt="Strapi Logo"
                className="mb-2 h-8 w-20 object-contain dark:invert"
              />
              <span className="text-gray-800 text-sm font-bold">Strapi</span>
              <span className="text-xs text-gray-400">Open Source CMS</span>
            </span>
            {/* Typeform */}
            <span className="flex flex-col items-center">
              <img
                src="/images/typeform.svg"
                alt="Typeform Logo"
                className="mb-2 h-8 w-20 object-contain dark:invert"
              />
              <span className="text-gray-800 text-sm font-bold">Typeform</span>
              <span className="text-xs text-gray-400">Form Builder</span>
            </span>
          </div>
        </div>
      </section>


      {/* Why Feedback Matters Section */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4 text-blue-700">Why Customer Feedback Should Drive Development</h2>
          <blockquote className="text-lg text-gray-600 italic mb-4">
            “Learning what people really want is the single most valuable thing you can do for your product. But you can’t trust compliments or opinions-only real feedback about real problems.”<br />
            <span className="block mt-2 text-blue-600 font-medium">- The Mom Test, Rob Fitzpatrick</span>
          </blockquote>
          <p className="text-gray-700">
            Building products in isolation leads to wasted time and missed opportunities. By capturing actionable feedback, you ensure every new feature or improvement is grounded in real customer needs-not just assumptions.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="p-6 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                {/* Feedback Icon */}
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Discrete Feedback Collection</h3>
              <p className="text-gray-600">Non-intrusive feedback forms that respect your users' experience while maximizing response rates.</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                {/* Dashboard Icon */}
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Insightful Dashboard</h3>
              <p className="text-gray-600">Analyze feedback trends and customer sentiment with our powerful analytics dashboard.</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                {/* Bug Icon */}
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Bug Reporting</h3>
              <p className="text-gray-600">Capture technical issues and bug reports directly from your users with context.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Competitor Comparison Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">How We Compare</h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-100">
                <th className="p-3 font-semibold">Product</th>
                <th className="p-3 font-semibold">Key Features</th>
                <th className="p-3 font-semibold">Starting Price</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-3">Hotjar</td>
                <td className="p-3">Surveys, heatmaps, feedback widgets, session replays</td>
                <td className="p-3">$66/mo</td>
              </tr>
              <tr className="border-b">
                <td className="p-3">Appzi</td>
                <td className="p-3">In-app feedback, integrations, custom triggers</td>
                <td className="p-3">$29/mo</td>
              </tr>
              <tr className="border-b">
                <td className="p-3">Rapidr</td>
                <td className="p-3">Feedback lifecycle, feature tracking, changelog</td>
                <td className="p-3">$49/mo</td>
              </tr>
              <tr className="border-b">
                <td className="p-3">UseResponse</td>
                <td className="p-3">Feedback, support, roadmaps, live chat</td>
                <td className="p-3">$1490/mo</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-blue-700">Our Plugin</td>
                <td className="p-3">Lightweight, easy integration, actionable insights</td>
                <td className="p-3 font-bold text-blue-700">Free</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Integration Section */}
      <section id="integration" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Simple Integration</h2>
            <p className="mt-4 text-lg text-gray-600">Add our feedback widget to your site with just one line of code.</p>
          </div>
          <div className="bg-gray-900 rounded-lg p-6 max-w-2xl mx-auto overflow-y-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <svg className="w-6 h-6 text-gray-400 " fill="none" viewBox="0 0 24 24" stroke="currentColor" >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <code className="text-sm text-blue-400">
              &lt;script src="https://feedbackform.rivieraapps.com/plugin.js"&gt;&lt;/script&gt;
            </code>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 bg-blue-50">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-blue-700 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-800">Is it really free?</h3>
              <p className="text-gray-600">Yes, our core feedback plugin is free to use for now. We believe in making customer feedback accessible to all.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">How long does integration take?</h3>
              <p className="text-gray-600">You can add our widget to your site in under 2 minutes-just copy and paste a single line of code.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Can I export my feedback?</h3>
              <p className="text-gray-600">Absolutely. You can export all feedback data for further analysis at any time.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">How can I get started?</h3>
              <p className="text-gray-600">Include the plugin on yor page, open the dashboard and insert your domain in "host" field. Press "set". Your feedbacks will appear.</p>
            </div>
          </div>
        </div>
      </section>

   
    </div>
  );
};
export default Home;

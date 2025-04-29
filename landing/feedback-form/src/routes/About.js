const About = () => {
    return (
        <section className="max-w-2xl mx-auto my-12 px-4 py-8 bg-white rounded-xl shadow-lg">
            <h1 className="text-4xl font-bold mb-4 text-blue-700">About This Plugin</h1>
            <p className="text-lg text-gray-700 mb-6">
            <span className="font-semibold text-blue-600">CustomerFeedback</span> is a plugin developed to help businesses and creators easily collect valuable feedback from their customers. Our goal is to empower you to make data-driven improvements and deliver a better user experience.
            </p>
            <h2 className="text-2xl font-semibold mb-3 text-blue-600">Why is Feedback Important?</h2>
            <ul className="list-disc list-inside mb-6 text-gray-700">
            <li>
                <span className="font-medium">Continuous Improvement:</span> Feedback highlights what works and what needs attention, guiding your product’s evolution.
            </li>
            <li>
                <span className="font-medium">Customer Satisfaction:</span> Listening to your users shows you care, building trust and loyalty.
            </li>
            <li>
                <span className="font-medium">Innovation:</span> New ideas and perspectives often come directly from your customers.
            </li>
            </ul>
            <h2 className="text-2xl font-semibold mb-3 text-blue-600">Ongoing Project</h2>
            <p className="text-gray-700 mb-4">
            This plugin is an ongoing project, and we are committed to making it better with every update. Your feedback is at the heart of our development process.
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                <p className="text-blue-800 font-semibold">
                    We love hearing from you! If you have suggestions, questions, or ideas, please let us know. Together, we can create the best feedback tool for everyone.
                </p>
            </div>
        </section>
    );
};
  
export default About;
  
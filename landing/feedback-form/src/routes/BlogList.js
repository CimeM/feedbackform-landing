import { Link } from "react-router-dom";
import { posts } from "./blogpostIndex";

const BlogList = () => (
  <div className="max-w-3xl mx-auto py-10 px-4">
    <h1 className="text-4xl font-bold mb-8 text-center">All Blog Posts</h1>
    <ul className="space-y-6">
      {posts.map(post => (
        <li key={post.slug}>
          <Link
            to={`/blog/posts/${post.slug}`}
            className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition border border-gray-100 hover:border-blue-500"
          >
            <h2 className="text-2xl font-semibold text-blue-600 hover:underline">{post.title}</h2>
            {post.date && <p className="text-gray-400 text-sm mt-1">{post.date}</p>}
            {post.summary && <p className="text-gray-700 mt-2">{post.summary}</p>}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export default BlogList;
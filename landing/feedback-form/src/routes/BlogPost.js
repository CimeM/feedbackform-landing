import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { posts } from "./blogpostIndex";
import { useParams, Link } from "react-router-dom";

const BlogPost = () => {
    const { slug } = useParams();
    const post = posts.find(p => p.slug === slug);
    const [content, setContent] = useState("");
    const [metadata, setMetadata] = useState({});


    useEffect(() => {
      if (post) {
        console.log(content)
        fetch(`/posts/${post.file}`)
          .then(res => res.text())
          .then(setContent);
          
      }
    }, [post]);


  
    if (!post) return (
      <div className="max-w-2xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-4 text-red-600">Post not found</h1>
        <Link to="/blog" className="text-blue-500 hover:underline">Back to Blog List</Link>
      </div>
    );
  
    return (
      <div className="max-w-2xl mx-auto py-10 px-4 bg-white rounded-lg shadow">
        <Link to="/blog" className="text-blue-500 hover:underline mb-4 inline-block">&larr; Back to Blog List</Link>
        
        <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
        {post.date && <div className="text-gray-400 text-sm mb-6">{post.date}</div>}
        <article className="prose prose-lg">
            <div className="prose prose-lg mx-auto">
                <ReactMarkdown>{content}</ReactMarkdown>
            </div>
        </article>
      </div>
    );
  };
  
  export default BlogPost;
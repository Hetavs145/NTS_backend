import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// footer is rendered globally from router

const blogs = [
  {
    title: "A Better Future Through Local Freelance Work",
    excerpt: "Discover how Kaamigo is changing lives by connecting local freelancers with real opportunities.",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    link: "#",
    category: "Success Stories",
    readTime: "5 min read"
  },
  {
    title: "Scaling Up: Success Stories of Rural Youth",
    excerpt: "Meet the faces behind the freelancing revolution in Tier 2/3 cities.",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    link: "#",
    category: "Success Stories",
    readTime: "7 min read"
  },
  {
    title: "Top 5 In-Demand Digital Skills in 2025",
    excerpt: "Stay ahead with our list of the most sought-after freelance skills in the digital economy.",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    link: "#",
    category: "Skills & Training",
    readTime: "4 min read"
  },
  {
    title: "Women Empowerment through Remote Work",
    excerpt: "See how Kaamigo is creating flexible job opportunities for women across India.",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    link: "#",
    category: "Empowerment",
    readTime: "6 min read"
  },
  {
    title: "Freelancing in Local Languages",
    excerpt: "Explore the power of regional content and communication for rural freelancers.",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    link: "#",
    category: "Local Impact",
    readTime: "5 min read"
  },
  {
    title: "How to Find Your First Client on Kaamigo",
    excerpt: "Tips and tricks to kickstart your freelance journey the right way.",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    link: "#",
    category: "Tips & Tricks",
    readTime: "8 min read"
  },
];

const Blog = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Success Stories', 'Skills & Training', 'Empowerment', 'Local Impact', 'Tips & Tricks'];

  const filteredBlogs = blogs.filter(blog => {
    const matchesCategory = selectedCategory === 'All' || blog.category === selectedCategory;
    const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleExploreStories = () => {
    // Navigate to explore page with stories filter
    navigate('/explore?stories=true');
  };

  const handleReadMore = (blog) => {
    // In a real app, this would navigate to the full blog post
    // For now, we'll show an alert with the blog details
    alert(`Reading: ${blog.title}\n\n${blog.excerpt}\n\nCategory: ${blog.category}\nRead Time: ${blog.readTime}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50 py-12 px-4">
      {/* Featured Section */}
      <div className="max-w-6xl mx-auto mb-16">
        <div className="h-64 bg-gradient-to-br from-purple-300 to-orange-300 rounded-3xl flex items-center justify-center text-4xl text-white font-bold shadow-lg">
          Featured Blog Banner
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-6xl mx-auto mb-12">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search stories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-500"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full border transition-colors ${
                    selectedCategory === category
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white text-purple-600 border-purple-200 hover:bg-purple-50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Blog List */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredBlogs.map((post, i) => (
          <div
            key={i}
            className="bg-white border border-purple-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            <img src={post.image} alt={post.title} className="rounded-t-2xl h-48 w-full object-cover" />
            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                  {post.category}
                </span>
                <span className="text-xs text-gray-500">{post.readTime}</span>
              </div>
              <h3 className="text-xl font-bold text-purple-700 mb-2">{post.title}</h3>
              <p className="text-gray-600 mb-4 text-sm">{post.excerpt}</p>
              <button
                onClick={() => handleReadMore(post)}
                className="text-orange-500 font-semibold text-sm hover:underline flex items-center gap-1"
              >
                Read More →
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredBlogs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No stories found matching your criteria.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="mt-4 text-purple-600 hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* CTA Section */}
      <div className="mt-20 bg-gradient-to-r from-blue-600 to-orange-400 rounded-2xl text-white p-10 max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="mb-6 md:mb-0">
          <h2 className="text-2xl font-bold mb-2">Want to know more about Kaamigo?</h2>
          <p className="text-sm text-blue-100">We regularly publish stories of inspiring freelancers, success journeys, and tips to level up your career.</p>
        </div>
        <button 
          onClick={handleExploreStories}
          className="bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-blue-100 transition-all duration-300"
        >
          Explore Stories
        </button>
      </div>
      {/* footer rendered globally */}
    </div>
  );
};

export default Blog;

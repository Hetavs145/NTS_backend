import React from 'react';
// footer is rendered globally from router

const blogs = [
  {
    title: "A Better Future Through Local Freelance Work",
    excerpt: "Discover how Kaamigo is changing lives by connecting local freelancers with real opportunities.",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    link: "#",
  },
  {
    title: "Scaling Up: Success Stories of Rural Youth",
    excerpt: "Meet the faces behind the freelancing revolution in Tier 2/3 cities.",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    link: "#",
  },
  {
    title: "Top 5 In-Demand Digital Skills in 2025",
    excerpt: "Stay ahead with our list of the most sought-after freelance skills in the digital economy.",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    link: "#",
  },
  {
    title: "Women Empowerment through Remote Work",
    excerpt: "See how Kaamigo is creating flexible job opportunities for women across India.",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    link: "#",
  },
  {
    title: "Freelancing in Local Languages",
    excerpt: "Explore the power of regional content and communication for rural freelancers.",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    link: "#",
  },
  {
    title: "How to Find Your First Client on Kaamigo",
    excerpt: "Tips and tricks to kickstart your freelance journey the right way.",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    link: "#",
  },
];

const Blog = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50 py-12 px-4">
      {/* Featured Section */}
      <div className="max-w-6xl mx-auto mb-16">
        <div className="h-64 bg-gradient-to-br from-purple-300 to-orange-300 rounded-3xl flex items-center justify-center text-4xl text-white font-bold shadow-lg">
          Featured Blog Banner
        </div>
      </div>

      {/* Blog List */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {blogs.map((post, i) => (
          <div
            key={i}
            className="bg-white border border-purple-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            <img src={post.image} alt={post.title} className="rounded-t-2xl h-48 w-full object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-bold text-purple-700 mb-2">{post.title}</h3>
              <p className="text-gray-600 mb-4 text-sm">{post.excerpt}</p>
              <a
                href={post.link}
                className="text-orange-500 font-semibold text-sm hover:underline"
              >
                Read More →
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="mt-20 bg-gradient-to-r from-blue-600 to-orange-400 rounded-2xl text-white p-10 max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="mb-6 md:mb-0">
          <h2 className="text-2xl font-bold mb-2">Want to know more about Kaamigo?</h2>
          <p className="text-sm text-blue-100">We regularly publish stories of inspiring freelancers, success journeys, and tips to level up your career.</p>
        </div>
        <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-blue-100 transition-all duration-300">
          Explore Stories
        </button>
      </div>
      {/* footer rendered globally */}
    </div>
  );
};

export default Blog;

import React from 'react';
import { Calendar, User, ArrowRight } from 'lucide-react';

function Blog() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <div className="bg-odoo-gray py-20">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">Our Blog</h1>
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto">
            Stay updated with the latest trends in smart home technology and security solutions.
          </p>
        </div>
      </div>

      {/* Featured Post */}
      <div className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80"
                alt="Featured Post"
                className="rounded-lg shadow-xl w-full h-[400px] object-cover"
              />
            </div>
            <div>
              <span className="text-gold-500 font-semibold">Featured Post</span>
              <h2 className="text-3xl font-bold mt-2 mb-4">The Future of Smart Home Security: AI and Machine Learning</h2>
              <div className="flex items-center space-x-4 text-gray-600 mb-4">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>March 15, 2024</span>
                </div>
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  <span>John Smith</span>
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                Discover how artificial intelligence and machine learning are revolutionizing home security systems, making them smarter and more effective than ever before.
              </p>
              <button className="flex items-center text-gold-500 font-semibold hover:text-gold-600 transition-colors">
                Read More <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Posts */}
      <div className="py-20 bg-odoo-gray">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16">Recent Posts</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <BlogCard 
              image="https://images.unsplash.com/photo-1557838923-2985c318be48?auto=format&fit=crop&w=800&q=80"
              title="5 Essential CCTV Features for Home Security"
              date="March 10, 2024"
              author="Sarah Johnson"
              excerpt="Learn about the must-have features in modern CCTV systems that ensure maximum home security."
            />
            <BlogCard 
              image="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80"
              title="Optimizing Your Home Network for Smart Devices"
              date="March 5, 2024"
              author="Michael Chen"
              excerpt="Tips and tricks for creating a robust network that supports all your smart home devices."
            />
            <BlogCard 
              image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
              title="Data Analysis in Home Security: What You Need to Know"
              date="February 28, 2024"
              author="Emily Wilson"
              excerpt="Understanding how data analysis can improve your home security system's effectiveness."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function BlogCard({ 
  image, 
  title, 
  date, 
  author, 
  excerpt 
}: { 
  image: string; 
  title: string; 
  date: string; 
  author: string; 
  excerpt: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <img 
        src={image} 
        alt={title} 
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <div className="flex items-center space-x-4 text-gray-600 text-sm mb-4">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{date}</span>
          </div>
          <div className="flex items-center">
            <User className="w-4 h-4 mr-2" />
            <span>{author}</span>
          </div>
        </div>
        <p className="text-gray-600 mb-4">{excerpt}</p>
        <button className="flex items-center text-gold-500 font-semibold hover:text-gold-600 transition-colors">
          Read More <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
}

export default Blog;
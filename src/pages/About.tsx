
import React from 'react';
import { Layout } from '@/components/layout/Layout';

const About = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-16">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">About Us</h1>
        
        <div className="prose lg:prose-xl">
          <p className="text-lg text-gray-700 mb-6">
            We connect service providers with clients looking for quality work. Our platform makes it easy to find, 
            book, and manage services all in one place.
          </p>
          
          <h2 className="text-2xl font-semibold mt-12 mb-4 text-gray-900">Our Mission</h2>
          <p className="text-lg text-gray-700 mb-6">
            To create a seamless connection between skilled professionals and clients, 
            ensuring quality service delivery and fair opportunities for all.
          </p>
          
          <h2 className="text-2xl font-semibold mt-12 mb-4 text-gray-900">What We Offer</h2>
          <div className="grid md:grid-cols-2 gap-8 my-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-xl font-medium text-gray-900 mb-3">For Clients</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>Easy service discovery</li>
                <li>Verified professionals</li>
                <li>Secure payment system</li>
                <li>Review-based quality control</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-xl font-medium text-gray-900 mb-3">For Service Providers</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>New client opportunities</li>
                <li>Profile management</li>
                <li>Job scheduling</li>
                <li>Payment processing</li>
              </ul>
            </div>
          </div>
          
          <h2 className="text-2xl font-semibold mt-12 mb-4 text-gray-900">Contact Us</h2>
          <p className="text-lg text-gray-700">
            Have questions or feedback? Reach out to our team at <a href="mailto:support@example.com" className="text-brand-500 hover:text-brand-600">support@example.com</a>.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default About;

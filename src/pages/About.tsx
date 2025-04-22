
import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            className="text-sm text-gray-500"
            onClick={() => navigate('/')}
          >
            Back to Home
          </Button>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">About Our Service Platform</h1>
        
        <div className="prose max-w-none">
          <p className="text-lg mb-6">
            Welcome to our comprehensive service platform where homeowners can find qualified professionals
            for their home improvement and maintenance needs.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Our Mission</h2>
          <p className="mb-6">
            We aim to connect homeowners with skilled contractors and service providers to ensure
            quality work and seamless experiences for all home improvement projects.
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 my-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-medium mb-3">For Homeowners</h3>
              <p>Browse services, read reviews, and hire trusted professionals for your home projects.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-medium mb-3">For Contractors</h3>
              <p>Find new clients, showcase your skills, and grow your business through our platform.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-medium mb-3">For Service Providers</h3>
              <p>Offer specialized services and connect with clients looking for your expertise.</p>
            </div>
          </div>
          
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Our Services</h2>
          <p className="mb-6">
            We cover a wide range of services including plumbing, electrical work, carpentry, 
            landscaping, cleaning, and more. All our listed professionals are vetted to ensure
            quality workmanship.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default About;

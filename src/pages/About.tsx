import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">About Task Buddy Nexus</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold">Our Mission</h2>
            <p>
              Task Buddy Nexus is dedicated to connecting skilled professionals with clients who need their expertise.
              We believe in creating meaningful connections that benefit both parties through our innovative platform.
            </p>

            <h2 className="text-2xl font-semibold mt-6">What We Offer</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Seamless project management and communication</li>
              <li>Secure payment processing</li>
              <li>Verified professional profiles</li>
              <li>Real-time messaging and updates</li>
              <li>Comprehensive service listings</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-6">Our Team</h2>
            <p>
              We are a team of passionate individuals committed to revolutionizing how people connect and collaborate
              in the professional services industry. Our platform is built with user experience and security in mind.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default About;

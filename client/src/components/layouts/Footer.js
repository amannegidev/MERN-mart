import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-green-950 px-6 pt-16 pb-6">
      <div className="max-w-screen-xl mx-auto">
        <div className="grid lg:grid-cols-5 sm:grid-cols-2 gap-8">
          {/* Contact info - spans 2 columns on lg */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-base text-white font-medium mb-6">ReadymadeUI</h3>
            <p className="text-base text-white">1234 Elm St. Anytown, USA 12345</p>
            <p className="text-base text-white">abc@abc.com</p>
            <p className="text-base text-white">+1 123-456-7890</p>
          </div>

          {/* Products */}
          <div className='hidden md:block'>
            <h3 className="text-base text-white font-medium mb-6 ml-0 sm:ml-8">Products</h3>
            <ul className="space-y-4">
              {[
                "Website Templates",
                "Dashboard Designs",
                "E-commerce Layouts",
                "UI Components",
                "Landing Pages",
                "Marketing Templates"
              ].map((item, idx) => (
                <li key={idx}>
                  <a href="#" className="text-base text-white hover:text-blue-700 no-underline">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div className='hidden md:block'>
            <h3 className="text-base text-white font-medium mb-6 ml-0 sm:ml-8">About</h3>
            <ul className="space-y-4">
              {[
                "Our Story",
                "Careers",
                "Press",
                "Testimonials",
                "FAQs",
                "Contact Support"
              ].map((item, idx) => (
                <li key={idx}>
                  <a href="#" className="text-base no-underline text-white hover:text-blue-700">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Follow Us */}
          <div className='hidden md:block'>
            <h3 className="text-base text-white font-medium mb-6 ml-0 sm:ml-8">Follow Us</h3>
            <ul className="space-y-4">
              {[
                "Website Templates",
                "Dashboard Designs",
                "E-commerce Layouts",
                "UI Components",
                "Landing Pages",
                "Marketing Templates"
              ].map((item, idx) => (
                <li key={idx}>
                  <Link to="/" className="text-base text-white hover:text-blue-700 no-underline">{item}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr className="mt-12 mb-6 border-gray-700" />
        <div className="text-base text-center text-gray-400">
          &copy; 2024 ReadymadeUI
        </div>
      </div>
    </footer>
  );
};

export default Footer;

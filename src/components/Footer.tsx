const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} TaskConnect. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <a
              href="#"
              className="text-gray-400 hover:text-gray-500"
            >
              Terms
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-gray-500"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-gray-500"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
import React from 'react'
import { FaFacebook, FaTwitter, FaEnvelope, FaWhatsapp } from 'react-icons/fa'

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-green-400 to-blue-500 text-white py-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap justify-between items-center">
          <div className="w-full md:w-1/2 mb-6 md:mb-0">
            <h3 className="text-2xl font-bold mb-2">2GROW INITIATIVE</h3>
            <div className="flex space-x-4">
              <a href="https://facebook.com/2GROWINITIATIVE" target="_blank" rel="noopener noreferrer" className="hover:text-green-200 transition duration-300">
                <FaFacebook size={24} />
              </a>
              <a href="https://twitter.com/2GROWINITIATIVE" target="_blank" rel="noopener noreferrer" className="hover:text-green-200 transition duration-300">
                <FaTwitter size={24} />
              </a>
              <a href="mailto:ctech75@yahoo.com" className="hover:text-green-200 transition duration-300">
                <FaEnvelope size={24} />
              </a>
              <a href="https://wa.me/254790471573" target="_blank" rel="noopener noreferrer" className="hover:text-green-200 transition duration-300">
                <FaWhatsapp size={24} />
              </a>
            </div>
          </div>
          <div className="w-full md:w-1/2 text-right">
            <p className="mb-2">"Join our Investment and savings Group today, New Era of Online Sacco"</p>
            <p className="italic">Powered by ctech solutions</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer


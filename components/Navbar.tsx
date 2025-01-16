'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FaBars, FaTimes } from 'react-icons/fa'

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <Image src="/placeholder.svg" alt="2GROW Logo" width={40} height={40} />
            </Link>
            <span className="ml-2 text-2xl font-bold text-green-600">2GROW</span>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/finance-news" className="text-green-600 hover:text-green-800 px-3 py-2 rounded-md text-sm font-medium">
                Finance News & Offers
              </Link>
              <Link href="/testimonials" className="text-green-600 hover:text-green-800 px-3 py-2 rounded-md text-sm font-medium">
                Testimonials
              </Link>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-green-600 hover:text-green-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <FaTimes className="block h-6 w-6" /> : <FaBars className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/finance-news" className="text-green-600 hover:text-green-800 block px-3 py-2 rounded-md text-base font-medium">
              Finance News & Offers
            </Link>
            <Link href="/testimonials" className="text-green-600 hover:text-green-800 block px-3 py-2 rounded-md text-base font-medium">
              Testimonials
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar


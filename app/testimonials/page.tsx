'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { FaStar } from 'react-icons/fa'

interface Testimonial {
  name: string
  location: string
  content: string
  rating?: number
}

const testimonials: Testimonial[] = [
  {
    name: "Janet",
    location: "Ghana",
    content: "The ability to have Finance section News (updated) is a plus for me",
    rating: 5
  },
  {
    name: "Hannah",
    location: "Isiolo",
    content: "Its ability to download the data or information, ability to autocalculate, ability to summarise every piece of information I need is brilliant. Kudos!",
    rating: 5
  },
  {
    name: "James",
    location: "Uganda",
    content: "I'm a happy beneficiary of this platform. I highly recommend any SMEs and MSMEs seeking to raise money for a new investment join this platform. It's fast and easy to use.",
    rating: 5
  },
  {
    name: "Shamir",
    location: "Nigeria",
    content: "Our project would never have completed on time without the need of this platform.",
    rating: 5
  },
  {
    name: "Julia",
    location: "Mombasa",
    content: "Its ability to display those investment Groups in the Top Investment Group section is mesmerizing. You can attract new investors with ease from any part of the globe to your project. Hongera!",
    rating: 5
  },
  {
    name: "Finance Researcher",
    location: "Ctech Solution",
    content: "It can work best if they work in conjunction with most Financial Institutions.",
    rating: 4
  }
]

const TestimonialCard: React.FC<Testimonial> = ({ name, location, content, rating }) => {
  return (
    <motion.div
      className="bg-white p-6 rounded-lg shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-xl font-bold mr-4">
          {name[0]}
        </div>
        <div>
          <h3 className="font-bold text-lg">{name}</h3>
          <p className="text-gray-600">{location}</p>
        </div>
      </div>
      <p className="text-gray-800 mb-4">&ldquo;{content}&rdquo;</p>
      {rating && (
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <FaStar key={i} className={i < rating ? "text-yellow-400" : "text-gray-300"} />
          ))}
        </div>
      )}
    </motion.div>
  )
}

const Testimonials: React.FC = () => {
  return (
    <div className="container mx-auto px-6 py-12">
      <motion.h1
        className="text-4xl md:text-5xl font-bold mb-8 text-green-600 text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        What Our Users Say
      </motion.h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <TestimonialCard key={index} {...testimonial} />
        ))}
      </div>
    </div>
  )
}

export default Testimonials


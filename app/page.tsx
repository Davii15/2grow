'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FaSearch } from 'react-icons/fa'
import InvestmentGroupCard from '../components/InvestmentGroupCard'

interface Group {
  id: number
  name: string
  members: any[]
  targetAmount: number
  currentAmount: number
  startDate: string
  endDate: string
  description: string
  image: string
  isPersonalized?: boolean
  email: string
  phoneNumber: string
}

const Home: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const savedGroups = localStorage.getItem('investmentGroups')
    if (savedGroups) {
      setGroups(JSON.parse(savedGroups))
    }
  }, [])

  const filteredGroups = groups.filter(group =>
    !group.isPersonalized && group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const trustedInstitutions = [
    "WEGROW DEV BANK", "UNION BANK OF KENYA", "JIJENGE SACCO AND BANK",
    "BLUE MARINE SACCO", "DIASPORA HELP GROUP", "2GROW PAMOJA INITIATIVE GROUP"
  ]

  return (
    <div className="container mx-auto px-6 py-12">
      <section className="text-center mb-16">
        <motion.h1
          className="text-4xl md:text-6xl font-bold mb-4 text-white"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          KARIBU TO 2GROW TOGETHER SAVINGS AND INVESTMENT PLATFORM TO JOIN THE PLATFORM JUST EMAIL ctech75@yahoo.com AND ENJOY THE 2GROW SERVICES
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl mb-8 text-green-100"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          LET'S GROW , MANAGE , MARKET OUR INVESTMENT CHAMAS AND PERSONAL CHAMAS OR GROUPS TOGETHER!👌👌
        </motion.p>
        <Link href="/signin" className="bg-white text-green-600 px-8 py-3 rounded-full text-xl font-bold hover:bg-green-100 transition duration-300">
          Get Started
        </Link>
      </section>

      <section className="mb-16">
        <div className="flex justify-center mb-8">
          <div className="relative w-full max-w-xl">
            <input
              type="text"
              placeholder="Search investment groups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-full border-2 border-green-500 focus:outline-none focus:border-green-600 text-black"
            />
            <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500" />
          </div>
        </div>
        <h2 className="text-3xl font-bold mb-8 text-black text-center">Top Investment Groups</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group) => (
            <InvestmentGroupCard
              key={group.id}
              id={group.id}
              name={group.name}
              dateCreated={group.startDate}
              dateExpected={group.endDate}
              targetAmount={group.targetAmount}
              currentAmount={group.currentAmount}
              members={group.members}
              description={group.description}
              image={group.image}
              email={group.email}
              phoneNumber={group.phoneNumber}
              isPersonalized={group.isPersonalized || false}
            />
          ))}
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-white text-center">Trusted Financial Institutions</h2>
        <div className="overflow-hidden">
          <motion.div
            className="flex space-x-8"
            animate={{ x: [0, -1000] }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          >
            {trustedInstitutions.map((institution, index) => (
              <div key={index} className="text-white text-xl font-bold whitespace-nowrap transform hover:scale-110 transition duration-300">
                {institution}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <footer className="text-center text-white mt-16">
        <p>&copy All rights reserved, Powered by Ctech Solutions</p>
      </footer>
    </div>
  )
}

export default Home


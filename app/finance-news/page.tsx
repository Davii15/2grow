'use client'

import React from 'react'
import { motion } from 'framer-motion'

const FinanceNews: React.FC = () => {
  const newsItems = [
    "JIJENGE BANK is seeking to give out a loan of 100,000 to the groups which register in this platform and they are located in Nyanza Region.",
    "Mr Shamir from Africa Dev Bank has offered to buy 40% stake of 2GROW Platform.",
    "Many commercial Banks in the world are realising the need of having online Investment Groups to help the SMES ANDMSMES save and invest in groups in conjuctions of giving out loans.",
    "The World Bank and Bank of China has awarded 2GROW platform the best Fintech application of the Century, to enable people take investments and also attract investors which spurs growth for Middle Income Earners or SMES.",
    "\"These types of innovative products can alleviate countries from Third World Country to the First World Country, hence women and Youth Groups are highly encouraged to grasp and use this products\" , 2GROW Founder stated in World Fintech Innovation Forum.",
    "The European Bank has promised to invest $ 3.1 million in the First 30 Groups (investment) related to climate change."
  ]

  return (
    <div className="container mx-auto px-6 py-12">
      <motion.h1
        className="text-4xl md:text-5xl font-bold mb-8 text-green-600 text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Finance News & Offers
      </motion.h1>
      <div className="grid gap-6">
        {newsItems.map((item, index) => (
          <motion.div
            key={index}
            className="bg-white p-6 rounded-lg shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <p className="text-gray-800">{item}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default FinanceNews


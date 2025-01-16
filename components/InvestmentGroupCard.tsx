import React from 'react'
import Image from 'next/image'
import { FaEnvelope, FaPhone } from 'react-icons/fa'

interface InvestmentGroupCardProps {
  id: number
  name: string
  dateCreated: string
  dateExpected: string
  targetAmount: number
  currentAmount: number
  members: any[]
  description: string
  image: string
  email: string
  phoneNumber: string
  isPersonalized: boolean
}

const InvestmentGroupCard: React.FC<InvestmentGroupCardProps> = ({
  id,
  name,
  dateCreated,
  dateExpected,
  targetAmount,
  currentAmount,
  members,
  description,
  image,
  email,
  phoneNumber,
  isPersonalized,
}) => {
  if (isPersonalized) {
    return null; // Don't render personalized groups
  }

  const handleJoinNow = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Join Request for ${name}`)
    const body = encodeURIComponent(`Hello,

I am interested in joining the investment group "${name}".

Please provide me with more information about how to join and contribute to this group.

Thank you.`)
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <Image
        src={image || "/placeholder.svg"}
        alt={name}
        width={200}
        height={200}
        className="mb-4 rounded-lg w-full h-48 object-cover"
      />
      <h3 className="text-2xl font-bold mb-2 text-black">{name}</h3>
      <p className="text-base text-gray-700 mb-2">{description}</p>
      <p className="text-lg text-black">Date Created: {dateCreated || 'N/A'}</p>
      <p className="text-lg text-black">Date Expected: {dateExpected || 'N/A'}</p>
      <p className="text-lg text-black">Target Amount: KSH {targetAmount.toLocaleString()}</p>
      <p className="text-lg text-black">Current Amount: KSH {currentAmount.toLocaleString()}</p>
      <p className="text-lg text-black">Active Users: {members.length}</p>
      <div className="mt-4 space-y-2">
        <a
          href={`mailto:${email}`}
          onClick={handleJoinNow}
          className="block w-full text-center bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition duration-300 text-lg"
        >
          <FaEnvelope className="inline-block mr-2" />
          JOIN NOW
        </a>
        <a
          href={`tel:${phoneNumber}`}
          className="block w-full text-center bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition duration-300 text-lg"
        >
          <FaPhone className="inline-block mr-2" />
          CALL US NOW: {phoneNumber || 'N/A'}
        </a>
      </div>
    </div>
  )
}

export default InvestmentGroupCard


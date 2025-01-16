import React, { useState } from 'react'
import { FaTimes, FaUpload, FaPhone, FaSignOutAlt } from 'react-icons/fa'

interface AccountSettingsModalProps {
  onClose: () => void
  handleLogout: () => void
}

const AccountSettingsModal: React.FC<AccountSettingsModalProps> = ({ onClose, handleLogout }) => {
  const [newPhoneNumber, setNewPhoneNumber] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIsLoading(true)
      setError(null)
      try {
        // Simulate file upload delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // In a real application, you would upload the file to a server here
        // For now, we'll just store the file name in local storage
        localStorage.setItem('profilePicture', file.name)
        
        // After successful upload, you might want to update the user's profile picture in your state/UI
      } catch (error) {
        console.error('Error uploading file:', error)
        setError('Failed to upload profile picture. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handlePhoneNumberAdd = async () => {
    if (newPhoneNumber) {
      setIsLoading(true)
      setError(null)
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Store the new phone number in local storage
        localStorage.setItem('phoneNumber', newPhoneNumber)
        
        setNewPhoneNumber('')
        // After successful update, you might want to show a success message
      } catch (error) {
        console.error('Error updating phone number:', error)
        setError('Failed to update phone number. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // In a real application, you would update the password on the server
      // For now, we'll just store it in local storage (not secure, just for demonstration)
      localStorage.setItem('password', newPassword)
      
      setNewPassword('')
      setConfirmPassword('')
      // After successful update, you might want to show a success message
    } catch (error) {
      console.error('Error changing password:', error)
      setError('Failed to change password. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Account Settings</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
            <FaTimes size={24} />
          </button>
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="space-y-4">
          <div>
            <label htmlFor="profile-picture" className="block mb-2 text-gray-700">Change Profile Picture</label>
            <div className="flex items-center space-x-2">
              <input
                type="file"
                id="profile-picture"
                accept="image/*"
                className="hidden"
                onChange={handleProfilePictureChange}
              />
              <label
                htmlFor="profile-picture"
                className="cursor-pointer flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600"
              >
                <FaUpload className="mr-2" /> Upload New Picture
              </label>
            </div>
          </div>
          <div>
            <label htmlFor="new-phone" className="block mb-2 text-gray-700">Add New Phone Number</label>
            <div className="flex items-center space-x-2">
              <input
                type="tel"
                id="new-phone"
                value={newPhoneNumber}
                onChange={(e) => setNewPhoneNumber(e.target.value)}
                className="flex-grow px-3 py-2 border rounded-md bg-black text-white border-gray-300"
                placeholder="Enter new phone number"
              />
              <button
                onClick={handlePhoneNumberAdd}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-600"
                disabled={isLoading}
              >
                <FaPhone className="mr-2" /> Add
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="new-password" className="block mb-2 text-gray-700">Change Password</label>
            <input
              type="password"
              id="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-black text-white border-gray-300 mb-2"
              placeholder="New password"
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-black text-white border-gray-300 mb-2"
              placeholder="Confirm new password"
            />
            <button
              onClick={handlePasswordChange}
              className="w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600"
              disabled={isLoading}
            >
              Change Password
            </button>
          </div>
          <button
            onClick={handleLogout}
            className="w-full mt-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-600"
            disabled={isLoading}
          >
            <FaSignOutAlt className="inline-block mr-2" /> Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export default AccountSettingsModal


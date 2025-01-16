'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Calculator, Menu, Settings, LogOut, Trash, Download } from 'lucide-react'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import AccountSettingsModal from './AccountSettingsModal'
import { supabase } from '@/lib/supabase'
import { fetchGroups, createGroup, updateGroup, deleteGroup, addMember, addContribution } from '@/lib/databaseHelpers'
import { Group, Member, Contribution } from '@/lib/types'

declare module 'jspdf' {
  interface jsPDF {
    autotable: (options: any) => jsPDF;
  }
}

const AdminDashboard: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([])
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [groupToDelete, setGroupToDelete] = useState<string | null>(null)
  const [showCreateGroup, setShowCreateGroup] = useState(false)
  const [newGroup, setNewGroup] = useState<Omit<Group, 'id' | 'members' | 'created_by'>>({
    name: '',
    startDate: '',
    endDate: '',
    targetAmount: 0,
    currentAmount: 0,
    balance: 0,
    image: '',
    description: '',
    numberOfMembers: 0,
    paybillNumber: '',
    accountNumber: '',
    sendMoneyNumber: '',
    isPersonalized: false,
    email: '',
    phoneNumber: '',
  })
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)
  const [newMember, setNewMember] = useState<Omit<Member, 'id' | 'contributions'>>({
    name: '',
    idNumber: '',
    transactionCode: '',
    paymentMode: 'Account Number',
  })
  const [calculatorAmount, setCalculatorAmount] = useState('')
  const [newContribution, setNewContribution] = useState<Omit<Contribution, 'id'>>({ amount: 0, date: '' })
  const router = useRouter()
  const [showMenu, setShowMenu] = useState(false)
  const [showAccountSettings, setShowAccountSettings] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
        loadGroups(user.id)
      } else {
        router.push('/signin')
      }
    }
    checkUser()
  }, [router])

  const loadGroups = async (userId: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const groupsData = await fetchGroups(userId)
      console.log('Fetched groups:', groupsData)
      setGroups(groupsData)
    } catch (error) {
      console.error('Error loading groups:', error)
      setError('Failed to load groups. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateGroup = async () => {
    if (!userId) return
    try {
      const createdGroup = await createGroup(newGroup, userId)
      await loadGroups(userId)
      setShowCreateGroup(false)
      setNewGroup({
        name: '',
        startDate: '',
        endDate: '',
        targetAmount: 0,
        currentAmount: 0,
        balance: 0,
        image: '',
        description: '',
        numberOfMembers: 0,
        paybillNumber: '',
        accountNumber: '',
        sendMoneyNumber: '',
        isPersonalized: false,
        email: '',
        phoneNumber: '',
      })
    } catch (error) {
      console.error('Error creating group:', error)
      setError('Failed to create group. Please try again.')
    }
  }

  const handleDeleteGroup = (groupId: string) => {
    setGroupToDelete(groupId)
    setShowDeleteConfirmation(true)
  }

  const confirmDeleteGroup = async () => {
    if (groupToDelete) {
      try {
        await deleteGroup(groupToDelete)
        await loadGroups(userId!)
        setShowDeleteConfirmation(false)
        setGroupToDelete(null)
      } catch (error) {
        console.error('Error deleting group:', error)
        setError('Failed to delete group. Please try again.')
      }
    }
  }

  const handleAddMember = async () => {
    if (selectedGroup) {
      try {
        const addedMember = await addMember(selectedGroup.id, newMember)
        const updatedGroup = {
          ...selectedGroup,
          members: [...selectedGroup.members, addedMember],
        }
        setSelectedGroup(updatedGroup)
        await loadGroups(userId!)
        setNewMember({ name: '', idNumber: '', transactionCode: '', paymentMode: 'Account Number' })
      } catch (error) {
        console.error('Error adding member:', error)
        setError('Failed to add member. Please try again.')
      }
    }
  }

  const handleAddContribution = async (memberId: string) => {
    if (selectedGroup && newContribution.amount && newContribution.date) {
      try {
        const addedContribution = await addContribution(selectedGroup.id, memberId, newContribution)
        const updatedMembers = selectedGroup.members.map(member => {
          if (member.id === memberId) {
            return {
              ...member,
              contributions: [...member.contributions, addedContribution],
            }
          }
          return member
        })

        const totalContributions = updatedMembers.reduce(
          (total, member) => total + member.contributions.reduce((sum, contrib) => sum + contrib.amount, 0),
          0
        )

        const updatedGroup = {
          ...selectedGroup,
          members: updatedMembers,
          currentAmount: totalContributions,
          balance: selectedGroup.targetAmount - totalContributions,
        }

        await updateGroup(updatedGroup.id, {
          currentAmount: updatedGroup.currentAmount,
          balance: updatedGroup.balance,
        })

        setSelectedGroup(updatedGroup)
        await loadGroups(userId!)
        setNewContribution({ amount: 0, date: '' })
      } catch (error) {
        console.error('Error adding contribution:', error)
        setError('Failed to add contribution. Please try again.')
      }
    }
  }

  const handleExportPDF = (group: Group) => {
    const doc = new jsPDF()
    doc.text(`${group.name} - Member Contributions`, 14, 15)
    const tableData = group.members.map(member => [
      member.name,
      member.idNumber,
      member.transactionCode,
      member.paymentMode,
      member.contributions.reduce((total, contrib) => total + contrib.amount, 0).toFixed(2),
    ])
    doc.autoTable({
      head: [['Name', 'ID Number', 'Transaction Code', 'Payment Mode', 'Total Contribution']],
      body: tableData,
      startY: 20,
    })
    doc.save(`${group.name}_members.pdf`)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/signin')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500">
      <header className="bg-black text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">2GROW ADMIN DASHBOARD</h1>
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="text-white hover:text-gray-300"
        >
          <Menu className="h-6 w-6" />
        </button>
      </header>

      {showMenu && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
          <button 
            onClick={() => {
              setShowAccountSettings(true)
              setShowMenu(false)
            }}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <Settings className="inline-block mr-2 h-4 w-4" /> Account Settings
          </button>
          <button 
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <LogOut className="inline-block mr-2 h-4 w-4" /> Logout
          </button>
        </div>
      )}

      <main className="p-8">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => {
              setShowCreateGroup(true)
              setNewGroup({ ...newGroup, isPersonalized: false })
            }}
            className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition duration-300 mr-4"
          >
            <Plus className="inline-block mr-2 h-4 w-4" /> CREATE A NEW INVESTMENT GROUP
          </button>
          <button
            onClick={() => {
              setShowCreateGroup(true)
              setNewGroup({ ...newGroup, isPersonalized: true })
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition duration-300"
          >
            <Plus className="inline-block mr-2 h-4 w-4" /> CREATE PERSONAL SAVING GROUP
          </button>
        </div>

        {isLoading && (
          <div className="text-center py-4">
            <p className="text-white">Loading groups...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-4">
            <p className="text-red-500 bg-white p-2 rounded">{error}</p>
          </div>
        )}

        {!isLoading && !error && groups.length === 0 && (
          <div className="text-center py-4">
            <p className="text-white">No investment groups found. Create one to get started!</p>
          </div>
        )}

        {!isLoading && !error && groups.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => (
              <div key={group.id} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-2 text-gray-800">{group.name}</h3>
                <p className="text-gray-600">Members: {group.members.length}</p>
                <p className="text-gray-600">Target Amount: KSH {group.targetAmount.toLocaleString()}</p>
                <p className="text-gray-600">Current Amount: KSH {group.currentAmount.toLocaleString()}</p>
                <p className="text-gray-600">Balance: KSH {group.balance.toLocaleString()}</p>
                <p className="text-gray-600">Start Date: {group.startDate}</p>
                <p className="text-gray-600">End Date: {group.endDate}</p>
                <div className="mt-4 flex justify-between">
                  <button
                    onClick={() => handleDeleteGroup(group.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-300"
                  >
                    <Trash className="inline-block mr-1 h-4 w-4" /> Delete
                  </button>
                  <button
                    onClick={() => handleExportPDF(group)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition duration-300"
                  >
                    <Download className="inline-block mr-1 h-4 w-4" /> Export PDF
                  </button>
                  <button
                    onClick={() => setSelectedGroup(group)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition duration-300"
                  >
                    Manage
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedGroup && (
          <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">{selectedGroup.name} - Members</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-gray-800">Name</th>
                    <th className="px-4 py-2 text-gray-800">ID Number</th>
                    <th className="px-4 py-2 text-gray-800">Transaction Code</th>
                    <th className="px-4 py-2 text-gray-800">Payment Mode</th>
                    <th className="px-4 py-2 text-gray-800">Contributions</th>
                    <th className="px-4 py-2 text-gray-800">Total Contribution</th>
                    <th className="px-4 py-2 text-gray-800">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedGroup.members.map((member) => (
                    <tr key={member.id}>
                      <td className="border px-4 py-2 text-gray-600">{member.name}</td>
                      <td className="border px-4 py-2 text-gray-600">{member.idNumber}</td>
                      <td className="border px-4 py-2 text-gray-600">{member.transactionCode}</td>
                      <td className="border px-4 py-2 text-gray-600">{member.paymentMode}</td>
                      <td className="border px-4 py-2 text-gray-600">
                        {member.contributions.map((contrib, index) => (
                          <div key={index}>
                            KSH {contrib.amount.toFixed(2)} on {contrib.date}
                          </div>
                        ))}
                      </td>
                      <td className="border px-4 py-2 text-gray-600">
                        KSH {member.contributions.reduce((total, contrib) => total + contrib.amount, 0).toFixed(2)}
                      </td>
                      <td className="border px-4 py-2">
                        <input
                          type="number"
                          placeholder="Amount"
                          value={newContribution.amount}
                          onChange={(e) => setNewContribution({ ...newContribution, amount: parseFloat(e.target.value) })}
                          className="w-24 px-2 py-1 border rounded mr-2 bg-gray-100 text-black"
                        />
                        <input
                          type="date"
                          value={newContribution.date}
                          onChange={(e) => setNewContribution({ ...newContribution, date: e.target.value })}
                          className="w-32 px-2 py-1 border rounded mr-2 bg-gray-100 text-black"
                        />
                        <button
                          onClick={() => handleAddContribution(member.id)}
                          className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition duration-300"
                        >
                          Add Contribution
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4">
              <h3 className="text-xl font-bold mb-2 text-gray-800">Add New Member</h3>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  className="flex-1 px-3 py-2 border rounded bg-gray-100 text-black"
                />
                <input
                  type="text"
                  placeholder="ID Number"
                  value={newMember.idNumber}
                  onChange={(e) => setNewMember({ ...newMember, idNumber: e.target.value })}
                  className="flex-1 px-3 py-2 border rounded bg-gray-100 text-black"
                />
                <input
                  type="text"
                  placeholder="Transaction Code"
                  value={newMember.transactionCode}
                  onChange={(e) => setNewMember({ ...newMember, transactionCode: e.target.value })}
                  className="flex-1 px-3 py-2 border rounded bg-gray-100 text-black"
                />
                <select
                  value={newMember.paymentMode}
                  onChange={(e) => setNewMember({ ...newMember, paymentMode: e.target.value as Member['paymentMode'] })}
                  className="flex-1 px-3 py-2 border rounded bg-gray-100 text-black"
                >
                  <option value="Account Number">Account Number</option>
                  <option value="Paybill Number">Paybill Number</option>
                  <option value="Send Money">Send Money</option>
                </select>
                <button
                  onClick={handleAddMember}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                >
                  Add Member
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4 text-white">Contribution Calculator</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <Calculator className="mr-4 text-gray-600 h-6 w-6" />
              <input
                type="number"
                placeholder="Enter amount"
                className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-black"
                value={calculatorAmount}
                onChange={(e) => setCalculatorAmount(e.target.value)}
              />
              <button
                onClick={() => alert(`Total: KSH ${parseFloat(calculatorAmount).toFixed(2)}`)}
                className="ml-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
              >
                Calculate
              </button>
            </div>
          </div>
        </div>
      </main>

      {showAccountSettings && (
        <AccountSettingsModal
          onClose={() => setShowAccountSettings(false)}
          handleLogout={handleLogout}
        />
      )}

      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Confirm Deletion</h3>
            <p className="text-gray-600">Are you sure you want to delete this investment group?</p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowDeleteConfirmation(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2 hover:bg-gray-400 transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteGroup}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showCreateGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto">
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl m-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">
              Create New {newGroup.isPersonalized ? 'Personal Saving' : 'Investment'} Group
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="groupName" className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
                <input
                  id="groupName"
                  type="text"
                  placeholder="Group Name"
                  className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-black shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newGroup.name}
                  onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  id="startDate"
                  type="date"
                  className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-black shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newGroup.startDate}
                  onChange={(e) => setNewGroup({ ...newGroup, startDate: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  id="endDate"
                  type="date"
                  className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-black shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newGroup.endDate}
                  onChange={(e) => setNewGroup({ ...newGroup, endDate: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="targetAmount" className="block text-sm font-medium text-gray-700 mb-1">Target Amount (KSH)</label>
                <input
                  id="targetAmount"
                  type="number"
                  placeholder="Target Amount (KSH)"
                  className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-black shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newGroup.targetAmount}
                  onChange={(e) => setNewGroup({ ...newGroup, targetAmount: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <label htmlFor="numberOfMembers" className="block text-sm font-medium text-gray-700 mb-1">Number of Members (max 80)</label>
                <input
                  id="numberOfMembers"
                  type="number"
                  placeholder="Number of Members (max 80)"
                  className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-black shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newGroup.numberOfMembers}
                  onChange={(e) => setNewGroup({ ...newGroup, numberOfMembers: Math.min(parseInt(e.target.value), 80) })}
                />
              </div>
              <div>
                <label htmlFor="paybillNumber" className="block text-sm font-medium text-gray-700 mb-1">Paybill Number</label>
                <input
                  id="paybillNumber"
                  type="text"
                  placeholder="Paybill Number"
                  className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-black shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newGroup.paybillNumber}
                  onChange={(e) => setNewGroup({ ...newGroup, paybillNumber: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-1">Bank Account Number</label>
                <input
                  id="accountNumber"
                  type="text"
                  placeholder="Bank Account Number"
                  className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-black shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newGroup.accountNumber}
                  onChange={(e) => setNewGroup({ ...newGroup, accountNumber: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="sendMoneyNumber" className="block text-sm font-medium text-gray-700 mb-1">Send Money Number</label>
                <input
                  id="sendMoneyNumber"
                  type="text"
                  placeholder="Send Money Number"
                  className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-black shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newGroup.sendMoneyNumber}
                  onChange={(e) => setNewGroup({ ...newGroup, sendMoneyNumber: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-black shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newGroup.email}
                  onChange={(e) => setNewGroup({ ...newGroup, email: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  id="phoneNumber"
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-black shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newGroup.phoneNumber}
                  onChange={(e) => setNewGroup({ ...newGroup, phoneNumber: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="groupImage" className="block text-sm font-medium text-gray-700 mb-1">Group Image</label>
                <input
                  id="groupImage"
                  type="file"
                  accept="image/*"
                  className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-black shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      const reader = new FileReader()
                      reader.onloadend = () => {
                        setNewGroup({ ...newGroup, image: reader.result as string })
                      }
                      reader.readAsDataURL(file)
                    }
                  }}
                />
              </div>
            </div>
            <div className="mt-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Project Description</label>
              <textarea
                id="description"
                placeholder="Project Description"
                className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-black shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={6}
                value={newGroup.description}
                onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
              ></textarea>
            </div>
            <div className="border-t border-gray-200 mt-6 pt-6">
              <div className="flex justify-end">
                <button
                  onClick={() => setShowCreateGroup(false)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2 hover:bg-gray-400 transition duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowConfirmation(true)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
                >
                  Review & Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl m-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-4 text-center text-gray-800">
              Confirm Group Details
            </h3>
            <div className="mb-4">
              <p><strong>Name:</strong> {newGroup.name}</p>
              <p><strong>Start Date:</strong> {newGroup.startDate}</p>
              <p><strong>End Date:</strong> {newGroup.endDate}</p>
              <p><strong>Target Amount:</strong> KSH {newGroup.targetAmount.toLocaleString()}</p>
              <p><strong>Number of Members:</strong> {newGroup.numberOfMembers}</p>
              <p><strong>Is Personalized:</strong> {newGroup.isPersonalized ? 'Yes' : 'No'}</p>
              <p><strong>Paybill Number:</strong> {newGroup.paybillNumber}</p>
              <p><strong>Account Number:</strong> {newGroup.accountNumber}</p>
              <p><strong>Send Money Number:</strong> {newGroup.sendMoneyNumber}</p>
              <p><strong>Email:</strong> {newGroup.email}</p>
              <p><strong>Phone Number:</strong> {newGroup.phoneNumber}</p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowConfirmation(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2 hover:bg-gray-400 transition duration-300"
              >
                Back to Edit
              </button>
              <button
                onClick={() => {
                  handleCreateGroup();
                  setShowConfirmation(false);
                  setShowCreateGroup(false);
                }}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
              >
                Confirm & Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard


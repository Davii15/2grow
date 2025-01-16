import { Group, Member, Contribution } from './types'

// Helper function to get groups from localStorage
const getGroupsFromStorage = (): Group[] => {
  const groupsJson = localStorage.getItem('investmentGroups')
  return groupsJson ? JSON.parse(groupsJson) : []
}

// Helper function to save groups to localStorage
const saveGroupsToStorage = (groups: Group[]) => {
  localStorage.setItem('investmentGroups', JSON.stringify(groups))
}

export const fetchGroups = async (userId: string): Promise<Group[]> => {
  const allGroups = getGroupsFromStorage()
  return allGroups.filter(group => group.created_by === userId)
}

export const createGroup = async (group: Omit<Group, 'id' | 'members' | 'created_by'>, userId: string): Promise<Group> => {
  const groups = getGroupsFromStorage()
  const newGroup: Group = {
    ...group,
    id: Date.now().toString(),
    members: [],
    created_by: userId
  }
  groups.push(newGroup)
  saveGroupsToStorage(groups)
  return newGroup
}

export const updateGroup = async (id: string, updates: Partial<Group>): Promise<Group> => {
  const groups = getGroupsFromStorage()
  const index = groups.findIndex(group => group.id === id)
  if (index !== -1) {
    groups[index] = { ...groups[index], ...updates }
    saveGroupsToStorage(groups)
    return groups[index]
  }
  throw new Error('Group not found')
}

export const deleteGroup = async (id: string): Promise<void> => {
  const groups = getGroupsFromStorage()
  const updatedGroups = groups.filter(group => group.id !== id)
  saveGroupsToStorage(updatedGroups)
}

export const addMember = async (groupId: string, member: Omit<Member, 'id'>): Promise<Member> => {
  const groups = getGroupsFromStorage()
  const groupIndex = groups.findIndex(group => group.id === groupId)
  if (groupIndex !== -1) {
    const newMember: Member = {
      ...member,
      id: Date.now().toString(),
      contributions: []
    }
    groups[groupIndex].members.push(newMember)
    saveGroupsToStorage(groups)
    return newMember
  }
  throw new Error('Group not found')
}

export const addContribution = async (groupId: string, memberId: string, contribution: Omit<Contribution, 'id'>): Promise<Contribution> => {
  const groups = getGroupsFromStorage()
  const groupIndex = groups.findIndex(group => group.id === groupId)
  if (groupIndex !== -1) {
    const memberIndex = groups[groupIndex].members.findIndex(member => member.id === memberId)
    if (memberIndex !== -1) {
      const newContribution: Contribution = {
        ...contribution,
        id: Date.now().toString()
      }
      groups[groupIndex].members[memberIndex].contributions.push(newContribution)
      saveGroupsToStorage(groups)
      return newContribution
    }
    throw new Error('Member not found')
  }
  throw new Error('Group not found')
}


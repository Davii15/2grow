export interface Contribution {
    id: string
    amount: number
    date: string
  }
  
  export interface Member {
    id: string
    name: string
    idNumber: string
    transactionCode: string
    paymentMode: 'Account Number' | 'Paybill Number' | 'Send Money'
    contributions: Contribution[]
  }
  
  export interface Group {
    id: string
    name: string
    startDate: string
    endDate: string
    targetAmount: number
    currentAmount: number
    balance: number
    image: string
    description: string
    numberOfMembers: number
    paybillNumber: string
    accountNumber: string
    sendMoneyNumber: string
    isPersonalized: boolean
    email: string
    phoneNumber: string
    members: Member[]
    created_by: string
  }
  
  
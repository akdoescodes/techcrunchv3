export interface EventInfo {
  id: string
  date: string
  time: string
  location: string
  type: string
  category: string
  description: string
  entryFee: string
  contactInfo: string
  registrationLink: string
  additionalInfo?: string
  organizer?: string
  capacity?: string
  imageUrl?: string
  speakers?: string[]
  technologies?: string[]
}

export interface AdminState {
  isAdmin: boolean
  password: string
}


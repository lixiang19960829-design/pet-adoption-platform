// Database Types for Pet Adoption Platform

export interface UserProfile {
    id: string
    full_name: string | null
    avatar_url: string | null
    role: 'user' | 'publisher' | 'admin'
    phone: string | null
    address: string | null
    created_at: string
    updated_at: string
}

export interface Pet {
    id: string
    publisher_id: string
    name: string
    species: 'dog' | 'cat' | 'rabbit' | 'bird' | 'other'
    breed: string | null
    age_years: number | null
    age_months: number | null
    gender: 'male' | 'female' | 'unknown'
    size: 'small' | 'medium' | 'large' | null
    color: string | null
    description: string | null
    health_status: string | null
    vaccination_status: string | null
    location: string
    adoption_requirements: string | null
    status: 'available' | 'pending' | 'adopted'
    images: string[]
    created_at: string
    updated_at: string
    // Joined fields
    publisher?: UserProfile
}

export interface AdoptionApplication {
    id: string
    pet_id: string
    applicant_id: string
    applicant_name: string
    applicant_email: string
    applicant_phone: string
    applicant_address: string
    housing_type: string | null
    has_experience: boolean | null
    other_pets: string | null
    reason: string
    status: 'pending' | 'approved' | 'rejected'
    created_at: string
    updated_at: string
    // Joined fields
    pet?: Pet
    applicant?: UserProfile
}

export interface Favorite {
    id: string
    user_id: string
    pet_id: string
    created_at: string
    // Joined fields
    pet?: Pet
}

export interface Message {
    id: string
    recipient_id: string
    sender_id: string | null
    title: string
    content: string
    type: 'application' | 'system' | 'message'
    is_read: boolean
    created_at: string
}

// Filter Types
export interface PetFilters {
    species?: string
    gender?: string
    size?: string
    location?: string
    search?: string
}

// Form Types
export interface PetFormData {
    name: string
    species: Pet['species']
    breed: string
    age_years: number | null
    age_months: number | null
    gender: Pet['gender']
    size: Pet['size']
    color: string
    description: string
    health_status: string
    vaccination_status: string
    location: string
    adoption_requirements: string
    images: string[]
}

export interface ApplicationFormData {
    applicant_name: string
    applicant_email: string
    applicant_phone: string
    applicant_address: string
    housing_type: string
    has_experience: boolean
    other_pets: string
    reason: string
}

export interface ProfileFormData {
    full_name: string
    phone: string
    address: string
}

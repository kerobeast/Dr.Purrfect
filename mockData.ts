
import { Owner, Pet, PetType, Gender, Visit } from './types';

export const MOCK_OWNERS: Owner[] = [
  { id: 'o1', name: 'Alex Rivera', phone_number: '555555555', email: 'alex@example.com' },
  { id: 'o2', name: 'Jordan Smith', phone_number: '555-0202', email: 'jordan@example.com' },
];

export const MOCK_PETS: Pet[] = [
  { 
    id: 'p1', 
    display_id: '1001', 
    owner_id: 'o1', 
    pet_name: 'Luna', 
    pet_type: PetType.CAT, 
    gender: Gender.FEMALE, 
    breed: 'Siamese', 
    age: '3 Years', 
    color: 'Cream & Dark Brown', 
    birth_date: '2021-05-15',
    profile_photo_url: 'https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&q=80&w=400'
  },
  { 
    id: 'p2', 
    display_id: '1002', 
    owner_id: 'o2', 
    pet_name: 'Mochi', 
    pet_type: PetType.DOG, 
    gender: Gender.MALE, 
    breed: 'French Bulldog', 
    age: '18 Months', 
    color: 'Fawn', 
    birth_date: '2022-11-20',
    profile_photo_url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=400'
  },
  { 
    id: 'p3', 
    display_id: '1003', 
    owner_id: 'o2', 
    pet_name: 'Coco', 
    pet_type: PetType.BIRD, 
    gender: Gender.FEMALE, 
    breed: 'Parakeet', 
    age: '4 Years', 
    color: 'Blue & White', 
    birth_date: '2020-01-10',
    profile_photo_url: 'https://images.unsplash.com/photo-1552728089-57bdde30fc3e?auto=format&fit=crop&q=80&w=400'
  },
];

export const MOCK_VISITS: Visit[] = [
  {
    id: 'v1',
    pet_id: 'p1',
    date: '2023-10-12',
    weight: 4.2,
    temperature: 38.5,
    heart_rate: 140,
    symptoms: 'Watery eyes, frequent sneezing, rubbing face against furniture.',
    diagnosis: 'Seasonal Allergies',
    prescription: 'Antihistamine 5mg - once daily',
    recommendations: 'Keep indoors during high pollen counts. Use a damp cloth to wipe paws after outdoor exposure.',
    doctor_name: 'Dr. Sarah Jenkins',
    vaccinations: 'Rabies, FVRCP (Up to date)',
    diet_breakfast: '1/4 cup Dry Kibble',
    diet_lunch: 'N/A',
    diet_dinner: '3oz Wet Food',
    diet_water: 'Normal (150ml/day)',
    stool_color: 'Dark Brown',
    stool_consistency: 'Solid/Formed',
    stool_frequency: 'Once daily',
    urine_color: 'Pale Yellow',
    urine_frequency: '4x daily',
    image_urls: ['https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800']
  },
  {
    id: 'v2',
    pet_id: 'p1',
    date: '2024-02-05',
    weight: 4.3,
    temperature: 38.6,
    heart_rate: 145,
    symptoms: 'Asymptomatic. Present for annual wellness check.',
    diagnosis: 'Routine Checkup',
    prescription: 'No medication required.',
    recommendations: 'Continue premium diet. Schedule dental cleaning in 6 months.',
    doctor_name: 'Dr. Mark Thorne',
    vaccinations: 'FeLV Booster',
    diet_breakfast: '1/4 cup Dry Kibble',
    diet_lunch: 'Treats only',
    diet_dinner: '3oz Wet Food',
    diet_water: 'Increased (Summer)',
    stool_color: 'Brown',
    stool_consistency: 'Soft-Normal',
    stool_frequency: 'Twice daily',
    urine_color: 'Clear-ish Yellow',
    urine_frequency: '6x daily',
    image_urls: ['https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1517331156700-3c241d2b4d83?auto=format&fit=crop&q=80&w=800']
  }
];

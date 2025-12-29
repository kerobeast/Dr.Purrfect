
export enum PetType {
  DOG = 'Dog',
  CAT = 'Cat',
  RABBIT = 'Rabbit',
  BIRD = 'Bird',
  GOAT = 'Goat',
  SHEEP = 'Sheep',
  COW = 'Cow',
  CHICKEN = 'Chicken',
  OTHER = 'Other'
}

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other'
}

export interface Owner {
  id: string;
  name: string;
  phone_number: string;
  email: string;
}

export interface Pet {
  id: string;
  display_id: string;
  owner_id: string;
  pet_name: string;
  pet_type: PetType;
  gender: Gender;
  breed: string;
  age: string;
  color: string;
  birth_date: string;
}

export interface Visit {
  id: string;
  pet_id: string;
  date: string;
  weight: number;
  temperature: number;
  heart_rate: number;
  symptoms: string;
  diagnosis: string;
  prescription: string;
  recommendations: string;
  doctor_name: string;
  follow_up_date?: string;
  owner_phone_confirmation?: string;
  owner_phone_country_code?: string;
  vaccinations?: string;
  // Diet Tracking
  diet_breakfast?: string;
  diet_lunch?: string;
  diet_dinner?: string;
  diet_water?: string;
  // Elimination Tracking (Stool)
  stool_color?: string;
  stool_consistency?: string;
  stool_frequency?: string;
  // Elimination Tracking (Urine)
  urine_color?: string;
  urine_frequency?: string;
  image_url?: string;
}

export type ViewRole = 'VET' | 'OWNER';

export interface FullVisitRecord extends Visit {
  display_id: string;
  owner_name: string;
  pet_name: string;
  pet_type: PetType;
  gender: Gender;
  breed: string;
  age: string;
  color: string;
  birth_date: string;
}

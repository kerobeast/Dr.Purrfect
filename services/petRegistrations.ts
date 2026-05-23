import { PetType, Gender } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface PetRegistrationSubmission {
  patient_display_id: string;
  owner_name: string;
  owner_email: string | null;
  owner_phone: string | null;
  pet_name: string;
  pet_type: PetType;
  pet_age: string;
  pet_breed: string | null;
  pet_gender: Gender;
  source: 'website_registration_form';
  page_url: string;
  user_agent: string;
}

export const savePetRegistration = async (submission: PetRegistrationSubmission) => {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.');
  }

  const { error } = await supabase.from('pet_registrations').insert({
    ...submission,
    status: 'new',
  });

  if (error) {
    throw new Error(error.message || 'Unable to save registration to Supabase.');
  }
};

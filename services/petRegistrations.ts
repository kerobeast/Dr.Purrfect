import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { PetRegistrationSubmission } from './registrationHelpers';

export type { PetRegistrationSubmission } from './registrationHelpers';

export const savePetRegistration = async (submission: PetRegistrationSubmission) => {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Registration is temporarily unavailable. Please call Dr. Purrfect so we can help you today.');
  }

  const { error } = await supabase.from('pet_registrations').insert(submission);

  if (error) {
    throw new Error(error.message || 'Unable to save registration to Supabase.');
  }
};

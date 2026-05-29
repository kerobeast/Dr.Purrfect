import { Gender, PetType } from '../types';

export type ContactMethod = 'phone' | 'text' | 'email';
export type RegistrationUrgency = 'routine' | 'soon' | 'urgent';

export interface RegistrationFormData {
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  preferredContactMethod: ContactMethod;
  bestTimeToContact: string;
  petName: string;
  petType: PetType;
  petAge: string;
  petBreed: string;
  petGender: Gender;
  visitReason: string;
  careNeeds: string;
  urgency: RegistrationUrgency;
  consentToContact: boolean;
  marketingConsent: boolean;
}

export interface PetRegistrationSubmission {
  patient_display_id: string;
  owner_name: string;
  owner_email: string | null;
  owner_email_normalized: string | null;
  owner_phone: string | null;
  owner_phone_normalized: string | null;
  preferred_contact_method: ContactMethod;
  best_time_to_contact: string | null;
  pet_name: string;
  pet_type: PetType;
  pet_age: string;
  pet_breed: string | null;
  pet_gender: Gender;
  visit_reason: string | null;
  care_needs: string | null;
  urgency: RegistrationUrgency;
  consent_to_contact: boolean;
  marketing_consent: boolean;
  source: 'website_registration_form';
  status: 'new';
  page_url: string;
  user_agent: string;
  metadata: {
    intakeVersion: 2;
    sourceLabel: 'Doctor Perfect website registration';
  };
}

export const normalizePhone = (value: string): string | null => {
  const digits = value.replace(/\D/g, '');
  const withoutCountryCode = digits.length === 11 && digits.startsWith('1') ? digits.slice(1) : digits;
  return withoutCountryCode.length >= 10 ? withoutCountryCode : null;
};

export const normalizeEmail = (value: string): string | null => {
  const email = value.trim().toLowerCase();
  if (!email) return null;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
};

const cleanOptional = (value: string): string | null => {
  const clean = value.trim();
  return clean ? clean : null;
};

export const getRegistrationValidationErrors = (form: RegistrationFormData): string[] => {
  const errors: string[] = [];
  const ownerName = form.ownerName.trim();
  const petName = form.petName.trim();
  const petAge = form.petAge.trim();
  const hasPhoneInput = Boolean(form.ownerPhone.trim());
  const hasEmailInput = Boolean(form.ownerEmail.trim());
  const normalizedPhone = normalizePhone(form.ownerPhone);
  const normalizedEmail = normalizeEmail(form.ownerEmail);

  if (ownerName.length < 2) errors.push('Enter the guardian’s full name.');
  if (!petName) errors.push('Enter your pet’s name.');
  if (!petAge) errors.push('Add your pet’s age or best estimate.');

  if (!normalizedPhone && !normalizedEmail) {
    errors.push('Add either a phone number or an email so the clinic can follow up.');
  }

  if (hasPhoneInput && !normalizedPhone) {
    errors.push('Enter a complete phone number, including area code.');
  }

  if (hasEmailInput && !normalizedEmail) {
    errors.push('Enter a valid email address.');
  }

  if ((form.preferredContactMethod === 'phone' || form.preferredContactMethod === 'text') && !normalizedPhone) {
    errors.push('Choose email as the preferred contact method, or add a phone number.');
  }

  if (form.preferredContactMethod === 'email' && !normalizedEmail) {
    errors.push('Choose phone/text as the preferred contact method, or add an email address.');
  }

  if (!form.consentToContact) {
    errors.push('Please allow Dr. Purrfect to contact you about this registration.');
  }

  return [...new Set(errors)];
};

export const createPatientDisplayId = (random = Math.random, date = new Date()): string => {
  const timestampSalt = date.getTime() % 100_000;
  const randomSalt = Math.floor(random() * 100_000);
  const sequence = ((timestampSalt + randomSalt) % 100_000).toString().padStart(5, '0');
  return `DP-${sequence}`;
};

export const buildPetRegistrationSubmission = (
  form: RegistrationFormData,
  context: { displayId: string; pageUrl: string; userAgent: string },
): PetRegistrationSubmission => ({
  patient_display_id: context.displayId,
  owner_name: form.ownerName.trim(),
  owner_email: cleanOptional(form.ownerEmail),
  owner_email_normalized: normalizeEmail(form.ownerEmail),
  owner_phone: cleanOptional(form.ownerPhone),
  owner_phone_normalized: normalizePhone(form.ownerPhone),
  preferred_contact_method: form.preferredContactMethod,
  best_time_to_contact: cleanOptional(form.bestTimeToContact),
  pet_name: form.petName.trim(),
  pet_type: form.petType,
  pet_age: form.petAge.trim(),
  pet_breed: cleanOptional(form.petBreed),
  pet_gender: form.petGender,
  visit_reason: cleanOptional(form.visitReason),
  care_needs: cleanOptional(form.careNeeds),
  urgency: form.urgency,
  consent_to_contact: form.consentToContact,
  marketing_consent: form.marketingConsent,
  source: 'website_registration_form',
  status: 'new',
  page_url: context.pageUrl,
  user_agent: context.userAgent,
  metadata: {
    intakeVersion: 2,
    sourceLabel: 'Doctor Perfect website registration',
  },
});

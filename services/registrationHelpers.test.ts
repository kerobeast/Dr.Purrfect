import { describe, expect, it } from 'vitest';
import { Gender, PetType } from '../types';
import {
  buildPetRegistrationSubmission,
  createPatientDisplayId,
  getRegistrationValidationErrors,
  normalizeEmail,
  normalizePhone,
  type RegistrationFormData,
} from './registrationHelpers';

const baseForm: RegistrationFormData = {
  ownerName: '  Clay Guardian  ',
  ownerEmail: 'CLAY@example.COM ',
  ownerPhone: '(312) 409-5027',
  preferredContactMethod: 'text',
  bestTimeToContact: 'Mornings',
  petName: ' Luna ',
  petType: PetType.CAT,
  petAge: '2 years',
  petBreed: 'Domestic shorthair',
  petGender: Gender.FEMALE,
  visitReason: 'Annual checkup',
  careNeeds: 'Sensitive stomach',
  urgency: 'soon',
  consentToContact: true,
  marketingConsent: false,
};

describe('registration helpers', () => {
  it('normalizes contact details without losing the user-entered display value', () => {
    expect(normalizePhone('(312) 409-5027')).toBe('3124095027');
    expect(normalizePhone('+1 312 409 5027')).toBe('3124095027');
    expect(normalizePhone('abc')).toBeNull();
    expect(normalizeEmail(' CLAY@Example.COM ')).toBe('clay@example.com');
    expect(normalizeEmail('not-an-email')).toBeNull();
  });

  it('blocks incomplete or non-consented registration attempts with actionable messages', () => {
    const errors = getRegistrationValidationErrors({
      ...baseForm,
      ownerName: 'A',
      ownerEmail: '',
      ownerPhone: '',
      petName: '',
      consentToContact: false,
    });

    expect(errors).toContain('Enter the guardian’s full name.');
    expect(errors).toContain('Add either a phone number or an email so the clinic can follow up.');
    expect(errors).toContain('Enter your pet’s name.');
    expect(errors).toContain('Please allow Dr. Purrfect to contact you about this registration.');
  });

  it('builds a complete Supabase submission with normalized fields and intake metadata', () => {
    const submission = buildPetRegistrationSubmission(baseForm, {
      displayId: 'DP-TEST01',
      pageUrl: 'https://www.drpurrfect.com/',
      userAgent: 'vitest',
    });

    expect(submission).toMatchObject({
      patient_display_id: 'DP-TEST01',
      owner_name: 'Clay Guardian',
      owner_email: 'CLAY@example.COM',
      owner_email_normalized: 'clay@example.com',
      owner_phone: '(312) 409-5027',
      owner_phone_normalized: '3124095027',
      preferred_contact_method: 'text',
      best_time_to_contact: 'Mornings',
      pet_name: 'Luna',
      pet_type: PetType.CAT,
      pet_age: '2 years',
      pet_breed: 'Domestic shorthair',
      pet_gender: Gender.FEMALE,
      visit_reason: 'Annual checkup',
      care_needs: 'Sensitive stomach',
      urgency: 'soon',
      consent_to_contact: true,
      marketing_consent: false,
      source: 'website_registration_form',
      status: 'new',
      page_url: 'https://www.drpurrfect.com/',
      user_agent: 'vitest',
      metadata: {
        intakeVersion: 2,
        sourceLabel: 'Doctor Perfect website registration',
      },
    });
  });

  it('generates clinic-friendly patient IDs that are short enough to read over the phone', () => {
    expect(createPatientDisplayId(() => 0.42, new Date('2026-05-29T12:00:00Z'))).toMatch(/^DP-\d{5}$/);
    expect(createPatientDisplayId(() => 0.42, new Date('2026-05-29T12:00:00Z'))).toBe(
      createPatientDisplayId(() => 0.42, new Date('2026-05-29T12:00:00Z')),
    );
  });
});

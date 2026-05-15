'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { donationSchema, type Donation, type DonationFormValues } from '@/lib/definitions';
import {
  fetchDonations,
  createDonation as dbCreateDonation,
  updateDonation as dbUpdateDonation,
  deleteDonation as dbDeleteDonation,
} from '@/lib/data';

export async function getDonations(): Promise<Donation[]> {
  try {
    return await fetchDonations();
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch donations.');
  }
}

export async function upsertDonation(formData: DonationFormValues) {
  const validatedFields = donationSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Upsert Donation.',
    };
  }

  const { id, ...data } = validatedFields.data;

  try {
    if (id) {
      await dbUpdateDonation(id, data);
    } else {
      await dbCreateDonation(data);
    }
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Database Error: Failed to Upsert Donation.' };
  }

  revalidatePath('/');
  return { message: id ? 'Donation updated successfully.' : 'Donation added successfully.' };
}

export async function removeDonation(id: string) {
  try {
    await dbDeleteDonation(id);
    revalidatePath('/');
    return { message: 'Donation deleted successfully.' };
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Database Error: Failed to Delete Donation.' };
  }
}

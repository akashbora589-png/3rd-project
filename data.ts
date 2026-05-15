import type { Donation, DonationFormValues } from "@/lib/definitions";

// In-memory store to simulate a database
let donations: Donation[] = [
  { id: '1', name: 'Alice Johnson', amount: 100, date: new Date('2023-05-01') },
  { id: '2', name: 'Bob Williams', amount: 50, date: new Date('2023-05-15') },
  { id: '3', name: 'Charlie Brown', amount: 250, date: new Date('2023-06-02') },
  { id: '4', name: 'Diana Miller', amount: 75, date: new Date('2023-06-20') },
  { id: '6', name: 'Fiona Green', amount: 300, date: new Date('2023-12-25') },
];

let nextId = donations.length + 1;

// Simulate network latency
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchDonations(): Promise<Donation[]> {
  await sleep(200); // Simulate DB query time
  return [...donations].sort((a, b) => b.date.getTime() - a.date.getTime());
}

export async function createDonation(data: DonationFormValues): Promise<Donation> {
  await sleep(300); // Simulate DB insert time
  const newDonation: Donation = {
    id: String(nextId++),
    name: data.name,
    amount: data.amount,
    date: data.date,
  };
  donations.unshift(newDonation);
  return newDonation;
}

export async function updateDonation(id: string, data: DonationFormValues): Promise<Donation | null> {
  await sleep(300); // Simulate DB update time
  const index = donations.findIndex((d) => d.id === id);
  if (index === -1) {
    return null;
  }
  const updatedDonation = { ...donations[index], ...data, id, date: data.date };
  donations[index] = updatedDonation;
  return updatedDonation;
}

export async function deleteDonation(id: string): Promise<{ success: boolean }> {
  await sleep(500); // Simulate DB delete time
  const initialLength = donations.length;
  donations = donations.filter((d) => d.id !== id);
  return { success: donations.length < initialLength };
}

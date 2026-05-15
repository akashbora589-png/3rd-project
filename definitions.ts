import { z } from "zod";

export type Donation = {
  id: string;
  name: string;
  amount: number;
  date: Date;
};

export const donationSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  amount: z.coerce.number().gt(0, {
    message: "Amount must be greater than 0.",
  }),
  date: z.date({
    required_error: "A donation date is required.",
  }),
});

export type DonationFormValues = z.infer<typeof donationSchema>;

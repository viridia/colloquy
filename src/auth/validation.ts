// import { User } from '@prisma/client';
// import { object, string } from 'yup';
import { User } from '@prisma/client';
import { z } from 'zod';

export const usernameSchema = z
  .string()
  .min(1, 'required')
  .min(3, 'too-short')
  .max(32, 'too-long')
  .regex(/^[^\s]+$/, 'no-spaces')
  .regex(/^[^@#`]+$/, 'illegal-character')
  .regex(/^[A-Za-z]/, 'letter')
  .regex(/^[A-Za-z0-9\\-\\.\\_]+/, 'letter');

type UserInput = Pick<User, 'username' | 'displayName' | 'email' | 'avatar' | 'rank'>;

export const userInputSchema: z.ZodType<Partial<UserInput>> = z.object({
  username: usernameSchema,
  displayName: z.string().max(32),
  email: z.string().min(1, 'required').email(),
  avatar: z.string().url(),
  // rank: z.string(),
});

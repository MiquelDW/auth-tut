// action.ts module contains server-side logic RPC functions
"use server";

import * as z from "zod";
import { RegisterSchema } from "@/schemas";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  // validate the form data again in the backend
  const validatedFields = RegisterSchema.safeParse(values);

  // return error object if form data is NOT valid
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  // extract validated fields
  const { name, email, password } = validatedFields.data;
  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // check if user already exists in db
  const existingUser = await getUserByEmail(email);

  // return error message if user already exists in db
  if (existingUser) {
    return { error: "Email already in use!" };
  }

  // create new user in db if it doesn't exist yet
  await db.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
    },
  });

  // TODO: Send verification token email

  return { success: "User created!" };
};

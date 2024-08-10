// zod is a library used for schema validation, allowing you to define schemas for data and validate objects against those schemas
import { UserRole } from "@prisma/client";
import { User } from "lucide-react";
import * as z from "zod";

// define schema for login form
// defines the structure of the login form data
export const LoginSchema = z.object({
  // must be a string and valid email address
  email: z.string().email({
    message: "Email is required",
  }),
  // must be a string and minimum 1 character
  password: z.string().min(1, {
    message: "password is required",
  }),
  // optional string field, can either be string or undefined
  code: z.optional(z.string()),
});

// define schema for register form
export const RegisterSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
});

// define schema for reset password form
export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

// define schema for new password form
export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
});

// define schema for settings form
export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum([UserRole.ADMIN, UserRole.USER]),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),
  })
  .refine(
    (data) => {
      // return error message if 'password' field is not filled in
      if (!data.password && data.newPassword) return false;

      return true;
    },
    {
      // error message
      message: "password is required",
      // provide the field where the error should be reported to
      path: ["password"],
    },
  )
  .refine(
    (data) => {
      // return error message if 'newPassword' field is not filled in
      if (data.password && !data.newPassword) return false;

      return true;
    },
    {
      message: "New password is required",
      path: ["newPassword"],
    },
  );

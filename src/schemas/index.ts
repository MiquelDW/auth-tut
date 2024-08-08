// zod is a library used for schema validation, allowing you to define schemas for data and validate objects against those schemas
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
export const SettingsSchema = z.object({
  name: z.optional(z.string()),
});

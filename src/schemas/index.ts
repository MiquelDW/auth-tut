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
});

// define schema for register form
// defines the structure of the register form data
export const RegisterSchema = z.object({
  // must be a string and minimum 1 character
  name: z.string().min(1, {
    message: "Name is required",
  }),
  // must be a string and valid email address
  email: z.string().email({
    message: "Email is required",
  }),
  // must be a string and minimum 6 characters
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
});

// define schema for reset password form
// defines the structure of the reset password form data
export const ResetSchema = z.object({
  // must be a string and valid email address
  email: z.string().email({
    message: "Email is required",
  }),
});

// define schema for new password form
// defines the structure of the new password form data
export const NewPasswordSchema = z.object({
  // must be a string and minimum 6 characters
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
});

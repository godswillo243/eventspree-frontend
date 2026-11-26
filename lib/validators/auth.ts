import { z } from "zod";

const passwordSchema = z
  .string({
    error: (issue) =>
      issue.input === undefined
        ? "Password is required"
        : "Password must be a string",
  })
  .min(8, "Password must be at least 8 characters long")
  .max(128, "Password cannot exceed 128 characters")
  .refine((v) => /[A-Z]/.test(v), {
    message: "Password must contain at least one uppercase letter",
  })
  .refine((v) => /[a-z]/.test(v), {
    message: "Password must contain at least one lowercase letter",
  })
  .refine((v) => /[0-9]/.test(v), {
    message: "Password must contain at least one number",
  });

export const signupSchema = z.strictObject({
  email: z.email({
    error: (issue) =>
      issue.input === undefined
        ? "Email is required"
        : "Please enter a valid email address",
  }),

  password: passwordSchema,
  name: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Name is required"
          : "Name must be a string",
    })
    .min(3, "Name must be at least 3 characters long"),
});

export const signinSchema = z.strictObject({
  email: z.email({
    error: (issue) =>
      issue.input === undefined
        ? "Email is required"
        : "Please enter a valid email address",
  }),

  password: z.string({
    error: (issue) =>
      issue.input === undefined
        ? "Password is required"
        : "Password must be a string",
  }),
});

export const verifyEmailSchema = z.strictObject({
  email: z.email({
    error: (issue) =>
      issue.input === undefined
        ? "Email is required"
        : "Please enter a valid email address",
  }),
  otp: z
    .string()
    .min(6, "OTP must be 6 digits long")
    .refine((v) => /\d{6}$/.test(v), "Only digits are required"),
});

export type FormValues = z.infer<typeof signupSchema | typeof signinSchema>;
export type SigninInput = z.infer<typeof signinSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;

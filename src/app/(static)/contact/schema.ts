import z from "zod";

// Define the schema for the contact form using zod
export const contactFormSchema = z.object({
  // Name must be a string between 2 and 50 characters
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  // Email must be a valid email address
  email: z.email("Invalid email address"),
  // Message must be a string between 10 and 1000 characters
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be at most 1000 characters"),
  turnstileToken: z
    .string()
    .min(1, { message: "Please complete the CAPTCHA verification." }),
});

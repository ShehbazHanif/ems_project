

// Zod schemas for validation
const { z } = require("zod");

const authCustomerCreateSchema = z.object({
  fullName: z.string()
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name must not exceed 50 characters")
    .trim(),

  email: z.string()
    .email("Please provide a valid email address")
    .toLowerCase()
    .trim(),

  password: z.string()
    .min(8, "Password must be at least 8 characters long")
    .max(100, "Password must not exceed 100 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),

  phone: z.string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must not exceed 15 digits")
    .regex(/^[0-9]+$/, "Phone number must contain only digits"),

  country: z.string()
    .min(2, "Country name must be at least 2 characters")
    .max(56, "Country name must not exceed 56 characters"),

  gender: z.enum(["Male", "Female"], {
    errorMap: () => ({ message: "Gender must be Male or Female" }),
  }),

  address: z.string()
    .min(5, "Address must be at least 5 characters")
    .max(300, "Address must not exceed 300 characters")
    .optional(),

  longitude: z.number({
    required_error: "Longitude is required",
    invalid_type_error: "Longitude must be a number",
  }).min(-180, "Longitude must be between -180 and 180")
    .max(180, "Longitude must be between -180 and 180")
    .optional(),

  latitude: z.number({
    required_error: "Latitude is required",
    invalid_type_error: "Latitude must be a number",
  }).min(-90, "Latitude must be between -90 and 90")
    .max(90, "Latitude must be between -90 and 90")
    .optional(),
});



const authServiceProviderUserCreateSchema = z.object({
  fullName: z.string()
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name must not exceed 50 characters")
    .trim(),

  email: z.string()
    .email("Please provide a valid email address")
    .toLowerCase()
    .trim(),

  password: z.string()
    .min(8, "Password must be at least 8 characters long")
    .max(100, "Password must not exceed 100 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),

  phone: z.string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must not exceed 15 digits")
    .regex(/^[0-9]+$/, "Phone number must contain only digits"),

  country: z.string()
    .min(2, "Country name must be at least 2 characters")
    .max(56, "Country name must not exceed 56 characters"),

  gender: z.enum(['Male', 'Female'], {
    errorMap: () => ({ message: "Gender must be Male or Female" }),
  }),

  businessName: z.string()
    .min(2, "Business name must be at least 2 characters long")
    .max(100, "Business name must not exceed 100 characters")
    .trim(),

});



const authLoginSchema = z.object({
  email: z.string()
    .email("Please provide a valid email address")
    .toLowerCase()
    .trim(),

  password: z.string()
    .min(1, "Password is required")
});

// Fixed OTP validation schema
const otpVerifySchema = z.object({
  email: z
    .string()
    .email("Please provide a valid email address")
    .toLowerCase()
    .trim(),
  otp: z
    .string()
    .length(4, "OTP must be exactly 4 digits"),
});

const validateSchema = (schema) => {
  return (req, res, next) => {
    try {
      const validatedData = schema.parse(req.body);
      req.body = validatedData;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map(err => ({
          field: err.path.length > 0 ? err.path.join('.') : 'body',
          message: err.message
        }));

        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errorMessages
        });
      }

      return res.status(500).json({
        success: false,
        message: "Internal server error during validation"
      });
    }
  };
};

module.exports = {
  authCustomerCreateSchema,
  authServiceProviderUserCreateSchema,
  authLoginSchema,
  otpVerifySchema,
  validateSchema
};
// src/services/formValidation.ts

export interface FormData {
  fullname: string;
  email: string;
  password: string;
  phone: string;
  verifyPassword: string;
}

export interface ErrorMessageDisplay {
  fullname: string | null;
  email: string | null;
  password: string | null;
  phone: string | null;
  verifyPassword: string | null;
}

export const validateFormData = (
  formData: FormData
): { isValid: boolean; errors: ErrorMessageDisplay } => {
  const errors: ErrorMessageDisplay = {
    fullname: null,
    email: null,
    password: null,
    phone: null,
    verifyPassword: null,
  };
  let isValid = true;

  if (formData.fullname.trim().length === 0) {
    errors.fullname = "Please enter valid name";
    isValid = false;
  }

  if (
    formData.email.trim().length === 0 ||
    formData.email.includes("@") === false
  ) {
    errors.email = "Please enter a valid Email";
    isValid = false;
  }

  if (formData.phone.length !== 10) {
    errors.phone = "Please enter a valid phone number";
    isValid = false;
  }

  if (formData.password !== formData.verifyPassword) {
    errors.password = "Password does not match";
    errors.verifyPassword = "Password does not match";
    isValid = false;
  }

  return { isValid, errors };
};

import { useFormik } from 'formik';
import * as Yup from 'yup';

export interface ValidationSchema {
  [key: string]: any;
}

export interface FormValues {
  [key: string]: any;
}

export const useFormValidation = <T extends FormValues>(
  initialValues: T,
  validationSchema: ValidationSchema,
  onSubmit: (values: T) => void | Promise<void>
) => {
  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object().shape(validationSchema),
    onSubmit,
    validateOnChange: true,
    validateOnBlur: true,
  });

  const getFieldError = (fieldName: keyof T): string => {
    return formik.touched[fieldName] && formik.errors[fieldName]
      ? String(formik.errors[fieldName])
      : '';
  };

  const getFieldValue = (fieldName: keyof T): any => {
    return formik.values[fieldName];
  };

  const setFieldValue = (fieldName: keyof T, value: any) => {
    formik.setFieldValue(fieldName, value);
  };

  const setFieldTouched = (fieldName: keyof T, touched: boolean = true) => {
    formik.setFieldTouched(fieldName, touched);
  };

  const resetForm = () => {
    formik.resetForm();
  };

  return {
    formik,
    getFieldError,
    getFieldValue,
    setFieldValue,
    setFieldTouched,
    resetForm,
    isSubmitting: formik.isSubmitting,
    isValid: formik.isValid,
    dirty: formik.dirty,
  };
};

// Common validation schemas
export const commonValidations = {
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])/, 'Password must contain at least one lowercase letter')
    .matches(/^(?=.*[A-Z])/, 'Password must contain at least one uppercase letter')
    .matches(/^(?=.*\d)/, 'Password must contain at least one number')
    .required('Password is required'),
  
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
  
  phone: Yup.string()
    .matches(/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number')
    .min(10, 'Phone number must be at least 10 digits')
    .required('Phone number is required'),
  
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .required('Name is required'),
  
  required: (fieldName: string) => Yup.string().required(`${fieldName} is required`),
};

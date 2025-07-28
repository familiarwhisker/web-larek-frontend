export interface PaymentFormData {
  paymentMethod: 'online' | 'cash' | null;
  address: string;
}

export interface ContactsFormData {
  email: string;
  phone: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  submitButtonDisabled: boolean;
}

export interface CustomerLogin {
  email: string;
  password: string;
}

export interface ResponseCustomerLogin {
  success?: boolean;
  token?: string;
}

export interface CustomerJWTCustomer {
  key: string;
  name: string;
  email: string;
}

export interface CustomerJWTData {
  exp: number;
  user: CustomerJWTCustomer;
}

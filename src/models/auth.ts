export interface LoginRequest {
  email: string;
  password: string;
}
export interface AccessTokenResponse {
  fullname: string;
  email: string;
  token: string;
  role: string;
  redirectUrl: string;
  authorities: string[];
}

export interface RegisterRequest {
  name: string;
  address: string;
  email: string;
  tax_code: string;
  website: string;
  logo: string;
  password: string;
}

export interface VerifyRequest {
  email: string;
  otp: string;
}

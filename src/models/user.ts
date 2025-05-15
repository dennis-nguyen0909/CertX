export interface UserOfDepartment {
  id: number;
  name: string;
  email: string;
  permissions: string[];
  locked: boolean;
}

export interface User {
  name: string;
  email: string;
  address: string;
  taxCode: string;
  website: string;
  logo: string;
}

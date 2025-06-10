export interface UserOfDepartment {
  id: number;
  name: string;
  email: string;
  permissions: string[];
  locked: boolean;
}

export interface User {
  id?: number;
  name: string;
  email: string;
  address: string;
  taxCode: string;
  website: string;
  logo: string;
}

export interface UserDepartment {
  nameDepartment: string;
  email: string;
  universityResponse: {
    id?: number;
    name: string;
    email: string;
    address: string;
    taxCode: string;
    website: string;
    logo: string;
  };
}

export interface Degree {
  id: number;
  nameStudent: string;
  className: string;
  department: string;
  departmentName?: string;
  issueDate: string;
  status: string;
  graduationYear: string;
  diplomaNumber: string;
  createdAt: string;

  university?: string;
  studentCode?: string;
  email?: string;
  birthDate?: string;
  course?: string;
  signer?: string;
  imageUrl?: string;
  ipfsUrl?: string | null;
  qrCodeUrl?: string | null;
  transactionHash?: string | null;
  lotteryNumber?: string;
  studentId?: number;
  ratingId?: number;
  degreeTitleId?: number;
  educationModeId?: number;
  trainingLocation?: string;
}

export interface DegreeTitle {
  id: number;
  name: string;
}

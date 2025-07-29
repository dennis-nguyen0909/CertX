export interface Degree {
  id: number;
  nameStudent: string;
  className: string;
  departmentName: string;
  issueDate: string;
  status: string;
  graduationYear: string;
  diplomaNumber: string;
  createdAt: string;
  rejectedNote?: string;
  university: string;
  studentCode: string;
  email: string;
  birthDate: string;
  course: string;
  signer: string;
  imageUrl: string;
  ipfsUrl: string | null;
  qrCodeUrl: string | null;
  transactionHash: string | null;
  lotteryNumber: string;
  studentId: number;
  ratingId: number;
  ratingName: string;
  degreeTitleId: number;
  degreeTitleName: string;
  educationModeId: number;
  educationModeName: string;
  trainingLocation?: string;
}

export interface DegreeTitle {
  id: number;
  name: string;
}

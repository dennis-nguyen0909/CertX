export interface Log {
  id: number;
  actionType: string;
  description: string;
  entityId: number | null;
  entityName: string;
  ipAddress: string;
  userId: number;
  actionChange?: ActionChange[];
}

type ActionChange = {
  fieldName: string;
  id: number;
  oldValue: string;
  newValue: string;
};

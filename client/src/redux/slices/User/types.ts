export interface UserState {
  email: string | null;
  token: string | null;
  role: string | null;
  _id: string | null;
  fullName: string | null;
  phoneNumber: string | null;
}

export interface UserData {
  email?: string;
  fullName?: string;
  phoneNumber?: string;
}

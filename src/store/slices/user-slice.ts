import { User, UserDepartment } from "@/models/user";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  userDetail: User | null;
  userDetailKhoa: UserDepartment | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  userDetail: null,
  userDetailKhoa: null,
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserDetail: (state: UserState, action: PayloadAction<User>) => {
      state.userDetail = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setUserDetailKhoa: (
      state: UserState,
      action: PayloadAction<UserDepartment>
    ) => {
      state.userDetailKhoa = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setLoading: (state: UserState, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state: UserState, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearUserData: (state: UserState) => {
      state.userDetail = null;
      state.userDetailKhoa = null;
      state.error = null;
    },
  },
});

export const {
  setUserDetail,
  setUserDetailKhoa,
  setLoading,
  setError,
  clearUserData,
} = userSlice.actions;

export default userSlice.reducer;

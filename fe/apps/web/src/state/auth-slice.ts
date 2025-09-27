import type { User } from '@/types/user.type'
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface AuthContextState {
  currentUser: User | null
  isAuthenticating: boolean
}

const authContextInitialState: AuthContextState = {
  currentUser: null,
  isAuthenticating: false
}

const authSlice = createSlice({
  name: 'authSlice',
  initialState: authContextInitialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<User | null>) => {
      state.currentUser = action.payload
    },
    clearCurrentUser: (state) => {
      state.currentUser = null
    },
    setIsAuthenticating: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticating = action.payload
    }
  }
})

export const { setCurrentUser, clearCurrentUser, setIsAuthenticating } =
  authSlice.actions

export default authSlice.reducer

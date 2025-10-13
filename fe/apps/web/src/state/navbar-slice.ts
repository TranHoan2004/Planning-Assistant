import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  activeItem: '' // default
}

const navbarSlice = createSlice({
  name: 'navbarSlice',
  initialState,
  reducers: {
    setActiveItem: (state, action) => {
      state.activeItem = action.payload
    }
  }
})

export const { setActiveItem } = navbarSlice.actions
export default navbarSlice.reducer

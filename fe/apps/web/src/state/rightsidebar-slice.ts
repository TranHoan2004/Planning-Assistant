import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface RightSidebarContextState {
  activeRightBarItem: 'Hotels' | 'Map' | 'Itineraries' | 'Flights'
  isCollapsed: boolean
}

const initialState: RightSidebarContextState = {
  activeRightBarItem: 'Map',
  isCollapsed: false
}

const rightsidebarSlice = createSlice({
  name: 'rightsidebarSlice',
  initialState,
  reducers: {
    setActiveRightBarItem: (
      state,
      action: PayloadAction<'Hotels' | 'Map' | 'Itineraries' | 'Flights'>
    ) => {
      state.activeRightBarItem = action.payload
    },
    setIsCollapsed: (state, action: PayloadAction<true | false>) => {
      state.isCollapsed = action.payload
    }
  }
})

export const { setActiveRightBarItem, setIsCollapsed } =
  rightsidebarSlice.actions
export default rightsidebarSlice.reducer

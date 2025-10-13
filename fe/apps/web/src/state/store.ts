import { configureStore } from '@reduxjs/toolkit'
import authReducer from './auth-slice'
import navbarReducer from './navbar-slice'
import rightsidebarReducer from './rightsidebar-slice'

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      navbar: navbarReducer,
      rightsidebar: rightsidebarReducer
    },
    devTools: process.env.NODE_ENV !== 'production'
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

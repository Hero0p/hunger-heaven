import React from 'react'

import './App.css'
import './styles/theme.css'
import AppRoutes from './routes/AppRoutes'

import { FlashMessageProvider } from './context/FlashMessageContext'
import { UserProvider } from './context/UserContext'
import FlashMessage from './components/common/FlashMessage'

function App() {


  return (
    <FlashMessageProvider>
      <UserProvider>
        <FlashMessage />
        <AppRoutes />
      </UserProvider>
    </FlashMessageProvider>
  )
}

export default App

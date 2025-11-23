import { useState } from 'react'
import { LoginPage } from './views/LoginPage'
import { DashboardPage } from './views/DashboardPage'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
  }

  return <DashboardPage />;
}

export default App

import { useAuth } from './auth/AuthContext'
import { LoginPage } from './views/LoginPage'
import { DashboardPage } from './views/DashboardPage'

function App() {
  const { user } = useAuth();

  if (!user) {
    return <LoginPage />;
  }

  return <DashboardPage />;
}

export default App

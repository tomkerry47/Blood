import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import './App.css';

function AppContent() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return session ? <Dashboard /> : <Login />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

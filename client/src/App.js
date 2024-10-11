import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import ProtectedRoute from './components/ProtectedRoute'; // Remplacer PrivateRoute par ProtectedRoute
import AddMember from './components/AddMember';
import MemberList from './components/MemberList';
import Logout from './components/Logout';
import Profile from './components/Profile';
import FamilyDiagram from './components/FamilyDiagram';
import EditMember from './components/EditMember';
import MemberDetail from './components/MemberDetail';
import StepperComponent from './components/StepperComponent';
import NotFound from './components/Notfound';
import Unauthorized from './components/Unauthorized'; // Page non autorisée
import RedirectIfVisited from './components/RedirectIfVisited';
import { AuthProvider } from './context/AuthContext'; // Importer AuthProvider
import { FamilyProvider } from './context/FamilyContext'; // Importer FamilyProvider
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import RoleBasedRoute from './components/RoleBasedRoute';
import FamilyRegistration from './components/FamilyRegistration';
import './App.css';
import UserMember from './components/UserAddToMember';
import UserInfo from './components/EditUserInfo';

function App() {
  return (
    <Router>
      <AuthProvider> {/* Fournir AuthProvider ici */}
        <FamilyProvider> {/* Fournir FamilyProvider ici */}
          <RedirectIfVisited /> {/* Inclure le composant RedirectIfVisited */}
          <div>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<StepperComponent />} />
              <Route path="/family-registration" element={<FamilyRegistration />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              {/* Protected Routes */}
              <Route path="/home" element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } />
              <Route path="/add-member" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['ADMIN']}>
                    <AddMember />
                  </RoleBasedRoute>
                </ProtectedRoute>
              } />
              <Route path="/members-list" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['ADMIN', 'USER']}>
                    <MemberList />
                  </RoleBasedRoute>
                </ProtectedRoute>
              } />
              <Route path="/detail/:id" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['ADMIN', 'USER']}>
                    <MemberDetail />
                  </RoleBasedRoute>
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/family-diagram" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['ADMIN', 'USER']}>
                    <FamilyDiagram />
                  </RoleBasedRoute>
                </ProtectedRoute>
              } />
              <Route path="/modifier/:id" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['ADMIN']}>
                    <EditMember />
                  </RoleBasedRoute>
                </ProtectedRoute>
              } />
              {/* Route pour la page non autorisée */}
              <Route path="/unauthorized" element={<Unauthorized />} />
              {/* Route pour la page 404 */}
              <Route path="*" element={<NotFound />} />
              <Route path="/user-member" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['ADMIN', 'USER']}>
                    <UserMember />
                  </RoleBasedRoute>
                </ProtectedRoute>
              } />
              <Route path="/user-detail/edit" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['ADMIN', 'USER']}>
                    <UserInfo />
                  </RoleBasedRoute>
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </FamilyProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
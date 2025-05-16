import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm';
import { useAuth } from '../hooks/useAuth';
import { TruckIcon } from 'lucide-react';

const RegisterPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-12 w-12 bg-blue-800 text-white rounded-full flex items-center justify-center">
            <TruckIcon className="h-6 w-6" />
          </div>
        </div>
        <h1 className="mt-3 text-center text-3xl font-extrabold text-gray-900">
          DeliveryDash
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          Join our delivery partner network
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
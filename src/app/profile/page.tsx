'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import DashboardLayout from '@/components/layout/DashboardLayout/DashboardLayout';
import Card from '@/components/ui/Card/Card';
import Button from '@/components/ui/Button/Button';
import Input from '@/components/ui/Input/Input';
import Modal from '@/components/ui/Modal/Modal';
import { useAuth } from '@/contexts/AuthContext';
import UserService from '@/services/user.service';
import PeopleService from '@/services/people.service';
import AuthService from '@/services/auth.service';
import { UpdateUserRequest } from '@/types/user.types';
import { UpdatePeopleRequest, People } from '@/types/people.types';
import { ChangePasswordRequest } from '@/types/auth.types';

/**
 * Profile page - User profile management
 */
export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<People | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Setup form for profile update
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UpdatePeopleRequest>();

  // Setup form for password change
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    reset: resetPasswordForm,
  } = useForm<ChangePasswordRequest>();

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?._id) {
        console.log('No hay ID de usuario disponible:', user);
        return;
      }
  
      console.log('=== INICIO FETCHPROFILE ===');
      console.log('Intentando obtener perfil para usuario:', user._id);
      
      try {
        setLoading(true);
        
        // Verificar token
        const token = localStorage.getItem('accessToken');
        console.log('Token disponible:', !!token);
        
        const data = await PeopleService.getPeopleByUserId(user._id);
        console.log('Datos de perfil recibidos:', data);
        
        if (data) {
          console.log('Estableciendo perfil en el estado:', data);
          setProfile(data);
          
          // Pre-rellenar formulario con los valores actuales
          console.log('Pre-rellenando formulario con:', {
            firstName: data.firstName,
            lastName: data.lastName,
            profileImage: data.profileImage || '',
          });
          
          setValue('firstName', data.firstName);
          setValue('lastName', data.lastName);
          setValue('profileImage', data.profileImage || '');
        } else {
          console.error('No se recibieron datos de perfil');
          setError('No se pudo cargar la información del perfil');
        }
      } catch (err: any) {
        console.error('Error al obtener perfil:', err);
        console.error('Mensaje de error:', err.message);
        setError(err.message || 'No se pudo cargar el perfil. Por favor, inténtalo de nuevo más tarde.');
      } finally {
        setLoading(false);
        console.log('=== FIN FETCHPROFILE ===');
      }
    };
  
    fetchProfile();
  }, [user, setValue]);

  // Update profile
  const handleProfileUpdate = async (data: UpdatePeopleRequest) => {
    if (!profile) return;
    
    setUpdating(true);
    setError(null);
    setSuccess(null);

    try {
      const updatedProfile = await PeopleService.updatePeople(profile._id, data);
      setProfile(updatedProfile);
      setSuccess('Perfil actualizado correctamente');
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Error al actualizar el perfil');
    } finally {
      setUpdating(false);
    }
  };

  // Change password
  const handlePasswordChange = async (data: ChangePasswordRequest) => {
    setUpdating(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await AuthService.changePassword(data);
      setSuccess(response.message);
      resetPasswordForm();
      setIsPasswordModalOpen(false);
    } catch (err: any) {
      console.error('Error changing password:', err);
      setError(err.response?.data?.message || 'Error al cambiar la contraseña');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Mi Perfil</h1>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Profile Info Card */}
          <Card 
            title="Información de Perfil"
            className="lg:col-span-2"
          >
            <form onSubmit={handleSubmit(handleProfileUpdate)} className="p-4">
              {error && (
                <div className="mb-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md p-3">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}
              
              {success && (
                <div className="mb-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-md p-3">
                  <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
                </div>
              )}
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label="Nombre"
                  id="firstName"
                  error={errors.firstName?.message}
                  {...register('firstName', {
                    required: 'El nombre es requerido',
                  })}
                />
                
                <Input
                  label="Apellido"
                  id="lastName"
                  error={errors.lastName?.message}
                  {...register('lastName', {
                    required: 'El apellido es requerido',
                  })}
                />
              </div>
              
              <Input
                label="URL de Imagen de Perfil"
                id="profileImage"
                placeholder="https://ejemplo.com/mi-imagen.jpg"
                className="mt-4"
                error={errors.profileImage?.message}
                {...register('profileImage')}
              />
              
              <div className="mt-6 flex justify-end">
                <Button
                  type="submit"
                  isLoading={updating}
                  disabled={updating}
                >
                  Actualizar Perfil
                </Button>
              </div>
            </form>
          </Card>
          
          {/* Account Actions Card */}
          <Card title="Cuenta">
            <div className="p-4">
              <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Email:</p>
                <p className="font-medium text-gray-900 dark:text-white">{user?.email}</p>
              </div>
              
              <Button 
                variant="outline"
                onClick={() => setIsPasswordModalOpen(true)}
                className="w-full mb-2"
              >
                Cambiar Contraseña
              </Button>
            </div>
          </Card>
        </div>
      )}
      
      {/* Change Password Modal */}
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title="Cambiar Contraseña"
        size="md"
      >
        <form onSubmit={handleSubmitPassword(handlePasswordChange)} className="space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md p-3">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}
          
          <Input
            label="Contraseña Actual"
            type="password"
            id="currentPassword"
            error={passwordErrors.currentPassword?.message}
            {...registerPassword('currentPassword', {
              required: 'La contraseña actual es requerida',
            })}
          />
          
          <Input
            label="Nueva Contraseña"
            type="password"
            id="newPassword"
            error={passwordErrors.newPassword?.message}
            {...registerPassword('newPassword', {
              required: 'La nueva contraseña es requerida',
              minLength: {
                value: 6,
                message: 'La contraseña debe tener al menos 6 caracteres',
              },
            })}
          />
          
          <div className="flex justify-end space-x-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setIsPasswordModalOpen(false)}
              disabled={updating}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              isLoading={updating}
              disabled={updating}
            >
              Cambiar Contraseña
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
import { useQuery, useMutation } from '@tanstack/react-query'
import { authAPI } from '@/lib/api-endpoints'
import { useAuthStore } from './useAuth'

export const useLogin = () => {
  const { setUser, setToken } = useAuthStore()

  return useMutation({
    mutationFn: authAPI.login,
    onSuccess: (response) => {
      localStorage.setItem('access_token', response.data.access)
      localStorage.setItem('refresh_token', response.data.refresh)
      setUser(response.data.user)
      setToken(response.data.access)
    },
  })
}

export const useGoogleLogin = () => {
  const { setUser, setToken } = useAuthStore()

  return useMutation({
    mutationFn: authAPI.googleLogin,
    onSuccess: (response) => {
      localStorage.setItem('access_token', response.data.access)
      localStorage.setItem('refresh_token', response.data.refresh)
      setUser(response.data.user)
      setToken(response.data.access)
    },
  })
}

export const useRegister = () => {
  return useMutation({
    mutationFn: authAPI.register,
  })
}

export const useLogout = () => {
  const { logout } = useAuthStore()

  return useMutation({
    mutationFn: authAPI.logout,
    onSuccess: () => {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      logout()
    },
  })
}

export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: authAPI.profile,
  })
}
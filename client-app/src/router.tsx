import { createBrowserRouter, redirect } from "react-router";
import { axiosInstance } from "./lib/api";
import Loading from "./components/Loading";
import { lazy } from "react";

const MainLayout = lazy(() => import('./layouts/MainLayout'))
const AccessLog = lazy(() => import('./pages/AccessLog/AccessLog'))
const Login = lazy(() => import('./pages/Login'))
const AuthLayout = lazy(() => import('./layouts/AuthLayout'))
const Users = lazy(() => import('./pages/Users/Users'))
const Gates = lazy(() => import('./pages/Gate/Gates'))

const authLoader = async () => {
  try {
    const { data: user } = await axiosInstance.get('/auth/me');
    return { user }
  } catch (error: unknown) {
    console.error(error);
    return redirect('/login');
  }
}

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    loader: authLoader,
    hydrateFallbackElement: <Loading />,
    children: [
      { index: true, element: <AccessLog /> },
      { path: '/users', element: <Users /> },
      { path: '/gates', element: <Gates /> },
    ],
  },
  {
    path: '/login',
    element: <AuthLayout />,
    children: [
      { index: true, element: <Login /> },
    ],
  },
])
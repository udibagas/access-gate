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
const Cameras = lazy(() => import('./pages/Camera/Cameras'))
const Readers = lazy(() => import('./pages/Reader/Readers'))
const Members = lazy(() => import('./pages/Member/Members'))
const Snapshot = lazy(() => import('./pages/Snapshot/Snapshot'))

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
      { path: '/cameras', element: <Cameras /> },
      { path: '/readers', element: <Readers /> },
      { path: '/members', element: <Members /> },
      { path: '/snapshot', element: <Snapshot /> },
      { path: '*', element: <>Not Found</> },
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
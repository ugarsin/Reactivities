import { createBrowserRouter, Navigate } from "react-router";
import App from "../layout/App";
import HomePage from "../../features/home/HomePage";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import ActivityForm from "../../features/activities/form/ActivityForm";
import ActivityDetails from "../../features/activities/details/ActivityDetails";
import Counter from "../../features/counter/Counter";
import TestErrors from "../../features/errors/TestErrors";
import NotFound from "../../features/errors/NotFound";
import ServerError from "../../features/errors/ServerError";
import LoginForm from "../../features/account/LoginForm";
import RegisterForm from "../../features/account/RegisterForm";
import RequireAuth from "./RequireAuth";

export const router = createBrowserRouter([
  {
    path: "/", element: <App />, 
    children: [
      {element: <RequireAuth></RequireAuth>, children: [
        {path: "activities", element: <ActivityDashboard />},
        {path: "activities/:id", element: <ActivityDetails />},
        {path: "createActivity", element: <ActivityForm key="create" />},
        {path: "manage/:id", element: <ActivityForm />},
      ]},
      {path: "", element: <HomePage />},
      {path: "counter", element: <Counter />},
      {path: "errors", element: <TestErrors />},
      {path: "notfound", element: <NotFound />},
      {path: "servererror", element: <ServerError />},
      {path: "login", element: <LoginForm />},
      {path: "register", element: <RegisterForm />},
      {path: "*", element: <Navigate replace to="/notfound" />},
    ]
  }
])
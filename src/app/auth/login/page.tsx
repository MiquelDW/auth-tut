import LoginForm from "@/components/auth/LoginForm";
import { Suspense } from "react";

const Login = () => {
  return (
    // display fallback UI  until the children have finished loading
    // the hook "useSearchParams" inside the "LoginForm" component expects to be wrapped in a <Suspense> component
    <Suspense>
      <LoginForm />
    </Suspense>
  );
};

export default Login;

import NewPasswordForm from "@/components/auth/NewPasswordForm";
import { Suspense } from "react";

const NewPassword = () => {
  return (
    // display fallback UI  until the children have finished loading
    // the hook "useSearchParams" inside the "NewPasswordForm" component expects to be wrapped in a <Suspense> component
    <Suspense>
      <NewPasswordForm />
    </Suspense>
  );
};

export default NewPassword;

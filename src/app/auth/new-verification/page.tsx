import NewVerificationForm from "@/components/auth/NewVerificationForm";
import { Suspense } from "react";

const NewVerification = () => {
  return (
    // display fallback UI until the children have finished loading
    // the hook "useSearchParams" inside the "NewVerificationForm" component expects to be wrapped in a <Suspense> component
    <Suspense>
      <NewVerificationForm />
    </Suspense>
  );
};

export default NewVerification;

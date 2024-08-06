"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { BeatLoader } from "react-spinners";
import CardWrapper from "./CardWrapper";
// in non-page components, (dynamic) query parameters are not passed as a prop
// use the 'useSearchParams' hook to access the dynamic query parameters from the current URL
import { useSearchParams } from "next/navigation";
import { newVerification } from "@/actions/new-verification";
import FormError from "../FormError";
import FormSuccess from "../FormSuccess";

const NewVerificationForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  // variable 'isPending' keeps track of whether a transition is currently running
  const [isPending, startTransition] = useTransition();

  // retrieve the (dynamic) query parameter(s) from the current URL
  const searchParams = useSearchParams();
  // retrieve the value of the dynamic query parameter "token"
  const token = searchParams.get("token");

  // callback function to handle onSubmit event
  // cache function definition between re-renders because its inside an useEffect
  const onSubmit = useCallback(() => {
    // clear messages
    setError("");
    setSuccess("");

    // display error if value of query param is null, undefined etc
    if (!token) {
      setError("Missing token!");
      // break function
      return;
    }

    // verify user's email
    startTransition(() => {
      newVerification(token)
        .then((data) => {
          if (data?.error) {
            // display error message
            setError(data?.error);
          }

          if (data?.success) {
            // display success message
            setSuccess(data?.success);
          }
        })
        .catch(() => {
          setError("Something went wrong!");
        });
    });
  }, [token]);

  // useEffect that calls the onSubmit function
  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <CardWrapper
      headerLabel="Confirming your verification"
      backButtonLabel="Back to login"
      backButtonHref="auth/login"
    >
      <div className="flex w-full items-center justify-center">
        {isPending ? (
          <BeatLoader />
        ) : (
          <>
            <FormSuccess message={success} />
            {/* only show error if there's no succes */}
            {!success && <FormError message={error} />}
          </>
        )}
      </div>
    </CardWrapper>
  );
};

export default NewVerificationForm;

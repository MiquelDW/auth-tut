"use client";

import * as z from "zod";
import CardWrapper from "./CardWrapper";
// in non-page components, (dynamic) query parameters are not passed as a prop
// use the 'useSearchParams' hook to access the dynamic query parameters from the current URL
import { useSearchParams } from "next/navigation";
// you can show a loading state during operations (function, redirecting user etc) with the 'startTransition' function
import { useState, useTransition } from "react";
// hook that handles form state and validation
import { useForm } from "react-hook-form";
// resolver function validates the form data against the defined schema whenever the form is submitted or its values change
import { zodResolver } from "@hookform/resolvers/zod";
import { NewPasswordSchema } from "@/schemas";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import FormError from "../FormError";
import FormSuccess from "../FormSuccess";
import { newPassword } from "@/actions/new-password";

const NewPasswordForm = () => {
  // retrieve the (dynamic) query parameter(s) from the current URL
  const searchParams = useSearchParams();
  // retrieve the value of the dynamic query parameter "token"
  const token = searchParams.get("token");

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  // variable 'isPending' keeps track of whether a transition is currently running
  const [isPending, startTransition] = useTransition();

  // set up the form with type inference and validation (using zod)
  // zod uses TS to infer the type of the (form) data based on the 'NewPasswordSchema'
  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    // validate submitted or changed form data against 'NewPasswordSchema'
    resolver: zodResolver(NewPasswordSchema),
    // specify initial values for form field
    defaultValues: {
      password: "",
    },
  });

  // callback function that handles onSubmit event of form
  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    // clear messages
    setError("");
    setSuccess("");

    // display error if token doesn't exist
    if (!token) {
      setError("Missing token!");
      // break function
      return;
    }

    // reset the password
    startTransition(() => {
      newPassword(values, token)
        .then((data) => {
          if (data?.error) {
            // reset form and display error message
            form.reset();
            setError(data?.error);
          }

          if (data?.success) {
            // reset form and display success message
            form.reset();
            setSuccess(data?.success);
          }
        })
        .catch(() => setError("Something went wrong!"));
    });
  };

  return (
    <CardWrapper
      headerLabel="Enter a new password"
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {/* Password form field */}
            <FormField
              // manage the state and validation of this form field
              control={form.control}
              // specify which field from the schema it's dealing with
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      // 'field' object contains the necessary props and methods to connect the input field with react-hook-form's state management
                      {...field}
                      disabled={isPending}
                      placeholder="********"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormError message={error} />
          <FormSuccess message={success} />

          {/* submit button */}
          <Button type="submit" className="w-full">
            {isPending ? "Please wait..." : "Reset password"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default NewPasswordForm;

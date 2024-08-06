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
import { LoginSchema } from "@/schemas";
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
import { login } from "@/actions/login";
import Link from "next/link";

const LoginForm = () => {
  // retrieve the (dynamic) query parameter(s) from the current URL
  const searchParams = useSearchParams();
  // retrieve the value of the dynamic query parameter "error"
  const urlError = searchParams.get("error");
  // determine the error message based on the retrieved value
  const errorMessage =
    urlError === "OAuthAccountNotLinked"
      ? "Email already in use with different provider!"
      : "";

  const [showTwoFactor, setShowTwoFactor] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  // variable 'isPending' keeps track of whether a transition is currently running
  const [isPending, startTransition] = useTransition();

  // set up the form with type inference and validation (using zod)
  // zod uses TS to infer the type of the form data based on the 'LoginSchema'
  const form = useForm<z.infer<typeof LoginSchema>>({
    // validate submitted or changed form data against 'LoginSchema'
    resolver: zodResolver(LoginSchema),
    // specify initial values for form fields
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // callback function that handles onSubmit event of form
  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    // clear messages
    setError("");
    setSuccess("");

    // log the user in
    startTransition(() => {
      login(values)
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

          if (data?.twoFactor) {
            // display input for user to put in 2FA code
            setShowTwoFactor(true);
          }
        })
        .catch(() => setError("Something went wrong!"));
    });
  };

  return (
    <CardWrapper
      headerLabel="Welcome back"
      backButtonHref="/auth/register"
      backButtonLabel="Don't have an account?"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {/* Email form field */}
            <FormField
              // manage the state and validation of this form field
              control={form.control}
              // specify which field from the schema it's dealing with
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      // 'field' object contains the necessary props and methods to connect the input field with react-hook-form's state management
                      {...field}
                      disabled={isPending}
                      placeholder="john.doe@example.com"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                  <Button
                    size="sm"
                    variant="link"
                    // change the default rendered element to the one passed as a child, merging their props and behavior
                    asChild
                    className="px-0 font-normal"
                  >
                    <Link href="/auth/reset">Forgot password?</Link>
                  </Button>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormError message={error || errorMessage} />
          <FormSuccess message={success} />

          {/* submit button */}
          <Button type="submit" className="w-full">
            {isPending ? "Logging in..." : "Login"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default LoginForm;

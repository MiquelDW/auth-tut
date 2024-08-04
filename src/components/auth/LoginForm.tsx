"use client";

import * as z from "zod";
import CardWrapper from "./CardWrapper";

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

const LoginForm = () => {
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
      login(values).then((data) => {
        setError(data.error);
        setSuccess(data.success);
      });
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
                      // field object contains the necessary props and methods to connect the input field with react-hook-form's state management
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
                      // field object contains the necessary props and methods to connect the input field with react-hook-form's state management
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
            {isPending ? "Logging in..." : "Login"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default LoginForm;

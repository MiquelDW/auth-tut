"use client";

import * as z from "zod";
import CardWrapper from "./CardWrapper";
// you can show a loading state during operations (function, redirecting user etc) with the 'startTransition' function
import { useState, useTransition } from "react";
// hook that handles form state and validation
import { useForm } from "react-hook-form";
// resolver function validates the form data against the defined schema whenever the form is submitted or its values change
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetSchema } from "@/schemas";
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
import { reset } from "@/actions/reset";

const ResetForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  // variable 'isPending' keeps track of whether a transition is currently running
  const [isPending, startTransition] = useTransition();

  // set up the form with type inference and validation (using zod)
  // zod uses TS to infer the type of the form data based on the 'ResetSchema'
  const form = useForm<z.infer<typeof ResetSchema>>({
    // validate submitted or changed form data against 'ResetSchema'
    resolver: zodResolver(ResetSchema),
    // specify initial values for form field
    defaultValues: {
      email: "",
    },
  });

  // callback function that handles onSubmit event of form
  const onSubmit = (values: z.infer<typeof ResetSchema>) => {
    // clear messages
    setError("");
    setSuccess("");

    // generate reset password token and send the reset password email
    startTransition(() => {
      reset(values)
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
      headerLabel="Forgot your password?"
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
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
          </div>

          <FormError message={error} />
          <FormSuccess message={success} />

          {/* submit button */}
          <Button type="submit" className="w-full">
            {isPending ? "Please wait..." : "Send reset email"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default ResetForm;

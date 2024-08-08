"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { settings } from "@/actions/settings";
// you can show a loading state during operations (function, redirecting user etc) with the 'startTransition' function
import { useTransition, useState } from "react";
import { useSession } from "next-auth/react";
import * as z from "zod";
// hook that handles form state and validation
import { useForm } from "react-hook-form";
import { SettingsSchema } from "@/schemas";
// resolver function validates the form data against the defined schema whenever the form is submitted or its values change
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/hooks/use-current-user";

const Settings = () => {
  // retrieve the user's data from the session object
  const user = useCurrentUser();

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const { update } = useSession();

  // set up the form with type inference and validation (using zod)
  // zod uses TS to infer the type of the (form) data based on the 'SettingsSchema'
  const form = useForm<z.infer<typeof SettingsSchema>>({
    // validate submitted or changed form data against 'SettingsSchema'
    resolver: zodResolver(SettingsSchema),
    // specify initial values for form fields
    defaultValues: {
      name: user?.name || undefined,
    },
  });

  // variable 'isPending' keeps track of whether a transition is currently running
  const [isPending, startTransition] = useTransition();

  // callback function to handle onSubmit event
  const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
    // change the settings of the user
    startTransition(() => {
      settings(values)
        .then((data) => {
          if (data.success) {
            setSuccess(data.success);
            // update session data everytime the user's data has been successfully updated in db
            update();
          }
          if (data.error) {
            setError(data.error);
          }
        })
        .catch(() => setError("something went wrong!"));
    });
  };

  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className="text-center text-2xl font-semibold">⚙️Settings</p>
      </CardHeader>

      <CardContent className="flex items-center justify-center">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Name form field */}
            <FormField
              // manage the state and validation of this form field
              control={form.control}
              // specify which field from the schema it's dealing with
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      // 'field' object contains the necessary props and methods to connect the input field with react-hook-form's state management
                      {...field}
                      disabled={isPending}
                      placeholder="john.doe@example.com"
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={isPending} type="submit">
              {isPending ? "Updating..." : "Save"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default Settings;

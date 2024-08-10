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
import FormSuccess from "@/components/FormSuccess";
import FormError from "@/components/FormError";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { UserRole } from "@prisma/client";
import { Switch } from "@/components/ui/switch";

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
      email: user?.email || undefined,
      isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined,
      password: undefined,
      newPassword: undefined,
      role: user?.role || undefined,
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
            // update session data everytime the user's data has been successfully updated in db
            // passwords are not stored in the session
            update({
              user: {
                name: data.updatedUser?.name,
                email: data.updatedUser?.email,
                isTwoFactorEnabled: data.updatedUser?.isTwoFactorEnabled,
                role: data.updatedUser?.role,
              },
            });
            setSuccess(data.success);
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
                      placeholder="John Doe"
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {user?.isOAuth === false && (
              <>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* New Password form field */}
                <FormField
                  // manage the state and validation of this form field
                  control={form.control}
                  // specify which field from the schema it's dealing with
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
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

                {/* Role form field (only for admins or during Development) */}
                <FormField
                  // manage the state and validation of this form field
                  control={form.control}
                  // specify which field from the schema it's dealing with
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select
                        disabled={isPending}
                        // update the value of the form field when the user interacts with it
                        onValueChange={field.onChange}
                        // show curent value of the form field
                        value={field.value || ""}
                      >
                        <FormControl>
                          {/* button that triggers the select menu */}
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role"></SelectValue>
                          </SelectTrigger>
                        </FormControl>

                        {/* this component pops out when the dropdown menu is triggered */}
                        <SelectContent>
                          <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                          <SelectItem value={UserRole.USER}>User</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Two-Factor Authentication form field */}
                <FormField
                  // manage the state and validation of this form field
                  control={form.control}
                  // specify which field from the schema it's dealing with
                  name="isTwoFactorEnabled"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between gap-x-10 rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Two Factor Authentication</FormLabel>
                        <FormDescription>
                          Enable two factor authentication for your account
                        </FormDescription>
                      </div>

                      <FormControl>
                        <Switch
                          disabled={isPending}
                          // show curent value of the form field
                          checked={field.value}
                          // update the value of the form field when the user interacts with it
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <FormError message={error} />
            <FormSuccess message={success} />

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

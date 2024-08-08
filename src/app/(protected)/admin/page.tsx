"use client";

import RoleGate from "@/components/auth/RoleGate";
import FormSuccess from "@/components/FormSuccess";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UserRole } from "@prisma/client";
// the useToast hook returns a toast function that you can use to display the 'Toaster' component
import { adminServerAction } from "@/actions/admin";
// the useToast hook returns a toast function that you can use to display the 'Toaster' component
import { useToast } from "@/components/ui/use-toast";

const Admin = () => {
  const { toast } = useToast();

  // callback function to handle onClick event
  // const onApiRouteClick = () => {
  //   // performing API requests with server actions is more secure and performant...
  //   adminApiCall().then((data) => {
  //     if (data.success) {
  //       toast({
  //         title: "Allowed!",
  //         description: "You are allowed to use this API endpoint!",
  //         variant: "default",
  //       });
  //     }
  //     if (data.error) {
  //       toast({
  //         title: "Forbidden!",
  //         description: "You are NOT allowed to use this API endpoint!",
  //         variant: "destructive",
  //       });
  //     }
  //   });
  // };

  const onApiRouteClick = () => {
    fetch("/api/admin").then((response) => {
      if (response.ok) {
        toast({
          title: "Allowed!",
          description: "You are allowed to use this API endpoint!",
          variant: "default",
        });
      } else {
        toast({
          title: "Forbidden!",
          description: "You are NOT allowed to use this API endpoint!",
          variant: "destructive",
        });
      }
    });
  };

  // callback function to handle onClick event
  const onServerActionClick = () => {
    adminServerAction().then((data) => {
      if (data.success) {
        toast({
          title: "Allowed!",
          description: "You are allowed to use this Server Action!",
          variant: "default",
        });
      }
      if (data.error) {
        toast({
          title: "Forbidden!",
          description: "You are NOT allowed to use this Server Action!",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className="text-center text-2xl font-semibold">🗝️Admin</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* only users with the admin role will be able to view this content */}
        <RoleGate allowedRole={UserRole.ADMIN}>
          <FormSuccess message="You are allowed to see this content" />
        </RoleGate>

        <div className="flex items-center justify-between rounded-lg p-3 shadow-md">
          <p className="text-sm font-medium">Admin-only API Route</p>
          <Button onClick={onApiRouteClick}>Click to test</Button>
        </div>

        <div className="flex items-center justify-between rounded-lg p-3 shadow-md">
          <p className="text-sm font-medium">Admin-only Server Action</p>
          <Button onClick={onServerActionClick}>Click to test</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Admin;

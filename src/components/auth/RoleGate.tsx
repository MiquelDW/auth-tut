import { useCurrentRole } from "@/hooks/use-current-role";
import { UserRole } from "@prisma/client";
import FormError from "../FormError";

// predefine object structure for the given 'props' object
interface RoleGateProps {
  children: React.ReactNode;
  allowedRole: UserRole;
}

const RoleGate = ({ children, allowedRole }: RoleGateProps) => {
  // retrieve user's role from the session object
  const role = useCurrentRole();

  // forbid user from viewing the content if its role doesn't match the allowed roles
  if (role !== allowedRole)
    return (
      <FormError message="You do not have permission to view this content" />
    );

  return <>{children}</>;
};

export default RoleGate;

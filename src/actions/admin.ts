"use server";

import { currentRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";

// fix issue with toaster response related to this api call (check coderevolution code)
// export const adminApiCall = async () => {
//   try {
//     const response = await fetch(`http://localhost:3000/api/admin`, {
//       next: { revalidate: 10 },
//     });

//     if (response.ok) {
//       return { success: "Allowed!" };
//     }

//     return { error: "Forbidden!" };
//   } catch (err) {
//     if (err instanceof Error) {
//       // TS now knows that error is of type Error
//       console.error(err.message);
//       return { error: "An error occurred" };
//     } else {
//       // Handle the case where error is not of type Error
//       console.error("An unexpected error occurred", err);
//       return { error: "An error occurred" };
//     }
//   }
// };

export const adminServerAction = async () => {
  // retrieve user's role from the session object
  const role = await currentRole();

  // return success message if user is an admin
  if (role === UserRole.ADMIN) return { success: "Allowed!" };

  // return error message if user is NOT an admin
  return { error: "Forbidden!" };
};

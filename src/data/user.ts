import { db } from "@/lib/db";

export const getUserByEmail = async (email: string) => {
  try {
    // retrieve user entry from db by the given 'email'
    const user = await db.user.findUnique({
      where: {
        email: email,
      },
    });

    return user;
  } catch (err) {
    if (err instanceof Error) {
      // TS now knows that error is of type Error
      console.error(err.message);
    } else {
      // Handle the case where error is not of type Error
      console.error("An unexpected error occurred", err);
    }
  }
};

export const getUserById = async (id: string) => {
  try {
    // retrieve user entry from db by the given 'id'
    const user = await db.user.findUnique({
      where: {
        id: id,
      },
    });

    return user;
  } catch (err) {
    if (err instanceof Error) {
      // TS now knows that error is of type Error
      console.error(err.message);
    } else {
      // Handle the case where error is not of type Error
      console.error("An unexpected error occurred", err);
    }
  }
};

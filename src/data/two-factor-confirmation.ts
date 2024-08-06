import { db } from "@/lib/db";

export const getTwoFactorConfirmationByUserId = async (userId: string) => {
  try {
    // get two-factor confirmation entry from db by the given 'userId'
    const twoFactorConfirmation = await db.twoFactorConfirmation.findUnique({
      where: {
        userId: userId,
      },
    });

    return twoFactorConfirmation;
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

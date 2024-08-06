import { db } from "@/lib/db";

export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    // get 'passwordResetToken' entry from db by the given 'token'
    const passwordResetToken = await db.passwordResetToken.findUnique({
      where: { token: token },
    });

    return passwordResetToken;
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

export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    // get 'passwordResetToken' entry from db by the given 'email'
    const passwordResetToken = await db.passwordResetToken.findFirst({
      where: { email: email },
    });

    return passwordResetToken;
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

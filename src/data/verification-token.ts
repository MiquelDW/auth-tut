import { db } from "@/lib/db";

export const getVerificationTokenByToken = async (token: string) => {
  try {
    // get 'VerificationToken' entry from db by the given 'token'
    const verificationToken = await db.verificationToken.findUnique({
      where: { token: token },
    });

    return verificationToken;
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

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    // get 'VerificationToken' entry from db by the given 'email'
    const verificationToken = await db.verificationToken.findFirst({
      where: { email: email },
    });

    return verificationToken;
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

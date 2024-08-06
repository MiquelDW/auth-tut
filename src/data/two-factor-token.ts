import { db } from "@/lib/db";

export const getTwoFactorTokenByToken = async (token: string) => {
  try {
    // get two-factor token entry from db by the given 'token'
    const twoFactorToken = await db.twoFactorToken.findUnique({
      where: {
        token: token,
      },
    });

    return twoFactorToken;
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

export const getTwoFactorTokenByEmail = async (email: string) => {
  try {
    // get two-factor token entry from db by the given 'email'
    const twoFactorToken = await db.twoFactorToken.findFirst({
      where: {
        email: email,
      },
    });

    return twoFactorToken;
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

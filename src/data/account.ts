import { db } from "@/lib/db";

export const getAccountByUserId = async (userId: string) => {
  try {
    // get user's Account entry from db by the given 'userId'
    const account = await db.account.findFirst({
      where: {
        userId: userId,
      },
    });

    return account;
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

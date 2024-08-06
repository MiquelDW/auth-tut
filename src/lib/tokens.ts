import { getVerificationTokenByEmail } from "@/data/verification-token";
import { getPasswordResetTokenByEmail } from "@/data/password-reset-token";
import { v4 as uuidv4 } from "uuid";
import { db } from "./db";

export const generateVerificationToken = async (email: string) => {
  // generate verification token
  const token = uuidv4();
  // define when token should expire (1 hour in the future)
  // 3000 should be 1000, might be due to environment error
  const expires = new Date(new Date().getTime() + 3600 * 3000);

  // check if an existing token has already been sent to the given 'email'
  const existingToken = await getVerificationTokenByEmail(email);
  // remove existing token entry from db that's been sent
  if (existingToken) {
    await db.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  // create new verification token in the db for the given 'email'
  const verificationToken = await db.verificationToken.create({
    data: {
      email: email,
      token: token,
      expires: expires,
    },
  });

  return verificationToken;
};

export const generatePasswordResetToken = async (email: string) => {
  // generate password reset token
  const token = uuidv4();
  // define when token should expire (1 hour in the future)
  // 3000 should be 1000, might be due to environment error
  const expires = new Date(new Date().getTime() + 3600 * 3000);

  // check if an existing token has already been sent to the given 'email'
  const existingToken = await getPasswordResetTokenByEmail(email);
  // remove existing token entry from db that's been sent
  if (existingToken) {
    await db.passwordResetToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  // create new password reset token in the db for the given 'email'
  const passwordResetToken = await db.passwordResetToken.create({
    data: {
      email: email,
      token: token,
      expires: expires,
    },
  });

  return passwordResetToken;
};

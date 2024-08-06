import { Resend } from "resend";

// create new instance of the Resend client using the Resend API key
// this instance can be used to interact with the Resend API to send emails to users
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
  // link that redirects user to a page to verify email
  const verificationLink = `http://localhost:3000/auth/new-verification?token=${token}`;

  // send email to the user
  await resend.emails.send({
    // center of the email, verify your email in <> to send emails from a custom email
    from: "Auth-tut <onboarding@resend.dev>",
    // send email to the user's email
    to: email,
    subject: "Verify your email",
    html: `<p>Click <a href="${verificationLink}">here</a> to confirm email.</p>`,
  });
};

export const sendPasswordEmail = async (email: string, token: string) => {
  // link that redirects user to a page to change password
  const resetLink = `http://localhost:3000/auth/new-password?token=${token}`;

  // send email to the user
  await resend.emails.send({
    // center of the email, verify your email in <> to send emails from a custom email
    from: "Auth-tut <onboarding@resend.dev>",
    // send email to the user's email
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`,
  });
};

export const sendTwoFactorEmail = async (email: string, token: string) => {
  // send email to the user
  await resend.emails.send({
    // center of the email, verify your email in <> to send emails from a custom email
    from: "Auth-tut <onboarding@resend.dev>",
    // send email to the user's email
    to: email,
    subject: "2FA Code",
    html: `<p>Your 2FA code: ${token}</p>`,
  });
};

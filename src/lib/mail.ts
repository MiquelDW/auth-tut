import { Resend } from "resend";

// create new instance of the Resend client using the Resend API key
// this instance can be used to interact with the Resend API to send emails to users
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
  // link that redirects user to a page to verify email
  const confirmLink = `http://localhost:3000/auth/new-verification?token=${token}`;

  // send email to the user
  await resend.emails.send({
    // center of the email, verify your email in <> to send emails from a custom email
    from: "Auth-tut <onboarding@resend.dev>",
    // send email to the user's email (filled in at Stripe checkout session)
    // to: [event.data.object.customer_details.email],
    to: [email],
    subject: "Confirm your email",
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
  });
};

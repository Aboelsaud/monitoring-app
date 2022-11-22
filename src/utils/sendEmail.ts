import * as nodemailer from 'nodemailer';

export const sendEmail = async (data: any, email: string) => {
  let transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    logger: true,
  });
  await transporter.sendMail({
    from: `"monitoring-app"`,
    to: email,
    subject: 'monitoring-app',
    text: data,
  });
};

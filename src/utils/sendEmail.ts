import * as nodemailer from 'nodemailer';

export const sendEmail = async (data: any, email: string) => {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'yousefaboalaoud@gmail.com',
      pass: 'edstobnnjxjuzzko',
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

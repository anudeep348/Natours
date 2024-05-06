const nodemailer = require('nodemailer');
const pug = require('pug');
const { convert } = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Anudeep Chowdary <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // Sending the actual email
  async send(template, subject) {
    // 1) Render HTML based on a pug templates
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        subject,
      },
    );

    // 2) Define Email Options
    const mailOptions = {
      // from: this.from,
      from:
        process.env.NODE_ENV === 'production'
          ? process.env.SENDGRID_EMAIL_FROM
          : this.form,
      to: this.to,
      subject,
      html,
      text: convert(html),
    };

    // 3) Create a transport and send Email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send(`welcome`, `Welcome to the Natours Family!`);
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      `Your Password Reset Token (Valid for 10 minutes)`,
    );
  }
};

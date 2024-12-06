import nodemailer from "nodemailer";
import {
  CLIENT_URL,
  EMAIL_PASSWORD,
  EMAIL_SERVICE,
  EMAIL_USER,
} from "../../config/env";
import { logger } from "./LoggerProvider";
import ResponseError from "../errors/ResponseError";

class EmailProvider {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: EMAIL_SERVICE,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD,
      },
    });
  }

  async sendEmail(to: string, subject: string, html: string) {
    const mailOptions = {
      from: EMAIL_USER,
      to,
      subject,
      html,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      logger.info(`Email sent to ${to}`, { subject });
    } catch (error) {
      logger.error(`Failed to send email to ${to}`, { error });
      throw new ResponseError(500, "Failed to send email");
    }
  }

  async sendVerificationEmail(to: string, token: string) {
    const subject = "Verify your email address";
    const html = `
      <p>Please verify your email address by clicking the link below:</p>
      <a href="${CLIENT_URL}/verify-email?token=${token}&email=${to}">Verify Email</a>
    `;
    await this.sendEmail(to, subject, html);
  }

  async sendPasswordResetEmail(to: string, token: string) {
    const subject = "Password Reset Request";
    const html = `
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${CLIENT_URL}/reset-password?token=${token}">Reset Password</a>
    `;
    await this.sendEmail(to, subject, html);
  }
}

export const emailProvider = new EmailProvider();

import nodemailer from 'nodemailer';

/**
 * Create email transporter
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

/**
 * Send email function
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text content
 * @param {string} options.html - HTML content
 */
export const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `QuickDesk <${process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error('Email could not be sent');
  }
};

/**
 * Send welcome email to new user
 */
export const sendWelcomeEmail = async (user) => {
  const subject = 'Welcome to QuickDesk!';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #3B82F6;">Welcome to QuickDesk!</h2>
      <p>Hello ${user.name},</p>
      <p>Welcome to QuickDesk - your one-stop solution for managing support tickets.</p>
      <p>Your account has been successfully created with the following details:</p>
      <ul>
        <li><strong>Name:</strong> ${user.name}</li>
        <li><strong>Email:</strong> ${user.email}</li>
        <li><strong>Role:</strong> ${user.role}</li>
      </ul>
      <p>You can now log in to your account and start creating tickets or managing support requests.</p>
      <p>If you have any questions, feel free to contact our support team.</p>
      <br>
      <p>Best regards,<br>The QuickDesk Team</p>
    </div>
  `;

  await sendEmail({
    to: user.email,
    subject,
    html
  });
};

/**
 * Send ticket notification email
 */
export const sendTicketNotification = async (ticket, type = 'created') => {
  try {
    let subject, html;

    switch (type) {
      case 'created':
        subject = `New Ticket Created - ${ticket.ticketId}`;
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #3B82F6;">New Ticket Created</h2>
            <p><strong>Ticket ID:</strong> ${ticket.ticketId}</p>
            <p><strong>Title:</strong> ${ticket.title}</p>
            <p><strong>Priority:</strong> ${ticket.priority.toUpperCase()}</p>
            <p><strong>Status:</strong> ${ticket.status}</p>
            <p><strong>Description:</strong></p>
            <p style="background: #f8f9fa; padding: 15px; border-radius: 5px;">${ticket.description}</p>
            <p>You can view and manage this ticket in your QuickDesk dashboard.</p>
            <br>
            <p>Best regards,<br>The QuickDesk Team</p>
          </div>
        `;
        break;

      case 'updated':
        subject = `Ticket Updated - ${ticket.ticketId}`;
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #10B981;">Ticket Updated</h2>
            <p><strong>Ticket ID:</strong> ${ticket.ticketId}</p>
            <p><strong>Title:</strong> ${ticket.title}</p>
            <p><strong>Status:</strong> ${ticket.status}</p>
            <p>Your ticket has been updated. Please check your dashboard for the latest information.</p>
            <br>
            <p>Best regards,<br>The QuickDesk Team</p>
          </div>
        `;
        break;

      case 'resolved':
        subject = `Ticket Resolved - ${ticket.ticketId}`;
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #10B981;">Ticket Resolved</h2>
            <p><strong>Ticket ID:</strong> ${ticket.ticketId}</p>
            <p><strong>Title:</strong> ${ticket.title}</p>
            <p>Great news! Your ticket has been resolved.</p>
            ${ticket.resolution ? `<p><strong>Resolution:</strong></p><p style="background: #f0f9ff; padding: 15px; border-radius: 5px;">${ticket.resolution}</p>` : ''}
            <p>If you're satisfied with the resolution, please consider rating your experience.</p>
            <br>
            <p>Best regards,<br>The QuickDesk Team</p>
          </div>
        `;
        break;

      default:
        return;
    }

    // Send to ticket creator
    if (ticket.createdBy && ticket.createdBy.email) {
      await sendEmail({
        to: ticket.createdBy.email,
        subject,
        html
      });
    }

    // Send to assigned agent (if different from creator)
    if (ticket.assignedTo && ticket.assignedTo.email && 
        ticket.assignedTo._id.toString() !== ticket.createdBy._id.toString()) {
      await sendEmail({
        to: ticket.assignedTo.email,
        subject,
        html
      });
    }
  } catch (error) {
    console.error('Error sending ticket notification:', error);
  }
};

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  
  const subject = 'Password Reset Request';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #3B82F6;">Password Reset Request</h2>
      <p>Hello ${user.name},</p>
      <p>You have requested to reset your password for your QuickDesk account.</p>
      <p>Please click the button below to reset your password:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
      </div>
      <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
      <p style="word-break: break-all; color: #6B7280;">${resetUrl}</p>
      <p><strong>Note:</strong> This link will expire in 1 hour for security reasons.</p>
      <p>If you didn't request this password reset, please ignore this email.</p>
      <br>
      <p>Best regards,<br>The QuickDesk Team</p>
    </div>
  `;

  await sendEmail({
    to: user.email,
    subject,
    html
  });
};

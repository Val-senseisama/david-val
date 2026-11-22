import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX = { name: 100, email: 200, message: 5000 };

function clean(v: unknown): string {
  return typeof v === 'string' ? v.trim() : '';
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL;
  const fromEmail = process.env.CONTACT_FROM_EMAIL || 'onboarding@resend.dev';

  if (!apiKey || !toEmail) {
    console.error('Missing RESEND_API_KEY or CONTACT_TO_EMAIL env var');
    return res.status(500).json({ error: 'Email service not configured' });
  }

  const name = clean(req.body?.name);
  const email = clean(req.body?.email);
  const message = clean(req.body?.message);

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email and message are required' });
  }
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }
  if (name.length > MAX.name || email.length > MAX.email || message.length > MAX.message) {
    return res.status(400).json({ error: 'One or more fields are too long' });
  }

  const resend = new Resend(apiKey);
  const safeName = escapeHtml(name);
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');

  const notify = await resend.emails.send({
    from: `Portfolio Contact <${fromEmail}>`,
    to: toEmail,
    replyTo: email,
    subject: `New message from ${name}`,
    html: `
      <h2>New portfolio contact</h2>
      <p><strong>Name:</strong> ${safeName}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Message:</strong></p>
      <p>${safeMessage}</p>
    `,
  });

  if (notify.error) {
    console.error('Failed to send notification email:', notify.error);
    return res.status(502).json({ error: 'Failed to send message' });
  }

  // Best-effort auto-reply. Requires a verified domain on the `from` address;
  // with the default onboarding@resend.dev sender this will only reach your
  // own Resend account email, so a failure here must not fail the request.
  const autoReply = await resend.emails.send({
    from: `David Val <${fromEmail}>`,
    to: email,
    subject: 'Thanks for reaching out',
    html: `
      <p>Hi ${safeName},</p>
      <p>Thanks for your message — I've received it and will get back to you shortly.</p>
      <p>Best,<br>David</p>
    `,
  });

  if (autoReply.error) {
    console.warn('Auto-reply not sent:', autoReply.error);
  }

  return res.status(200).json({ ok: true });
}

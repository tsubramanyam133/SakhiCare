import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { to, subject, html } = body;
    
    if (!to || !subject || !html) {
      return NextResponse.json({ success: false, error: 'Missing fields' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'sakhicare0203@gmail.com', // Hardcoded
        pass: 'doey itba amhf ixqu'      // Hardcoded
      }
    });

    const info = await transporter.sendMail({
      from: '"SAKHI AI" <sakhicare0203@gmail.com>',
      to,
      subject,
      html
    });

    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error: any) {
    console.error('API send-email error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

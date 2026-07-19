import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'sakhicare0203@gmail.com',
    pass: process.env.EMAIL_PASSWORD || '', 
  },
});

export class EmailService {
  static async sendOTP(email: string, otp: string): Promise<boolean> {
    try {
      const mailOptions = {
        from: `"SAKHI AI" <${process.env.EMAIL_USER || 'sakhicare0203@gmail.com'}>`,
        to: email,
        subject: 'Verify your SAKHI AI Account',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #ec4899;">Welcome to SAKHI AI!</h2>
            <p>Please use the following One Time Password (OTP) to verify your account.</p>
            <div style="background-color: #fce7f3; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
              <h1 style="color: #be185d; margin: 0; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
            </div>
            <p>This OTP will expire in 10 minutes.</p>
            <p>If you did not request this, please ignore this email.</p>
          </div>
        `,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('Message sent: %s', info.messageId);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  static async sendCyclePredictionEmail(email: string, nextPeriodDate: Date, ovulationDate: Date): Promise<boolean> {
    try {
      const nextPeriod = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(nextPeriodDate);
      const ovulation = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(ovulationDate);

      const mailOptions = {
        from: `"SAKHI AI" <${process.env.EMAIL_USER || 'sakhicare0203@gmail.com'}>`,
        to: email,
        subject: 'Your SAKHI AI Cycle Prediction is Ready 🌸',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #ec4899; text-align: center;">SAKHI AI Insights</h2>
            <p style="font-size: 16px; color: #333;">Hello!</p>
            <p style="font-size: 16px; color: #333;">Your latest period log has been successfully saved. Based on your cycle history, our AI has generated predictions for your upcoming month:</p>
            
            <div style="background-color: #fce7f3; padding: 20px; border-radius: 12px; margin: 25px 0; border: 1px solid #fbcfe8;">
              <h3 style="color: #be185d; margin-top: 0;">📅 Next Expected Period</h3>
              <p style="font-size: 18px; font-weight: bold; margin-bottom: 20px;">${nextPeriod}</p>
              
              <h3 style="color: #be185d; margin-top: 0;">✨ High Ovulation (Peak Fertility)</h3>
              <p style="font-size: 18px; font-weight: bold; margin-bottom: 0;">${ovulation}</p>
            </div>

            <h3 style="color: #ec4899;">AI Wellness Suggestions for this week:</h3>
            <ul style="color: #4b5563; font-size: 15px; line-height: 1.6;">
              <li><strong>Stay Hydrated:</strong> Drink plenty of water to help manage energy levels.</li>
              <li><strong>Gentle Movement:</strong> Try light stretching or yoga to alleviate any discomfort.</li>
              <li><strong>Rest Well:</strong> Ensure you are getting 7-8 hours of sleep as your body resets.</li>
            </ul>

            <p style="font-size: 14px; color: #9ca3af; margin-top: 30px; text-align: center;">
              *Predictions are estimates based on your logged data. Always consult a healthcare professional for medical advice.*
            </p>
          </div>
        `,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('Prediction email sent: %s', info.messageId);
      return true;
    } catch (error) {
      console.error('Error sending prediction email:', error);
      return false;
    }
  }
}

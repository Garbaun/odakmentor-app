const nodemailer = require('nodemailer');
// Load environment variables (supports running from repo root or server dir)
try {
  // Try loading from repo root .env
  require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
} catch (_) {
  // no-op
}
try {
  // Also try local server/.env if present
  require('dotenv').config({ path: require('path').join(__dirname, '.env') });
} catch (_) {
  // no-op
}

// Transport seçimi: ENV ile SMTP ayarlıysa gerçek gönderim, yoksa console stream
function createTransportFromEnv() {
  const smtpUrl = process.env.SMTP_URL; // e.g. smtp://user:pass@host:587
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const secure = String(process.env.SMTP_SECURE || '').toLowerCase() === 'true';
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  // Prefer URL if provided
  if (smtpUrl) {
    return nodemailer.createTransport(smtpUrl);
  }

  // Host based configuration
  if (host) {
    const auth = user || pass ? { user: user || '', pass: pass || '' } : undefined;
    return nodemailer.createTransport({ host, port: port || 587, secure, auth });
  }

  // Fallback to console stream transport for development
  return nodemailer.createTransport({
    streamTransport: true,
    newline: 'unix',
    buffer: true
  });
}

const transporter = createTransportFromEnv();

// Gerçek mail servisi - Ubuntu sunucu ile (şu an çalışmıyor)
// const transporter = nodemailer.createTransport({
//   host: '192.168.1.100',
//   port: 25,
//   secure: false,
//   auth: {
//     user: 'admin@odakmentor.com',
//     pass: 'AdminPass123!'
//   }
// });

const FROM_EMAIL = process.env.MAIL_FROM || 'admin@odakmentor.com';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

const sendEmailVerification = async (toEmail, token, userName) => {
  const verificationLink = `${FRONTEND_URL}/verify-email?token=${token}`;

  const mailOptions = {
    from: FROM_EMAIL,
    to: toEmail,
    subject: 'Odak Mentor - E-posta Adresinizi Doğrulayın',
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
        <div style="background: linear-gradient(to right, #0053f5, #003bb5); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">E-posta Doğrulama</h1>
        </div>
        <div style="padding: 30px; background-color: #f9f9f9; color: #333;">
          <p style="font-size: 16px; line-height: 1.6;">Merhaba ${userName},</p>
          <p style="font-size: 16px; line-height: 1.6;">Odak Mentor hesabınızı aktifleştirmek için lütfen aşağıdaki butona tıklayın:</p>
          <p style="text-align: center; margin: 30px 0;">
            <a href="${verificationLink}" style="background-color: #0053f5; color: white; padding: 12px 25px; border-radius: 8px; text-decoration: none; font-size: 18px; font-weight: bold;">E-postayı Doğrula</a>
          </p>
          <p style="font-size: 14px; line-height: 1.6; color: #666;">Bu link 24 saat içinde sona erecektir. Eğer siz talep etmediyseniz bu e-postayı dikkate almayın.</p>
          <p style="font-size: 14px; line-height: 1.6; color: #666;">Teşekkürler,<br/>Odak Mentor Ekibi</p>
        </div>
        <div style="background-color: #f0f0f0; padding: 20px; text-align: center; font-size: 12px; color: #777;">
          <p>&copy; ${new Date().getFullYear()} Odak Mentor. Tüm hakları saklıdır.</p>
        </div>
      </div>
    `,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log('📧 Mail gönderildi:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('📧 Mail gönderme hatası:', error);
    return { success: false, error: error.message };
  }
};

const sendWelcomeEmail = async (toEmail, userName) => {
  const mailOptions = {
    from: FROM_EMAIL,
    to: toEmail,
    subject: 'Odak Mentor\'a Hoş Geldiniz!',
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
        <div style="background: linear-gradient(to right, #0053f5, #003bb5); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">Hoş Geldiniz!</h1>
        </div>
        <div style="padding: 30px; background-color: #f9f9f9; color: #333;">
          <p style="font-size: 16px; line-height: 1.6;">Merhaba ${userName},</p>
          <p style="font-size: 16px; line-height: 1.6;">Odak Mentor ailesine hoş geldiniz! Hesabınız başarıyla aktifleştirildi.</p>
          <p style="font-size: 16px; line-height: 1.6;">Artık platformumuzdaki tüm özelliklerden faydalanmaya başlayabilirsiniz. Mentorunuzla tanışmak, dersler planlamak ve hedeflerinize ulaşmak için sabırsızlanıyoruz.</p>
          <p style="text-align: center; margin: 30px 0;">
            <a href="${FRONTEND_URL}/student" style="background-color: #0053f5; color: white; padding: 12px 25px; border-radius: 8px; text-decoration: none; font-size: 18px; font-weight: bold;">Platforma Git</a>
          </p>
          <p style="font-size: 14px; line-height: 1.6; color: #666;">Herhangi bir sorunuz olursa destek ekibimizle iletişime geçmekten çekinmeyin.</p>
          <p style="font-size: 14px; line-height: 1.6; color: #666;">Başarılar dileriz,<br/>Odak Mentor Ekibi</p>
        </div>
        <div style="background-color: #f0f0f0; padding: 20px; text-align: center; font-size: 12px; color: #777;">
          <p>&copy; ${new Date().getFullYear()} Odak Mentor. Tüm hakları saklıdır.</p>
        </div>
      </div>
    `,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log('📧 Hoş geldin maili gönderildi:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('📧 Hoş geldin maili gönderme hatası:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendEmailVerification,
  sendWelcomeEmail,
};
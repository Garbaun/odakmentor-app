const { sendEmailVerification, sendWelcomeEmail } = require('./mailService');

async function testMailService() {
  console.log('📧 Mail Service Test Başlatılıyor...\n');

  // Test 1: E-posta doğrulama maili
  console.log('1. E-posta Doğrulama Maili Testi:');
  const verificationResult = await sendEmailVerification(
    'test@example.com',
    'test-token-123',
    'Test Kullanıcı'
  );
  console.log('Sonuç:', verificationResult);
  console.log('');

  // Test 2: Hoş geldin maili
  console.log('2. Hoş Geldin Maili Testi:');
  const welcomeResult = await sendWelcomeEmail(
    'test@example.com',
    'Test Kullanıcı'
  );
  console.log('Sonuç:', welcomeResult);
  console.log('');

  console.log('📧 Mail Service Test Tamamlandı!');
}

// Test'i çalıştır
testMailService().catch(console.error);
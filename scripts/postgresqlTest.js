// PostgreSQL Veri Test Scripti
const { Pool } = require('pg');
require('dotenv').config();

// PostgreSQL bağlantı havuzu
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function testDatabaseConnection() {
  try {
    console.log('🔄 PostgreSQL bağlantısı test ediliyor...');
    
    // Bağlantı testi
    const client = await pool.connect();
    console.log('✅ PostgreSQL bağlantısı başarılı!');
    
    // Veritabanı bilgileri
    const dbInfo = await client.query('SELECT version()');
    console.log('📊 PostgreSQL Versiyonu:', dbInfo.rows[0].version);
    
    // Tablo listesi
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('📋 Mevcut Tablolar:');
    tables.rows.forEach(table => {
      console.log(`  - ${table.table_name}`);
    });
    
    // Test verisi ekleme
    console.log('\n🔄 Test verisi ekleniyor...');
    
    // Test tablosu oluştur (eğer yoksa)
    await client.query(`
      CREATE TABLE IF NOT EXISTS test_data (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Test verisi ekle
    const insertResult = await client.query(`
      INSERT INTO test_data (name, email) 
      VALUES ($1, $2) 
      RETURNING *
    `, ['Test User', 'test@odakmentor.com']);
    
    console.log('✅ Test verisi eklendi:', insertResult.rows[0]);
    
    // Test verilerini çek
    console.log('\n🔄 Test verileri çekiliyor...');
    const selectResult = await client.query('SELECT * FROM test_data ORDER BY created_at DESC LIMIT 5');
    
    console.log('📊 Son 5 Test Verisi:');
    selectResult.rows.forEach(row => {
      console.log(`  ID: ${row.id}, Name: ${row.name}, Email: ${row.email}, Tarih: ${row.created_at}`);
    });
    
    // Veri sayısı
    const countResult = await client.query('SELECT COUNT(*) as total FROM test_data');
    console.log(`📈 Toplam Test Verisi: ${countResult.rows[0].total}`);
    
    client.release();
    console.log('\n🎉 PostgreSQL veri alışverişi testi başarılı!');
    
  } catch (error) {
    console.error('❌ PostgreSQL Hatası:', error.message);
  } finally {
    await pool.end();
  }
}

// Test çalıştır
testDatabaseConnection();

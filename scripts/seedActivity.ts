#!/usr/bin/env ts-node

import { config } from 'dotenv';
import { Pool } from 'pg';

config({ path: process.cwd().includes('server') ? '.env' : 'server/.env' });

async function main() {
  const emailArg = process.argv[2] || 'student@example.com';
  const daysArg = parseInt(process.argv[3] || '7', 10);

  const pool = new Pool({
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME || 'odakmentor_db',
    user: process.env.DB_USER || 'odakmentor',
    password: process.env.DB_PASSWORD || '',
    max: 5,
  });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // Ensure student user exists
    let student = (await client.query('SELECT * FROM users WHERE email=$1', [emailArg])).rows[0];
    if (!student) {
      student = (
        await client.query(
          `INSERT INTO users (email, first_name, last_name, role, status, is_email_verified, is_phone_verified, preferences, subscription)
           VALUES ($1,$2,$3,'student','active',true,false,'{}','{}') RETURNING *`,
          [emailArg, 'Student', 'Demo']
        )
      ).rows[0];
    }

    // Ensure a demo teacher
    let teacher = (await client.query("SELECT * FROM users WHERE role='teacher' LIMIT 1")).rows[0];
    if (!teacher) {
      teacher = (
        await client.query(
          `INSERT INTO users (email, first_name, last_name, role, status, is_email_verified, is_phone_verified, preferences, subscription)
           VALUES ($1,$2,$3,'teacher','active',true,false,'{}','{}') RETURNING *`,
          ['teacher@example.com', 'Teacher', 'Demo']
        )
      ).rows[0];
    }

    // Ensure a course
    let course = (
      await client.query(
        `INSERT INTO courses (title, description, category, subcategory, grade, level, duration, total_sessions, price, currency, teacher_id, is_active, is_public)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,true,true)
         ON CONFLICT DO NOTHING
         RETURNING *`,
        [
          'Demo Mathematics Course',
          'Demo course for activity seeding',
          'Mathematics',
          'Algebra',
          9,
          'Intermediate',
          60,
          10,
          0,
          'TRY',
          teacher.id,
        ]
      )
    ).rows[0];
    if (!course) {
      course = (await client.query('SELECT * FROM courses ORDER BY id DESC LIMIT 1')).rows[0];
    }

    // Insert student_progress for last N days
    const now = new Date();
    for (let i = 0; i < daysArg; i++) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const status = i % 3 === 0 ? 'completed' : 'in_progress';
      const timeSpent = 20 + Math.floor(Math.random() * 40); // 20-60 dakika
      await client.query(
        `INSERT INTO student_progress (student_id, course_id, status, score, time_spent, completed_at, created_at, updated_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$7)`,
        [
          student.id,
          course.id,
          status,
          status === 'completed' ? 60 + Math.floor(Math.random() * 40) : null,
          timeSpent,
          status === 'completed' ? d : null,
          d,
        ]
      );
    }

    await client.query('COMMIT');
    console.log(`Seed tamam: ${emailArg} için son ${daysArg} güne ait aktiviteler eklendi.`);
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Seed hatası', e);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

main();



import pool from './config/db.js';

(async () => {
  try {
    const [rows] = await pool.query('SELECT id, name, category, availability_status, image_url FROM equipment LIMIT 100');
    console.log(JSON.stringify(rows, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
})();

import express from 'express';
import cors from 'cors';
import { pool, initDb } from './db.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize DB on boot
initDb();

// 1. GET /api/matches - Fetch all matches with players and comments
app.get('/api/matches', async (req, res) => {
  try {
    const matchesRes = await pool.query(`
      SELECT 
        m.id, m.city, m.location_name AS "locationName", m.address, 
        m.court_type AS "courtType", m.match_date AS "date", m.match_time AS "time",
        m.duration_minutes AS "durationMinutes", m.category, 
        CAST(m.min_level AS FLOAT) AS "minLevel", 
        CAST(m.max_level AS FLOAT) AS "maxLevel", 
        CAST(m.price_per_player AS FLOAT) AS "pricePerPlayer", 
        m.max_players AS "maxPlayers", m.description, m.organizer_id AS "organizerId",
        u.name AS "organizerName", u.city AS "organizerCity", 
        CAST(u.level AS FLOAT) AS "organizerLevel", u.side AS "organizerSide", u.avatar AS "organizerAvatar"
      FROM matches m
      LEFT JOIN users u ON m.organizer_id = u.id
      ORDER BY m.created_at DESC;
    `);

    const matches = matchesRes.rows;

    for (const match of matches) {
      // Fetch Players
      const playersRes = await pool.query(`
        SELECT 
          u.id, u.name, u.city, CAST(u.level AS FLOAT) AS level, u.side, u.avatar, mp.confirmed
        FROM match_players mp
        JOIN users u ON mp.user_id = u.id
        WHERE mp.match_id = $1
        ORDER BY mp.joined_at ASC;
      `, [match.id]);

      match.players = playersRes.rows;
      match.organizer = {
        id: match.organizerId,
        name: match.organizerName || 'Organizador',
        city: match.organizerCity || match.city,
        level: match.organizerLevel || 3.5,
        side: match.organizerSide || 'Indiferente',
        avatar: match.organizerAvatar
      };

      // Fetch Comments
      const commentsRes = await pool.query(`
        SELECT 
          c.id, c.sender_name AS "sender", c.text, 
          TO_CHAR(c.created_at, 'HH24:MI') AS timestamp
        FROM match_comments c
        WHERE c.match_id = $1
        ORDER BY c.created_at ASC;
      `, [match.id]);

      match.comments = commentsRes.rows;
    }

    res.json(matches);
  } catch (err) {
    console.error('Error in GET /api/matches:', err);
    res.status(500).json({ error: 'Database error fetching matches' });
  }
});

// 2. POST /api/matches - Create a new match
app.post('/api/matches', async (req, res) => {
  const client = await pool.connect();
  try {
    const {
      id, city, locationName, address, courtType, date, time, durationMinutes,
      category, minLevel, maxLevel, pricePerPlayer, maxPlayers, description,
      organizer
    } = req.body;

    await client.query('BEGIN');

    // Ensure organizer exists
    if (organizer) {
      await client.query(`
        INSERT INTO users (id, name, city, level, side, phone, avatar)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          city = EXCLUDED.city,
          level = EXCLUDED.level,
          side = EXCLUDED.side,
          avatar = EXCLUDED.avatar;
      `, [organizer.id, organizer.name, organizer.city, organizer.level, organizer.side, organizer.phone || null, organizer.avatar]);
    }

    // Insert match
    await client.query(`
      INSERT INTO matches (
        id, city, location_name, address, court_type, match_date, match_time,
        duration_minutes, category, min_level, max_level, price_per_player, max_players, description, organizer_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15);
    `, [
      id, city, locationName, address, courtType, date, time,
      durationMinutes, category, minLevel, maxLevel, pricePerPlayer, maxPlayers || 4, description, organizer.id
    ]);

    // Join organizer to match
    await client.query(`
      INSERT INTO match_players (match_id, user_id)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING;
    `, [id, organizer.id]);

    await client.query('COMMIT');
    res.status(201).json({ success: true, id });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error in POST /api/matches:', err);
    res.status(500).json({ error: 'Failed to create match' });
  } finally {
    client.release();
  }
});

// 3. POST /api/matches/:id/join - Join a match
app.post('/api/matches/:id/join', async (req, res) => {
  const matchId = req.params.id;
  const { user } = req.body;

  if (!user || !user.id) {
    return res.status(400).json({ error: 'User is required to join match' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Upsert user
    await client.query(`
      INSERT INTO users (id, name, city, level, side, phone, avatar)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        city = EXCLUDED.city,
        level = EXCLUDED.level,
        side = EXCLUDED.side,
        avatar = EXCLUDED.avatar;
    `, [user.id, user.name, user.city, user.level, user.side, user.phone || null, user.avatar]);

    // Join match
    await client.query(`
      INSERT INTO match_players (match_id, user_id)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING;
    `, [matchId, user.id]);

    await client.query('COMMIT');
    res.json({ success: true });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error joining match:', err);
    res.status(500).json({ error: 'Failed to join match' });
  } finally {
    client.release();
  }
});

// 4. POST /api/matches/:id/leave - Leave a match
app.post('/api/matches/:id/leave', async (req, res) => {
  const matchId = req.params.id;
  const { userId } = req.body;

  try {
    await pool.query(`
      DELETE FROM match_players WHERE match_id = $1 AND user_id = $2;
    `, [matchId, userId]);
    res.json({ success: true });
  } catch (err) {
    console.error('Error leaving match:', err);
    res.status(500).json({ error: 'Failed to leave match' });
  }
});

// 5. POST /api/matches/:id/comments - Add comment
app.post('/api/matches/:id/comments', async (req, res) => {
  const matchId = req.params.id;
  const { userId, senderName, text } = req.body;

  try {
    const commentId = `c-${Date.now()}`;
    await pool.query(`
      INSERT INTO match_comments (id, match_id, user_id, sender_name, text)
      VALUES ($1, $2, $3, $4, $5);
    `, [commentId, matchId, userId || null, senderName, text]);

    res.status(201).json({ success: true, commentId });
  } catch (err) {
    console.error('Error adding comment:', err);
    res.status(500).json({ error: 'Failed to post comment' });
  }
});

// 6. POST /api/users/profile - Update user profile
app.post('/api/users/profile', async (req, res) => {
  const user = req.body;
  try {
    await pool.query(`
      INSERT INTO users (id, name, city, level, side, phone, avatar)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        city = EXCLUDED.city,
        level = EXCLUDED.level,
        side = EXCLUDED.side,
        phone = EXCLUDED.phone,
        avatar = EXCLUDED.avatar;
    `, [user.id, user.name, user.city, user.level, user.side, user.phone || null, user.avatar]);

    res.json({ success: true });
  } catch (err) {
    console.error('Error updating user profile:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Express PostgreSQL API server running on http://localhost:${PORT}`);
});

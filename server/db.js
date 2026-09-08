import pg from 'pg';

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:bdwx13elgrqryoe3@187.127.233.89:5441/postgres';

export const pool = new pg.Pool({
  connectionString,
  ssl: false
});

export async function initDb() {
  const client = await pool.connect();
  try {
    console.log('Connecting to PostgreSQL database and initializing tables...');

    // 1. Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        province VARCHAR(100) DEFAULT 'Madrid',
        city VARCHAR(100) NOT NULL,
        level NUMERIC(3,1) NOT NULL,
        side VARCHAR(50) DEFAULT 'Indiferente',
        phone VARCHAR(50),
        avatar TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      ALTER TABLE users ADD COLUMN IF NOT EXISTS province VARCHAR(100) DEFAULT 'Madrid';
    `);

    // 2. Matches table
    await client.query(`
      CREATE TABLE IF NOT EXISTS matches (
        id VARCHAR(100) PRIMARY KEY,
        province VARCHAR(100) DEFAULT 'Madrid',
        city VARCHAR(100) NOT NULL,
        location_name VARCHAR(200) NOT NULL,
        address TEXT,
        court_type VARCHAR(100),
        match_date VARCHAR(50) NOT NULL,
        match_time VARCHAR(50) NOT NULL,
        duration_minutes INTEGER DEFAULT 90,
        category VARCHAR(50) NOT NULL,
        min_level NUMERIC(3,1) DEFAULT 1.0,
        max_level NUMERIC(3,1) DEFAULT 7.0,
        price_per_player NUMERIC(6,2) DEFAULT 0.0,
        max_players INTEGER DEFAULT 4,
        description TEXT,
        organizer_id VARCHAR(100) REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      ALTER TABLE matches ADD COLUMN IF NOT EXISTS province VARCHAR(100) DEFAULT 'Madrid';
    `);

    // 3. Match Players junction table
    await client.query(`
      CREATE TABLE IF NOT EXISTS match_players (
        match_id VARCHAR(100) REFERENCES matches(id) ON DELETE CASCADE,
        user_id VARCHAR(100) REFERENCES users(id) ON DELETE CASCADE,
        confirmed BOOLEAN DEFAULT TRUE,
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (match_id, user_id)
      );
    `);

    // 4. Match Comments table
    await client.query(`
      CREATE TABLE IF NOT EXISTS match_comments (
        id VARCHAR(100) PRIMARY KEY,
        match_id VARCHAR(100) REFERENCES matches(id) ON DELETE CASCADE,
        user_id VARCHAR(100) REFERENCES users(id) ON DELETE CASCADE,
        sender_name VARCHAR(150) NOT NULL,
        text TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('PostgreSQL schema initialized successfully!');

    // Seed mock data if matches table is empty
    const checkMatches = await client.query('SELECT COUNT(*) FROM matches');
    if (parseInt(checkMatches.rows[0].count, 10) === 0) {
      console.log('Seeding initial matches into PostgreSQL...');
      
      // Default users
      const seedUsers = [
        { id: 'usr-1', name: 'Carlos M.', city: 'Madrid', level: 4.0, side: 'Revés', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
        { id: 'usr-2', name: 'Javier R.', city: 'Madrid', level: 3.8, side: 'Drive', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
        { id: 'usr-3', name: 'David S.', city: 'Madrid', level: 4.2, side: 'Drive', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
        { id: 'usr-4', name: 'Lucía B.', city: 'Barcelona', level: 3.0, side: 'Drive', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80' },
        { id: 'usr-5', name: 'Marc V.', city: 'Barcelona', level: 3.2, side: 'Revés', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80' },
        { id: 'usr-6', name: 'Mateo G.', city: 'Valencia', level: 3.5, side: 'Indiferente', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80' },
        { id: 'usr-7', name: 'Gonzalo F.', city: 'Sevilla', level: 4.5, side: 'Revés', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80' },
        { id: 'usr-8', name: 'Álvaro T.', city: 'Sevilla', level: 4.2, side: 'Drive', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80' },
        { id: 'usr-9', name: 'Jaime N.', city: 'Sevilla', level: 4.3, side: 'Revés', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80' },
        { id: 'usr-10', name: 'Rocío L.', city: 'Málaga', level: 3.6, side: 'Drive', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80' },
        { id: 'usr-11', name: 'Carmen P.', city: 'Málaga', level: 3.4, side: 'Revés', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80' },
        { id: 'usr-12', name: 'Jorge A.', city: 'Zaragoza', level: 2.5, side: 'Drive', avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=200&q=80' }
      ];

      for (const u of seedUsers) {
        await client.query(`
          INSERT INTO users (id, name, city, level, side, avatar)
          VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT (id) DO NOTHING;
        `, [u.id, u.name, u.city, u.level, u.side, u.avatar]);
      }

      // Default Matches
      const seedMatches = [
        {
          id: 'match-101',
          city: 'Madrid',
          locationName: 'Padel Club La Moraleja / Pistas Municipales Alcobendas',
          address: 'Calle de la Luna 14, Alcobendas (Madrid)',
          courtType: 'Cristal - Cubierta',
          date: '2026-09-09',
          time: '19:00',
          durationMinutes: 90,
          category: 'Masculino',
          minLevel: 3.5,
          maxLevel: 4.5,
          pricePerPlayer: 5.50,
          maxPlayers: 4,
          description: 'Buscamos 1 jugador para cerrar partido nivel medio-alto en pista cubierta rápido y con buen ritmo.',
          organizerId: 'usr-1',
          players: ['usr-1', 'usr-2', 'usr-3']
        },
        {
          id: 'match-102',
          city: 'Barcelona',
          locationName: "CEM Olímpics Vall d'Hebron (Pistas Públicas)",
          address: "Passeig de la Vall d'Hebron 166, Barcelona",
          courtType: 'Muro / Exterior',
          date: '2026-09-09',
          time: '20:30',
          durationMinutes: 90,
          category: 'Mixto',
          minLevel: 2.5,
          maxLevel: 3.5,
          pricePerPlayer: 4.00,
          maxPlayers: 4,
          description: 'Partido mixto amigable para pasar un buen rato sin tensión competitiva excesiva.',
          organizerId: 'usr-4',
          players: ['usr-4', 'usr-5']
        },
        {
          id: 'match-103',
          city: 'Valencia',
          locationName: 'Pàdel Turia / Polideportivo Municipal Nazaret',
          address: 'Carrer de Fernando Moratinos, Valencia',
          courtType: 'Cristal - Cubierta',
          date: '2026-09-10',
          time: '18:30',
          durationMinutes: 90,
          category: 'Abierto',
          minLevel: 3.0,
          maxLevel: 4.0,
          pricePerPlayer: 4.80,
          maxPlayers: 4,
          description: 'Organizamos el partido directamente nosotros. La reserva de la pista está hecha para las 18:30.',
          organizerId: 'usr-6',
          players: ['usr-6']
        },
        {
          id: 'match-104',
          city: 'Sevilla',
          locationName: 'Pista Residencial Parque Alcosa (Independiente)',
          address: 'Av. Ciudad de Chivas s/n, Sevilla',
          courtType: 'Cristal - Exterior',
          date: '2026-09-09',
          time: '21:00',
          durationMinutes: 90,
          category: 'Masculino',
          minLevel: 4.0,
          maxLevel: 5.0,
          pricePerPlayer: 3.50,
          maxPlayers: 4,
          description: 'Falta 1 jugador de nivel alto para partido intenso y competitivo por la noche.',
          organizerId: 'usr-7',
          players: ['usr-7', 'usr-8', 'usr-9']
        },
        {
          id: 'match-105',
          city: 'Málaga',
          locationName: 'Padel Club Teatinos / Complejo Universidad',
          address: 'Boulevard Louis Pasteur 30, Málaga',
          courtType: 'Cristal - Cubierta',
          date: '2026-09-10',
          time: '19:30',
          durationMinutes: 90,
          category: 'Femenino',
          minLevel: 3.0,
          maxLevel: 4.0,
          pricePerPlayer: 5.00,
          maxPlayers: 4,
          description: 'Partido femenino nivel 3.0-4.0. ¡Buscamos parejita o dos jugadoras sueltas!',
          organizerId: 'usr-10',
          players: ['usr-10', 'usr-11']
        },
        {
          id: 'match-106',
          city: 'Zaragoza',
          locationName: 'Pistas Municipales Actur',
          address: 'Calle Poeta Luciano Gracia 5, Zaragoza',
          courtType: 'Muro - Exterior',
          date: '2026-09-11',
          time: '18:00',
          durationMinutes: 90,
          category: 'Abierto',
          minLevel: 2.0,
          maxLevel: 3.0,
          pricePerPlayer: 3.00,
          maxPlayers: 4,
          description: 'Partido de nivel principiante/iniciación para coger soltura en pista.',
          organizerId: 'usr-12',
          players: ['usr-12']
        }
      ];

      for (const m of seedMatches) {
        await client.query(`
          INSERT INTO matches (id, city, location_name, address, court_type, match_date, match_time, duration_minutes, category, min_level, max_level, price_per_player, max_players, description, organizer_id)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
          ON CONFLICT (id) DO NOTHING;
        `, [
          m.id, m.city, m.locationName, m.address, m.courtType, m.date, m.time, m.durationMinutes,
          m.category, m.minLevel, m.maxLevel, m.pricePerPlayer, m.maxPlayers, m.description, m.organizerId
        ]);

        for (const pId of m.players) {
          await client.query(`
            INSERT INTO match_players (match_id, user_id)
            VALUES ($1, $2)
            ON CONFLICT DO NOTHING;
          `, [m.id, pId]);
        }
      }
      console.log('Seeded matches into PostgreSQL!');
    }

  } catch (err) {
    console.error('Error during initDb:', err);
  } finally {
    client.release();
  }
}

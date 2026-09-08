export const SPANISH_CITIES = [
  "Todas las poblaciones",
  "Madrid",
  "Barcelona",
  "Valencia",
  "Sevilla",
  "Málaga",
  "Zaragoza",
  "Alicante",
  "Bilbao",
  "Murcia",
  "Palma de Mallorca",
  "Las Palmas",
  "Córdoba",
  "Valladolid",
  "Vigo",
  "Gijón",
  "A Coruña",
  "Granada"
];

export const INITIAL_MATCHES = [
  {
    id: "match-101",
    city: "Madrid",
    locationName: "Padel Club La Moraleja / Pistas Municipales Alcobendas",
    address: "Calle de la Luna 14, Alcobendas (Madrid)",
    courtType: "Cristal - Cubierta",
    date: "2026-09-09",
    time: "19:00",
    durationMinutes: 90,
    category: "Masculino",
    minLevel: 3.5,
    maxLevel: 4.5,
    pricePerPlayer: 5.50,
    organizer: {
      id: "usr-1",
      name: "Carlos M.",
      city: "Madrid",
      level: 4.0,
      side: "Revés",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
    },
    players: [
      {
        id: "usr-1",
        name: "Carlos M.",
        level: 4.0,
        side: "Revés",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        confirmed: true
      },
      {
        id: "usr-2",
        name: "Javier R.",
        level: 3.8,
        side: "Drive",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
        confirmed: true
      },
      {
        id: "usr-3",
        name: "David S.",
        level: 4.2,
        side: "Drive",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
        confirmed: true
      }
    ],
    maxPlayers: 4,
    description: "Buscamos 1 jugador para cerrar partido nivel medio-alto en pista cubierta rápido y con buen ritmo.",
    comments: [
      { id: "c1", sender: "Carlos M.", text: "¡Bola nueva Bullpadel Pro recién abierta!", timestamp: "10:15" },
      { id: "c2", sender: "Javier R.", text: "Perfecto Carlos, allí estaré 15 min antes para calentar.", timestamp: "10:30" }
    ]
  },
  {
    id: "match-102",
    city: "Barcelona",
    locationName: "CEM Olímpics Vall d'Hebron (Pistas Públicas)",
    address: "Passeig de la Vall d'Hebron 166, Barcelona",
    courtType: "Muro / Exterior",
    date: "2026-09-09",
    time: "20:30",
    durationMinutes: 90,
    category: "Mixto",
    minLevel: 2.5,
    maxLevel: 3.5,
    pricePerPlayer: 4.00,
    organizer: {
      id: "usr-4",
      name: "Lucía B.",
      city: "Barcelona",
      level: 3.0,
      side: "Drive",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80"
    },
    players: [
      {
        id: "usr-4",
        name: "Lucía B.",
        level: 3.0,
        side: "Drive",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
        confirmed: true
      },
      {
        id: "usr-5",
        name: "Marc V.",
        level: 3.2,
        side: "Revés",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
        confirmed: true
      }
    ],
    maxPlayers: 4,
    description: "Partido mixto amigable para pasar un buen rato sin tensión competitiva excesiva.",
    comments: []
  },
  {
    id: "match-103",
    city: "Valencia",
    locationName: "Pàdel Turia / Polideportivo Municipal Nazaret",
    address: "Carrer de Fernando Moratinos, Valencia",
    courtType: "Cristal - Cubierta",
    date: "2026-09-10",
    time: "18:30",
    durationMinutes: 90,
    category: "Abierto",
    minLevel: 3.0,
    maxLevel: 4.0,
    pricePerPlayer: 4.80,
    organizer: {
      id: "usr-6",
      name: "Mateo G.",
      city: "Valencia",
      level: 3.5,
      side: "Indiferente",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80"
    },
    players: [
      {
        id: "usr-6",
        name: "Mateo G.",
        level: 3.5,
        side: "Indiferente",
        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80",
        confirmed: true
      }
    ],
    maxPlayers: 4,
    description: "Organizamos el partido directamente nosotros. La reserva de la pista está hecha para las 18:30.",
    comments: [
      { id: "c3", sender: "Mateo G.", text: "Faltan 3 personas. Podéis apuntaros quien queráis independientemente del sexo.", timestamp: "09:00" }
    ]
  },
  {
    id: "match-104",
    city: "Sevilla",
    locationName: "Pista Residencial Parque Alcosa (Independiente)",
    address: "Av. Ciudad de Chivas s/n, Sevilla",
    courtType: "Cristal - Exterior",
    date: "2026-09-09",
    time: "21:00",
    durationMinutes: 90,
    category: "Masculino",
    minLevel: 4.0,
    maxLevel: 5.0,
    pricePerPlayer: 3.50,
    organizer: {
      id: "usr-7",
      name: "Gonzalo F.",
      city: "Sevilla",
      level: 4.5,
      side: "Revés",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80"
    },
    players: [
      {
        id: "usr-7",
        name: "Gonzalo F.",
        level: 4.5,
        side: "Revés",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
        confirmed: true
      },
      {
        id: "usr-8",
        name: "Álvaro T.",
        level: 4.2,
        side: "Drive",
        avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80",
        confirmed: true
      },
      {
        id: "usr-9",
        name: "Jaime N.",
        level: 4.3,
        side: "Revés",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
        confirmed: true
      }
    ],
    maxPlayers: 4,
    description: "Falta 1 jugador de nivel alto para partido intenso y competitivo por la noche.",
    comments: []
  },
  {
    id: "match-105",
    city: "Málaga",
    locationName: "Padel Club Teatinos / Complejo Universidad",
    address: "Boulevard Louis Pasteur 30, Málaga",
    courtType: "Cristal - Cubierta",
    date: "2026-09-10",
    time: "19:30",
    durationMinutes: 90,
    category: "Femenino",
    minLevel: 3.0,
    maxLevel: 4.0,
    pricePerPlayer: 5.00,
    organizer: {
      id: "usr-10",
      name: "Rocío L.",
      city: "Málaga",
      level: 3.6,
      side: "Drive",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80"
    },
    players: [
      {
        id: "usr-10",
        name: "Rocío L.",
        level: 3.6,
        side: "Drive",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
        confirmed: true
      },
      {
        id: "usr-11",
        name: "Carmen P.",
        level: 3.4,
        side: "Revés",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
        confirmed: true
      }
    ],
    maxPlayers: 4,
    description: "Partido femenino nivel 3.0-4.0. ¡Buscamos parejita o dos jugadoras sueltas!",
    comments: []
  },
  {
    id: "match-106",
    city: "Zaragoza",
    locationName: "Pistas Municipales Actur",
    address: "Calle Poeta Luciano Gracia 5, Zaragoza",
    courtType: "Muro - Exterior",
    date: "2026-09-11",
    time: "18:00",
    durationMinutes: 90,
    category: "Abierto",
    minLevel: 2.0,
    maxLevel: 3.0,
    pricePerPlayer: 3.00,
    organizer: {
      id: "usr-12",
      name: "Jorge A.",
      city: "Zaragoza",
      level: 2.5,
      side: "Drive",
      avatar: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=200&q=80"
    },
    players: [
      {
        id: "usr-12",
        name: "Jorge A.",
        level: 2.5,
        side: "Drive",
        avatar: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=200&q=80",
        confirmed: true
      }
    ],
    maxPlayers: 4,
    description: "Partido de nivel principiante/iniciación para coger soltura en pista.",
    comments: []
  },
  {
    id: "match-107",
    city: "Madrid",
    locationName: "Club Deportivo Canal Isabel II (Chamberí)",
    address: "Av. de Filipinas 54, Madrid",
    courtType: "Cristal - Exterior",
    date: "2026-09-10",
    time: "20:00",
    durationMinutes: 90,
    category: "Mixto",
    minLevel: 3.2,
    maxLevel: 4.2,
    pricePerPlayer: 6.00,
    organizer: {
      id: "usr-13",
      name: "Elena G.",
      city: "Madrid",
      level: 3.8,
      side: "Revés",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
    },
    players: [
      {
        id: "usr-13",
        name: "Elena G.",
        level: 3.8,
        side: "Revés",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        confirmed: true
      },
      {
        id: "usr-14",
        name: "Pablo M.",
        level: 4.0,
        side: "Drive",
        avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80",
        confirmed: true
      }
    ],
    maxPlayers: 4,
    description: "Pista reservada en centro de Madrid. Buscamos 2 jugadores para mixto muy divertido.",
    comments: []
  }
];

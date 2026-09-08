import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import Filters from './components/Filters';
import MatchCard from './components/MatchCard';
import MatchDetailsModal from './components/MatchDetailsModal';
import CreateMatchModal from './components/CreateMatchModal';
import UserProfileModal from './components/UserProfileModal';
import { INITIAL_MATCHES } from './data/mockMatches';
import { PlusCircle, MapPin, Users, Trophy, Sparkles, Database } from 'lucide-react';

export default function App() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dbConnected, setDbConnected] = useState(true);

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('padel_user_v1');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return {
      id: 'usr-default-' + Math.floor(Math.random() * 1000),
      name: 'Alejandro M.',
      city: 'Madrid',
      level: 3.5,
      side: 'Revés',
      phone: '+34 612 345 678',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    };
  });

  // Save current user locally
  useEffect(() => {
    localStorage.setItem('padel_user_v1', JSON.stringify(currentUser));
  }, [currentUser]);

  // Fetch matches from PostgreSQL API
  const fetchMatches = async () => {
    try {
      const res = await fetch('/api/matches');
      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      setMatches(data);
      setDbConnected(true);
    } catch (err) {
      console.warn('Falling back to initial matches because server API is offline:', err);
      setDbConnected(false);
      setMatches(INITIAL_MATCHES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  // Filters State
  const [selectedProvince, setSelectedProvince] = useState("Todas las provincias");
  const [searchClub, setSearchClub] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [selectedLevel, setSelectedLevel] = useState("Todos");
  const [statusFilter, setStatusFilter] = useState("Todos");

  // Modals State
  const [activeModalMatch, setActiveModalMatch] = useState(null);
  const [showCreateMatch, setShowCreateMatch] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Filter Logic
  const filteredMatches = useMemo(() => {
    return matches.filter((m) => {
      if (selectedProvince !== "Todas las provincias" && m.province && m.province !== selectedProvince) {
        return false;
      }
      if (searchClub.trim()) {
        const query = searchClub.toLowerCase();
        const locName = (m.locationName || "").toLowerCase();
        const address = (m.address || "").toLowerCase();
        const city = (m.city || "").toLowerCase();
        const province = (m.province || "").toLowerCase();
        if (!locName.includes(query) && !address.includes(query) && !city.includes(query) && !province.includes(query)) {
          return false;
        }
      }
      if (selectedCategory !== "Todas" && m.category !== selectedCategory) {
        return false;
      }
      if (selectedLevel !== "Todos") {
        const targetLvl = parseFloat(selectedLevel);
        if (targetLvl < m.minLevel || targetLvl > m.maxLevel) {
          return false;
        }
      }
      if (statusFilter === "Abiertos") {
        if (m.players && m.players.length >= m.maxPlayers) return false;
      } else if (statusFilter === "MisPartidos") {
        if (!currentUser || !m.players || !m.players.some((p) => p.id === currentUser.id)) return false;
      }

      return true;
    });
  }, [matches, selectedProvince, searchClub, selectedCategory, selectedLevel, statusFilter, currentUser]);

  const resetFilters = () => {
    setSelectedProvince("Todas las provincias");
    setSearchClub("");
    setSelectedCategory("Todas");
    setSelectedLevel("Todos");
    setStatusFilter("Todos");
  };

  // Handlers with PostgreSQL API sync
  const handleJoinMatch = async (matchToJoin) => {
    if (!currentUser) {
      setShowProfileModal(true);
      return;
    }

    try {
      const res = await fetch(`/api/matches/${matchToJoin.id}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: currentUser })
      });
      if (res.ok) {
        await fetchMatches();
        // Update modal view if open
        if (activeModalMatch && activeModalMatch.id === matchToJoin.id) {
          const updatedPlayers = [...activeModalMatch.players, currentUser];
          setActiveModalMatch({ ...activeModalMatch, players: updatedPlayers });
        }
      }
    } catch (err) {
      console.error('Error joining match:', err);
    }
  };

  const handleLeaveMatch = async (matchId) => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/matches/${matchId}/leave`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id })
      });
      if (res.ok) {
        await fetchMatches();
        if (activeModalMatch && activeModalMatch.id === matchId) {
          const updatedPlayers = activeModalMatch.players.filter(p => p.id !== currentUser.id);
          setActiveModalMatch({ ...activeModalMatch, players: updatedPlayers });
        }
      }
    } catch (err) {
      console.error('Error leaving match:', err);
    }
  };

  const handleCreateMatch = async (newMatch) => {
    try {
      const res = await fetch('/api/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMatch)
      });
      if (res.ok) {
        await fetchMatches();
      } else {
        setMatches((prev) => [newMatch, ...prev]);
      }
    } catch (err) {
      console.error('Error creating match:', err);
      setMatches((prev) => [newMatch, ...prev]);
    }
  };

  const handleAddComment = async (matchId, text) => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/matches/${matchId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          senderName: currentUser.name,
          text
        })
      });
      if (res.ok) {
        await fetchMatches();
        if (activeModalMatch && activeModalMatch.id === matchId) {
          const newComment = {
            id: `c-${Date.now()}`,
            sender: currentUser.name,
            text,
            timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
          };
          const comments = activeModalMatch.comments ? [...activeModalMatch.comments, newComment] : [newComment];
          setActiveModalMatch({ ...activeModalMatch, comments });
        }
      }
    } catch (err) {
      console.error('Error posting comment:', err);
    }
  };

  const handleSaveProfile = async (updatedUser) => {
    setCurrentUser(updatedUser);
    try {
      await fetch('/api/users/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser)
      });
    } catch (err) {
      console.error('Error saving profile to DB:', err);
    }
  };

  return (
    <div className="app-layout">
      <Header
        currentUser={currentUser}
        onOpenProfile={() => setShowProfileModal(true)}
        onOpenCreateMatch={() => setShowCreateMatch(true)}
        selectedCity={selectedProvince}
      />

      <main className="main-content">
        <section className="hero-banner">
          <div style={{ position: 'relative', zIndex: 2 }}>
            <h1 className="hero-title">
              Encuentra partidos de <span>pádel sin depender de clubes</span>
            </h1>
            <p className="hero-subtitle">
              Red pública e independiente a nivel nacional. Únete a partidos abiertos por otros jugadores o publica el tuyo en tu pista municipal o club habitual.
            </p>

            <div className="hero-stats">
              <div className="stat-pill">
                <MapPin size={16} />
                <span>Ámbito Nacional (Todas las ciudades)</span>
              </div>
              <div className="stat-pill">
                <Users size={16} />
                <span>Buscador por Población o Club</span>
              </div>
              <div className="stat-pill">
                <Trophy size={16} />
                <span>Niveles de 1.0 a 7.0</span>
              </div>
              <div className="stat-pill" style={{ background: 'rgba(204, 255, 0, 0.1)', borderColor: 'var(--border-highlight)', color: 'var(--primary-neon)' }}>
                <Sparkles size={16} />
                <span>Sin intermediarios ni comisiones de club</span>
              </div>
            </div>
          </div>
        </section>

        <Filters
          selectedProvince={selectedProvince}
          setSelectedProvince={setSelectedProvince}
          searchClub={searchClub}
          setSearchClub={setSearchClub}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedLevel={selectedLevel}
          setSelectedLevel={setSelectedLevel}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          resetFilters={resetFilters}
          totalMatches={filteredMatches.length}
        />

        {loading ? (
          <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', animation: 'spin 1s infinite linear' }}>🎾</div>
            <p style={{ marginTop: '12px', color: 'var(--text-muted)' }}>Cargando partidos desde la base de datos PostgreSQL...</p>
          </div>
        ) : filteredMatches.length > 0 ? (
          <div className="matches-grid">
            {filteredMatches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                currentUser={currentUser}
                onSelectMatch={(m) => setActiveModalMatch(m)}
                onJoinMatch={handleJoinMatch}
              />
            ))}
          </div>
        ) : (
          <div className="glass-card" style={{ padding: '48px', textAlign: 'center', marginTop: '24px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🎾</div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px' }}>No se encontraron partidos con los filtros seleccionados</h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto 20px' }}>
              Intenta cambiar la población, ampliar el rango de nivel o sé el primero en organizar un partido en esta zona.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button className="btn-secondary" onClick={resetFilters}>
                Limpiar Filtros
              </button>
              <button className="btn-primary" onClick={() => setShowCreateMatch(true)}>
                <PlusCircle size={18} />
                <span>Organizar Partido Aquí</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {activeModalMatch && (
        <MatchDetailsModal
          match={activeModalMatch}
          currentUser={currentUser}
          onClose={() => setActiveModalMatch(null)}
          onJoinMatch={handleJoinMatch}
          onLeaveMatch={handleLeaveMatch}
          onAddComment={handleAddComment}
        />
      )}

      {showCreateMatch && (
        <CreateMatchModal
          currentUser={currentUser}
          onClose={() => setShowCreateMatch(false)}
          onCreateMatch={handleCreateMatch}
        />
      )}

      {showProfileModal && (
        <UserProfileModal
          currentUser={currentUser}
          onSaveProfile={handleSaveProfile}
          onClose={() => setShowProfileModal(false)}
        />
      )}
    </div>
  );
}

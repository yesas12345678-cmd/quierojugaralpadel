import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import Filters from './components/Filters';
import MatchCard from './components/MatchCard';
import MatchDetailsModal from './components/MatchDetailsModal';
import CreateMatchModal from './components/CreateMatchModal';
import UserProfileModal from './components/UserProfileModal';
import { INITIAL_MATCHES } from './data/mockMatches';
import { PlusCircle, Search, Trophy, MapPin, Users, Flame, Sparkles } from 'lucide-react';

export default function App() {
  // Persistence in LocalStorage
  const [matches, setMatches] = useState(() => {
    const saved = localStorage.getItem('padel_matches_v1');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_MATCHES;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('padel_user_v1');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return {
      id: 'usr-default',
      name: 'Alejandro M.',
      city: 'Madrid',
      level: 3.5,
      side: 'Revés',
      phone: '+34 612 345 678',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    };
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('padel_matches_v1', JSON.stringify(matches));
  }, [matches]);

  useEffect(() => {
    localStorage.setItem('padel_user_v1', JSON.stringify(currentUser));
  }, [currentUser]);

  // Filters State
  const [selectedCity, setSelectedCity] = useState("Todas las poblaciones");
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
      // City filter
      if (selectedCity !== "Todas las poblaciones" && m.city !== selectedCity) {
        return false;
      }
      // Club/Location search filter
      if (searchClub.trim()) {
        const query = searchClub.toLowerCase();
        const locName = (m.locationName || "").toLowerCase();
        const address = (m.address || "").toLowerCase();
        const city = (m.city || "").toLowerCase();
        if (!locName.includes(query) && !address.includes(query) && !city.includes(query)) {
          return false;
        }
      }
      // Category filter
      if (selectedCategory !== "Todas" && m.category !== selectedCategory) {
        return false;
      }
      // Level filter
      if (selectedLevel !== "Todos") {
        const targetLvl = parseFloat(selectedLevel);
        if (targetLvl < m.minLevel || targetLvl > m.maxLevel) {
          return false;
        }
      }
      // Status filter
      if (statusFilter === "Abiertos") {
        if (m.players.length >= m.maxPlayers) return false;
      } else if (statusFilter === "MisPartidos") {
        if (!currentUser || !m.players.some((p) => p.id === currentUser.id)) return false;
      }

      return true;
    });
  }, [matches, selectedCity, searchClub, selectedCategory, selectedLevel, statusFilter, currentUser]);

  const resetFilters = () => {
    setSelectedCity("Todas las poblaciones");
    setSearchClub("");
    setSelectedCategory("Todas");
    setSelectedLevel("Todos");
    setStatusFilter("Todos");
  };

  // Match Actions
  const handleJoinMatch = (matchToJoin) => {
    if (!currentUser) {
      setShowProfileModal(true);
      return;
    }

    // Check if user already in match
    const isJoined = matchToJoin.players.some((p) => p.id === currentUser.id);
    if (isJoined) return;

    if (matchToJoin.players.length >= matchToJoin.maxPlayers) {
      alert("¡Lo sentimos! Este partido ya ha completado todas sus plazas.");
      return;
    }

    setMatches((prev) =>
      prev.map((m) => {
        if (m.id === matchToJoin.id) {
          const updatedPlayers = [
            ...m.players,
            {
              id: currentUser.id,
              name: currentUser.name,
              level: currentUser.level,
              side: currentUser.side,
              avatar: currentUser.avatar,
              confirmed: true
            }
          ];
          const updatedMatch = { ...m, players: updatedPlayers };
          if (activeModalMatch && activeModalMatch.id === m.id) {
            setActiveModalMatch(updatedMatch);
          }
          return updatedMatch;
        }
        return m;
      })
    );
  };

  const handleLeaveMatch = (matchId) => {
    if (!currentUser) return;
    setMatches((prev) =>
      prev.map((m) => {
        if (m.id === matchId) {
          const updatedPlayers = m.players.filter((p) => p.id !== currentUser.id);
          const updatedMatch = { ...m, players: updatedPlayers };
          if (activeModalMatch && activeModalMatch.id === m.id) {
            setActiveModalMatch(updatedMatch);
          }
          return updatedMatch;
        }
        return m;
      })
    );
  };

  const handleCreateMatch = (newMatch) => {
    setMatches((prev) => [newMatch, ...prev]);
  };

  const handleAddComment = (matchId, text) => {
    if (!currentUser) return;
    const newComment = {
      id: `c-${Date.now()}`,
      sender: currentUser.name,
      text,
      timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    };

    setMatches((prev) =>
      prev.map((m) => {
        if (m.id === matchId) {
          const comments = m.comments ? [...m.comments, newComment] : [newComment];
          const updatedMatch = { ...m, comments };
          if (activeModalMatch && activeModalMatch.id === m.id) {
            setActiveModalMatch(updatedMatch);
          }
          return updatedMatch;
        }
        return m;
      })
    );
  };

  return (
    <div className="app-layout">
      {/* Top Header */}
      <Header
        currentUser={currentUser}
        onOpenProfile={() => setShowProfileModal(true)}
        onOpenCreateMatch={() => setShowCreateMatch(true)}
        selectedCity={selectedCity}
      />

      <main className="main-content">
        {/* Hero Section */}
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
                <span>Ámbito Nacional (Cualquier Ciudad)</span>
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

        {/* Filter Section */}
        <Filters
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
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

        {/* Matches Grid */}
        {filteredMatches.length > 0 ? (
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

      {/* Modals */}
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
          onSaveProfile={(updatedUser) => setCurrentUser(updatedUser)}
          onClose={() => setShowProfileModal(false)}
        />
      )}
    </div>
  );
}

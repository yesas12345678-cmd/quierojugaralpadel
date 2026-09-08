import React from 'react';
import { Calendar, Clock, MapPin, Euro, UserPlus, CheckCircle, Info, Trophy } from 'lucide-react';

export default function MatchCard({ match, currentUser, onSelectMatch, onJoinMatch }) {
  const confirmedCount = match.players ? match.players.length : 0;
  const isFull = confirmedCount >= match.maxPlayers;
  const isUserJoined = currentUser && match.players.some(p => p.id === currentUser.id);

  // Format date nicely (e.g., "Miércoles, 9 Sep")
  const formatDate = (dateStr) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
        return dateObj.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' });
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  // Build 4 slots array
  const slots = Array.from({ length: match.maxPlayers }, (_, index) => {
    return match.players && match.players[index] ? match.players[index] : null;
  });

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="card-header">
        <div>
          <span className="city-badge">{match.city}</span>
          <h3 className="card-title">{match.locationName}</h3>
          <div className="card-address">
            <MapPin size={13} />
            <span>{match.address}</span>
          </div>
        </div>
        <span className={`category-tag ${match.category}`}>
          {match.category}
        </span>
      </div>

      <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div className="meta-row">
            <div className="meta-item">
              <Calendar size={15} />
              <span>{formatDate(match.date)}</span>
            </div>
            <div className="meta-item">
              <Clock size={15} />
              <span>{match.time} hs ({match.durationMinutes} min)</span>
            </div>
            <div className="meta-item" style={{ color: 'var(--primary-neon)', fontWeight: '700' }}>
              <Euro size={15} />
              <span>{match.pricePerPlayer.toFixed(2)}€/p</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div className="level-meter">
              <Trophy size={13} />
              <span>Nivel {match.minLevel} - {match.maxLevel}</span>
            </div>

            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Pista: <strong style={{ color: 'var(--text-main)' }}>{match.courtType}</strong>
            </div>
          </div>

          {/* Court Slots View */}
          <div className="court-slots-container">
            <div className="slots-title">
              <span>Jugadores ({confirmedCount}/{match.maxPlayers})</span>
              <span>{isFull ? '¡Partido Completo!' : `Faltan ${match.maxPlayers - confirmedCount}`}</span>
            </div>

            <div className="slots-grid">
              {slots.map((player, idx) => (
                <div key={idx} className={`slot-box ${player ? 'occupied' : ''}`}>
                  {player ? (
                    <>
                      <img src={player.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"} alt={player.name} className="player-avatar" />
                      <span className="player-name">{player.name.split(' ')[0]}</span>
                      <span className="player-side">{player.side || 'Pádel'}</span>
                    </>
                  ) : (
                    <div style={{ padding: '4px' }}>
                      <span style={{ fontSize: '1.2rem', display: 'block' }}>🎾</span>
                      <span className="slot-empty">Libre</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
          <button
            className="btn-secondary"
            onClick={() => onSelectMatch(match)}
            style={{ flex: 1, justifyContent: 'center' }}
          >
            <Info size={16} />
            <span>Detalles</span>
          </button>

          {isUserJoined ? (
            <button
              className="btn-secondary"
              onClick={() => onSelectMatch(match)}
              style={{ background: 'rgba(34, 197, 94, 0.15)', borderColor: 'rgba(34, 197, 94, 0.4)', color: '#4ade80', justifyContent: 'center' }}
            >
              <CheckCircle size={16} />
              <span>Inscrito</span>
            </button>
          ) : isFull ? (
            <button
              className="btn-secondary"
              disabled
              style={{ opacity: 0.5, cursor: 'not-allowed', justifyContent: 'center' }}
            >
              Completo
            </button>
          ) : (
            <button
              className="btn-primary"
              onClick={() => onJoinMatch(match)}
              style={{ justifyContent: 'center' }}
            >
              <UserPlus size={16} />
              <span>Unirme</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

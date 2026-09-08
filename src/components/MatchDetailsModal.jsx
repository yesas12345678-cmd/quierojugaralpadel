import React, { useState } from 'react';
import { X, MapPin, Calendar, Clock, Euro, Users, Trophy, MessageSquare, Send, CheckCircle, LogOut } from 'lucide-react';

export default function MatchDetailsModal({ match, currentUser, onClose, onJoinMatch, onLeaveMatch, onAddComment }) {
  const [commentText, setCommentText] = useState('');

  if (!match) return null;

  const isUserJoined = currentUser && match.players.some(p => p.id === currentUser.id);
  const isFull = match.players.length >= match.maxPlayers;

  const handleSendComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(match.id, commentText.trim());
    setCommentText('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="city-badge">{match.city}</span>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>{match.locationName}</h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Main Info */}
          <div className="meta-row" style={{ padding: '14px 18px', marginBottom: '20px' }}>
            <div className="meta-item">
              <Calendar size={18} />
              <span>{match.date}</span>
            </div>
            <div className="meta-item">
              <Clock size={18} />
              <span>{match.time} hs</span>
            </div>
            <div className="meta-item" style={{ color: 'var(--primary-neon)', fontWeight: 800 }}>
              <Euro size={18} />
              <span>{match.pricePerPlayer.toFixed(2)}€ / jugador</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Dirección de Pista / Club:</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={14} color="#38bdf8" />
                <span>{match.address}</span>
              </div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Tipo de Pista y Nivel:</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Trophy size={14} color="var(--primary-neon)" />
                <span>{match.courtType} • Nivel {match.minLevel}-{match.maxLevel}</span>
              </div>
            </div>
          </div>

          {match.description && (
            <div style={{ marginBottom: '24px', background: 'rgba(204, 255, 0, 0.04)', border: '1px solid var(--border-highlight)', padding: '12px 16px', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary-neon)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                Nota del Organizador ({match.organizer?.name}):
              </div>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-main)' }}>{match.description}</p>
            </div>
          )}

          {/* Players List */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={18} color="var(--primary-neon)" />
              <span>Jugadores Inscritos ({match.players.length}/{match.maxPlayers})</span>
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
              {match.players.map((p) => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(30, 41, 59, 0.5)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                  <img src={p.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"} alt={p.name} className="player-avatar" style={{ width: '40px', height: '40px' }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{p.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Nivel: <strong style={{ color: 'var(--primary-neon)' }}>{p.level}</strong> • Posición: <strong>{p.side || 'Indiferente'}</strong>
                    </div>
                  </div>
                </div>
              ))}

              {Array.from({ length: match.maxPlayers - match.players.length }).map((_, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(15, 23, 42, 0.4)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--border-color)', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                  <span>🎾 Plaza Libre</span>
                </div>
              ))}
            </div>
          </div>

          {/* Match Chat / Comments */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquare size={18} color="#38bdf8" />
              <span>Chat del Partido ({match.comments ? match.comments.length : 0})</span>
            </h3>

            <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '14px', maxHeight: '180px', overflowY: 'auto', marginBottom: '12px' }}>
              {match.comments && match.comments.length > 0 ? (
                match.comments.map((c) => (
                  <div key={c.id} style={{ marginBottom: '10px', fontSize: '0.88rem' }}>
                    <span style={{ fontWeight: 700, color: 'var(--primary-neon)', marginRight: '6px' }}>{c.sender}:</span>
                    <span style={{ color: 'var(--text-main)' }}>{c.text}</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginLeft: '8px' }}>{c.timestamp}</span>
                  </div>
                ))
              ) : (
                <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', textAlign: 'center', padding: '10px' }}>
                  No hay mensajes aún. ¡Sé el primero en saludar al grupo!
                </div>
              )}
            </div>

            <form onSubmit={handleSendComment} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="Escribe un mensaje para los jugadores..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                style={{ flex: 1 }}
              />
              <button type="submit" className="btn-primary" style={{ padding: '0 16px' }}>
                <Send size={16} />
              </button>
            </form>
          </div>

          {/* Action Footer */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            {isUserJoined ? (
              <button
                className="btn-secondary"
                onClick={() => onLeaveMatch(match.id)}
                style={{ flex: 1, background: 'rgba(239, 68, 68, 0.15)', borderColor: 'rgba(239, 68, 68, 0.4)', color: '#f87171', justifyContent: 'center' }}
              >
                <LogOut size={16} />
                <span>Salirme del Partido</span>
              </button>
            ) : isFull ? (
              <button className="btn-secondary" disabled style={{ flex: 1, opacity: 0.5, justifyContent: 'center' }}>
                Partido Completo
              </button>
            ) : (
              <button
                className="btn-primary"
                onClick={() => onJoinMatch(match)}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                <CheckCircle size={18} />
                <span>Inscribirme Ahora</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

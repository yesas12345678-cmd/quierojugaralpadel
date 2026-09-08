import React from 'react';
import { PlusCircle, User, MapPin, Trophy, ShieldCheck } from 'lucide-react';

export default function Header({ currentUser, onOpenProfile, onOpenCreateMatch, selectedCity }) {
  return (
    <header className="header-nav">
      <div className="header-container">
        <div className="logo-group">
          <div className="logo-badge">🎾</div>
          <div className="logo-text">
            QuieroJugarAlPádel
            <sub>Red Nacional Independiente</sub>
          </div>
        </div>

        <div className="user-actions">
          {selectedCity && selectedCity !== "Todas las poblaciones" && selectedCity !== "Todas las provincias" && (
            <div className="stat-pill" style={{ background: 'rgba(56, 189, 248, 0.1)', borderColor: 'rgba(56, 189, 248, 0.3)', color: '#38bdf8' }}>
              <MapPin size={14} />
              <span>{selectedCity}</span>
            </div>
          )}

          <button className="btn-secondary" onClick={onOpenProfile}>
            <User size={16} />
            <span>{currentUser ? currentUser.name : "Mi Perfil"}</span>
            {currentUser && (
              <span className="level-meter" style={{ fontSize: '0.75rem', padding: '1px 6px', background: currentUser.isVerified ? 'rgba(34, 197, 94, 0.15)' : undefined, color: currentUser.isVerified ? '#4ade80' : undefined }}>
                {currentUser.isVerified ? <ShieldCheck size={11} /> : null} Nivel {currentUser.level}
              </span>
            )}
          </button>

          <button className="btn-primary" onClick={onOpenCreateMatch}>
            <PlusCircle size={18} />
            <span>Organizar Partido</span>
          </button>
        </div>
      </div>
    </header>
  );
}

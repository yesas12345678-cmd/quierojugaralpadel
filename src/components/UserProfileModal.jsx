import React, { useState, useRef } from 'react';
import { X, User, MapPin, Trophy, Phone, Check, Shield, Upload, Camera } from 'lucide-react';
import { SPANISH_CITIES } from '../data/mockMatches';

const AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80"
];

export default function UserProfileModal({ currentUser, onSaveProfile, onClose }) {
  const [name, setName] = useState(currentUser?.name || 'Jugador de Pádel');
  const [city, setCity] = useState(currentUser?.city || 'Madrid');
  const [customCity, setCustomCity] = useState('');
  const [level, setLevel] = useState(currentUser?.level || 3.5);
  const [side, setSide] = useState(currentUser?.side || 'Indiferente');
  const [phone, setPhone] = useState(currentUser?.phone || '+34 600 000 000');
  const [avatar, setAvatar] = useState(currentUser?.avatar || AVATARS[0]);

  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen debe pesar menos de 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalCity = city === 'OTRA' ? customCity.trim() || 'Madrid' : city;

    const updatedUser = {
      id: currentUser?.id || `usr-${Date.now()}`,
      name: name.trim() || 'Jugador Pádel',
      city: finalCity,
      level: Number(level),
      side,
      phone,
      avatar
    };

    onSaveProfile(updatedUser);
    onClose();
  };

  const isCustomPhoto = !AVATARS.includes(avatar);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="logo-badge" style={{ width: '36px', height: '36px', fontSize: '1.1rem' }}>👤</div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Registro de Jugador Nacional</h2>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Configura tu perfil para unirte y crear partidos</div>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            {/* Avatar & Photo Upload Selector */}
            <div className="form-group" style={{ textAlign: 'center', marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '10px' }}>Foto de Perfil / Avatar</label>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
                {AVATARS.map((imgUrl, idx) => (
                  <img
                    key={idx}
                    src={imgUrl}
                    alt={`Avatar ${idx}`}
                    onClick={() => setAvatar(imgUrl)}
                    className="player-avatar"
                    style={{
                      width: '46px',
                      height: '46px',
                      cursor: 'pointer',
                      borderColor: avatar === imgUrl ? 'var(--primary-neon)' : 'transparent',
                      transform: avatar === imgUrl ? 'scale(1.15)' : 'scale(1)',
                      boxShadow: avatar === imgUrl ? 'var(--shadow-neon)' : 'none',
                      transition: 'all 0.2s ease'
                    }}
                  />
                ))}

                {/* Custom Uploaded Photo Circle */}
                {isCustomPhoto && (
                  <div style={{ position: 'relative' }}>
                    <img
                      src={avatar}
                      alt="Foto personalizada"
                      className="player-avatar"
                      style={{
                        width: '46px',
                        height: '46px',
                        borderColor: 'var(--primary-neon)',
                        transform: 'scale(1.15)',
                        boxShadow: 'var(--shadow-neon)'
                      }}
                    />
                    <span style={{ position: 'absolute', bottom: '-2px', right: '-2px', background: 'var(--primary-neon)', color: '#000', borderRadius: '50%', width: '16px', height: '16px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>✓</span>
                  </div>
                )}

                {/* File Upload Button */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  className="btn-secondary"
                  style={{
                    padding: '8px 14px',
                    fontSize: '0.82rem',
                    borderRadius: 'var(--radius-full)',
                    borderColor: 'var(--primary-neon)',
                    color: 'var(--primary-neon)',
                    background: 'rgba(204, 255, 0, 0.08)'
                  }}
                >
                  <Camera size={15} />
                  <span>{isCustomPhoto ? 'Cambiar Foto' : 'Subir tu Foto'}</span>
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Nombre y Apellidos *</label>
              <input
                type="text"
                placeholder="Ej. Alejandro Gómez"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Población Habítual *</label>
                <select value={city} onChange={(e) => setCity(e.target.value)}>
                  {SPANISH_CITIES.filter(c => c !== "Todas las poblaciones").map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                  <option value="OTRA">+ Otra población</option>
                </select>
              </div>

              {city === 'OTRA' && (
                <div className="form-group">
                  <label>Tu Población</label>
                  <input
                    type="text"
                    placeholder="Ej. Segovia, Pamplona..."
                    value={customCity}
                    onChange={(e) => setCustomCity(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label>Nivel de Pádel (1.0 - 7.0) *</label>
                <select value={level} onChange={(e) => setLevel(e.target.value)}>
                  <option value={2.0}>2.0 - Iniciación / Primeros partidos</option>
                  <option value={2.5}>2.5 - Principiante / Control básico</option>
                  <option value={3.0}>3.0 - Medio Bajo / Mantiene peloteo</option>
                  <option value={3.5}>3.5 - Medio / Domina pared y volea</option>
                  <option value={4.0}>4.0 - Medio Alto / Remate y bandeja sólida</option>
                  <option value={4.5}>4.5 - Avanzado / Ritmo alto y táctica</option>
                  <option value={5.0}>5.0 - Competición / Torneísta</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Posición en Pista Preferida</label>
                <select value={side} onChange={(e) => setSide(e.target.value)}>
                  <option value="Drive">Drive (Derecha)</option>
                  <option value="Revés">Revés (Izquierda)</option>
                  <option value="Indiferente">Indiferente (Ambos lados)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Teléfono / WhatsApp de Contacto</label>
                <input
                  type="text"
                  placeholder="+34 600 000 000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginBottom: '20px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              🔒 Tus datos de contacto solo se mostrarán a los jugadores confirmados dentro del chat de tu partido.
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="button" className="btn-secondary" onClick={onClose} style={{ flex: 1, justifyContent: 'center' }}>
                Cancelar
              </button>
              <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                <Check size={18} />
                <span>Guardar Perfil</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

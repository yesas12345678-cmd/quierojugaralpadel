import React, { useState } from 'react';
import { X, PlusCircle, MapPin, Calendar, Clock, Euro, Trophy, ShieldCheck } from 'lucide-react';
import { SPANISH_PROVINCES } from '../data/mockMatches';

export default function CreateMatchModal({ currentUser, onClose, onCreateMatch }) {
  const [province, setProvince] = useState(currentUser?.province || 'Madrid');
  const [city, setCity] = useState(currentUser?.city || 'Madrid Capital');
  const [locationName, setLocationName] = useState('');
  const [address, setAddress] = useState('');
  const [courtType, setCourtType] = useState('Cristal - Cubierta');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('19:00');
  const [durationMinutes, setDurationMinutes] = useState(90);
  const [category, setCategory] = useState('Abierto');
  const [minLevel, setMinLevel] = useState(3.0);
  const [maxLevel, setMaxLevel] = useState(4.0);
  const [pricePerPlayer, setPricePerPlayer] = useState(5.0);
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!locationName.trim()) {
      alert('Por favor introduce el nombre del club o pista municipal');
      return;
    }
    if (!city.trim()) {
      alert('Por favor introduce el pueblo o ciudad');
      return;
    }

    const newMatch = {
      id: `match-${Date.now()}`,
      province,
      city: city.trim(),
      locationName: locationName.trim(),
      address: address.trim() || `${locationName}, ${city.trim()} (${province})`,
      courtType,
      date,
      time,
      durationMinutes: Number(durationMinutes),
      category,
      minLevel: Number(minLevel),
      maxLevel: Number(maxLevel),
      pricePerPlayer: Number(pricePerPlayer),
      organizer: {
        id: currentUser.id,
        name: currentUser.name,
        province,
        city: city.trim(),
        level: currentUser.level,
        side: currentUser.side,
        avatar: currentUser.avatar
      },
      players: [
        {
          id: currentUser.id,
          name: currentUser.name,
          level: currentUser.level,
          side: currentUser.side,
          avatar: currentUser.avatar,
          confirmed: true
        }
      ],
      maxPlayers: 4,
      description: description.trim(),
      comments: [
        {
          id: `c-${Date.now()}`,
          sender: currentUser.name,
          text: `¡Partido creado por ${currentUser.name}! Os espero a la hora acordada.`,
          timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };

    onCreateMatch(newMatch);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="logo-badge" style={{ width: '36px', height: '36px', fontSize: '1.1rem' }}>🎾</div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Organizar Partido Independiente</h2>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Publica un partido en cualquier provincia y pueblo/ciudad</div>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Provincia *</label>
                <select value={province} onChange={(e) => setProvince(e.target.value)}>
                  {SPANISH_PROVINCES.filter(p => p !== "Todas las provincias").map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Pueblo / Ciudad *</label>
                <input
                  type="text"
                  placeholder="Ej. Alcobendas, Dos Hermanas, Córdoba capital..."
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>
            </div>

              <div className="form-group">
                <label>Nombre del Club o Pista *</label>
                <input
                  type="text"
                  placeholder="Ej. Pistas Municipales San Juan / Padel Center"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  required
                />
              </div>

            <div className="form-group">
              <label>Dirección o Referencia de Ubicación</label>
              <input
                type="text"
                placeholder="Ej. Av. de la Dehesa s/n, junto al polideportivo"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Fecha del Partido *</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Hora de Inicio *</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Modalidad *</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="Abierto">Abierto (Cualquier persona)</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Mixto">Mixto</option>
                </select>
              </div>

              <div className="form-group">
                <label>Tipo de Pista</label>
                <select value={courtType} onChange={(e) => setCourtType(e.target.value)}>
                  <option value="Cristal - Cubierta">Cristal - Cubierta</option>
                  <option value="Cristal - Exterior">Cristal - Exterior</option>
                  <option value="Muro - Exterior">Muro - Exterior</option>
                  <option value="Moqueta - Cubierta">Moqueta - Cubierta</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Nivel Mínimo (1.0 - 7.0)</label>
                <input
                  type="number"
                  step="0.1"
                  min="1.0"
                  max="7.0"
                  value={minLevel}
                  onChange={(e) => setMinLevel(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Nivel Máximo (1.0 - 7.0)</label>
                <input
                  type="number"
                  step="0.1"
                  min="1.0"
                  max="7.0"
                  value={maxLevel}
                  onChange={(e) => setMaxLevel(e.target.value)}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Precio por Jugador (€)</label>
                <input
                  type="number"
                  step="0.50"
                  min="0"
                  value={pricePerPlayer}
                  onChange={(e) => setPricePerPlayer(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Duración (Minutos)</label>
                <select value={durationMinutes} onChange={(e) => setDurationMinutes(e.target.value)}>
                  <option value={60}>60 minutos</option>
                  <option value={90}>90 minutos (Estándar)</option>
                  <option value={120}>120 minutos (2 horas)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Nota o Comentarios para los Jugadores</label>
              <textarea
                rows={3}
                placeholder="Ej. Reserva confirmada. Pongo bolas nuevas ProS. Buscamos juego rápido."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button type="button" className="btn-secondary" onClick={onClose} style={{ flex: 1, justifyContent: 'center' }}>
                Cancelar
              </button>
              <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                <PlusCircle size={18} />
                <span>Publicar Partido</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

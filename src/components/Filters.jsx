import React from 'react';
import { Search, MapPin, Filter, Calendar, Users, Trophy } from 'lucide-react';
import { SPANISH_CITIES } from '../data/mockMatches';

export default function Filters({
  selectedCity,
  setSelectedCity,
  searchClub,
  setSearchClub,
  selectedCategory,
  setSelectedCategory,
  selectedLevel,
  setSelectedLevel,
  statusFilter,
  setStatusFilter,
  resetFilters,
  totalMatches
}) {
  return (
    <div className="glass-card" style={{ padding: '20px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', fontSize: '1.05rem' }}>
          <Filter size={18} color="var(--primary-neon)" />
          <span>Buscador y Filtros de Partidos</span>
          <span style={{ fontSize: '0.82rem', background: 'rgba(255, 255, 255, 0.08)', padding: '2px 8px', borderRadius: '12px', color: 'var(--text-muted)' }}>
            {totalMatches} partido{totalMatches !== 1 ? 's' : ''} encontrado{totalMatches !== 1 ? 's' : ''}
          </span>
        </div>

        <button className="btn-ghost" onClick={resetFilters} style={{ fontSize: '0.82rem', color: 'var(--primary-neon)' }}>
          Restablecer Filtros
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
        {/* City Filter */}
        <div className="form-group" style={{ margin: 0 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={14} color="#38bdf8" />
            <span>Población / Ciudad</span>
          </label>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            style={{ width: '100%' }}
          >
            {SPANISH_CITIES.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Club or Location Search */}
        <div className="form-group" style={{ margin: 0 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Search size={14} color="var(--primary-neon)" />
            <span>Club o Nombre de Pista</span>
          </label>
          <input
            type="text"
            placeholder="Ej. Alcobendas, Turia, Teatinos..."
            value={searchClub}
            onChange={(e) => setSearchClub(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>

        {/* Category */}
        <div className="form-group" style={{ margin: 0 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Users size={14} color="#c084fc" />
            <span>Modalidad</span>
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ width: '100%' }}
          >
            <option value="Todas">Todas las modalidades</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
            <option value="Mixto">Mixto</option>
            <option value="Abierto">Abierto a tod@s</option>
          </select>
        </div>

        {/* Level filter */}
        <div className="form-group" style={{ margin: 0 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Trophy size={14} color="#22c55e" />
            <span>Nivel de Pádel</span>
          </label>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            style={{ width: '100%' }}
          >
            <option value="Todos">Todos los niveles</option>
            <option value="2.0">Nivel 2.0 - Iniciación</option>
            <option value="3.0">Nivel 3.0 - Medio</option>
            <option value="4.0">Nivel 4.0 - Medio Alto</option>
            <option value="5.0">Nivel 5.0 - Avanzado</option>
          </select>
        </div>

        {/* Status filter */}
        <div className="form-group" style={{ margin: 0 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={14} color="#f59e0b" />
            <span>Estado de Plazas</span>
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: '100%' }}
          >
            <option value="Todos">Todos los partidos</option>
            <option value="Abiertos">Solo con plazas libres</option>
            <option value="MisPartidos">Partidos en los que estoy</option>
          </select>
        </div>
      </div>
    </div>
  );
}

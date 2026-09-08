import React from 'react';
import { Search, MapPin, Filter, Calendar, Users, Trophy } from 'lucide-react';
import { SPANISH_PROVINCES } from '../data/mockMatches';

export default function Filters({
  selectedProvince,
  setSelectedProvince,
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
        {/* Province Filter */}
        <div className="form-group" style={{ margin: 0 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={14} color="#38bdf8" />
            <span>Provincia</span>
          </label>
          <select
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
            style={{ width: '100%' }}
          >
            {SPANISH_PROVINCES.map((prov) => (
              <option key={prov} value={prov}>
                {prov}
              </option>
            ))}
          </select>
        </div>

        {/* Town / City or Club Search */}
        <div className="form-group" style={{ margin: 0 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Search size={14} color="var(--primary-neon)" />
            <span>Pueblo / Ciudad o Club</span>
          </label>
          <input
            type="text"
            placeholder="Ej. Alcobendas, Córdoba, Nazaret..."
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
            <option value="1.0">Nivel 1.0 - Principiante Absoluto</option>
            <option value="1.5">Nivel 1.5 - Iniciación Básico</option>
            <option value="2.0">Nivel 2.0 - Iniciación</option>
            <option value="2.5">Nivel 2.5 - Principiante</option>
            <option value="3.0">Nivel 3.0 - Medio Bajo</option>
            <option value="3.5">Nivel 3.5 - Medio</option>
            <option value="4.0">Nivel 4.0 - Medio Alto</option>
            <option value="4.5">Nivel 4.5 - Avanzado</option>
            <option value="5.0">Nivel 5.0 - Competición</option>
            <option value="5.5">Nivel 5.5 - Alta Competición</option>
            <option value="6.0">Nivel 6.0 - Profesional</option>
            <option value="6.5">Nivel 6.5 - Élite Pro</option>
            <option value="7.0">Nivel 7.0 - Máximo Nivel Mundial</option>
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

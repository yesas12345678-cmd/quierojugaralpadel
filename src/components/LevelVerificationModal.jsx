import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, Award, Link, Star, ChevronRight, HelpCircle, ArrowLeft } from 'lucide-react';

const QUESTIONNAIRE = [
  {
    id: 'exp',
    question: '1. ¿Cuánto tiempo llevas jugando al pádel con regularidad?',
    options: [
      { text: 'Menos de 6 meses (Iniciación)', score: 1.5 },
      { text: 'Entre 6 meses y 2 años', score: 2.5 },
      { text: 'Entre 2 y 5 años (Jugador habitual)', score: 3.5 },
      { text: 'Más de 5 años o juego federado', score: 4.5 }
    ]
  },
  {
    id: 'walls',
    question: '2. ¿Cómo dominas el juego con las paredes?',
    options: [
      { text: 'Me cuesta leer los rebotes o evito que la bola toque la pared', score: 2.0 },
      { text: 'Devuelvo la bola tras rebote básico en pared de fondo', score: 3.0 },
      { text: 'Domino la salida de pared de fondo (derecha y revés) con dirección', score: 4.0 },
      { text: 'Hago bajadas de pared agresivas y controlo dobles paredes', score: 5.0 }
    ]
  },
  {
    id: 'net',
    question: '3. ¿Cómo es tu juego en la red (volea y bandeja)?',
    options: [
      { text: 'Voleo con dudas y suelo dejar bolas vendidas', score: 2.0 },
      { text: 'Volea firme y bandeja defensiva para mantener la red', score: 3.5 },
      { text: 'Voleas profundas con efecto y bandeja/víbora de ataque continua', score: 4.5 },
      { text: 'Remate por 3 / por 4 habitual y dominio absoluto de la red', score: 5.5 }
    ]
  },
  {
    id: 'tactics',
    question: '4. ¿Cómo es tu consistencia táctica y saque/resto?',
    options: [
      { text: 'Cometo bastantes errores no forzados en peloteos largos', score: 2.5 },
      { text: 'Buena regularidad, saco con intención y juego cruzado', score: 3.5 },
      { text: 'Leo bien los espacios, cambio de ritmo y fallo muy poco', score: 4.5 },
      { text: 'Táctica avanzada de torneo, manejo de tiempos y presión', score: 5.5 }
    ]
  }
];

export default function LevelVerificationModal({ currentUser, onSaveVerification, onClose }) {
  const [tab, setTab] = useState('menu'); // 'menu' | 'test' | 'playtomic' | 'result'
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [playtomicUrl, setPlaytomicUrl] = useState(currentUser?.playtomicUrl || '');
  const [calculatedLevel, setCalculatedLevel] = useState(null);

  const handleAnswerSelect = (score) => {
    const newAnswers = { ...answers, [currentQuestion]: score };
    setAnswers(newAnswers);

    if (currentQuestion < QUESTIONNAIRE.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate average level
      const total = Object.values(newAnswers).reduce((a, b) => a + b, 0);
      const avg = Math.round((total / QUESTIONNAIRE.length) * 2) / 2; // Round to nearest 0.5
      setCalculatedLevel(avg);
      setTab('result');
    }
  };

  const handleConfirmTestLevel = () => {
    onSaveVerification({
      isVerified: true,
      verificationMethod: 'Test Oficial de Evaluación',
      verifiedLevel: calculatedLevel,
      playtomicUrl: playtomicUrl
    });
    onClose();
  };

  const handleSavePlaytomic = (e) => {
    e.preventDefault();
    if (!playtomicUrl.trim()) return;
    onSaveVerification({
      isVerified: true,
      verificationMethod: 'Verificado vía Playtomic',
      verifiedLevel: currentUser.level,
      playtomicUrl: playtomicUrl.trim()
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '560px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="logo-badge" style={{ width: '36px', height: '36px', fontSize: '1.1rem', background: 'linear-gradient(135deg, #22c55e 0%, #a8e000 100%)' }}>
              <ShieldCheck size={20} color="#000" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Verificación de Nivel de Pádel</h2>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Garantiza partidos equilibrados y fiables</div>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {tab === 'menu' && (
            <div>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                Verificar tu nivel da confianza a los organizadores y evita partidos descompensados. Elige una de las formas de comprobación:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Option 1: Questionnaire Test */}
                <div
                  onClick={() => { setTab('test'); setCurrentQuestion(0); setAnswers({}); }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid var(--border-highlight)',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease'
                  }}
                  className="glass-card"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ background: 'rgba(204, 255, 0, 0.15)', padding: '10px', borderRadius: '50%', color: 'var(--primary-neon)' }}>
                      <Award size={22} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.98rem' }}>Test de Autoevaluación Táctica</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Responde 4 preguntas breves sobre tu juego en pista</div>
                    </div>
                  </div>
                  <ChevronRight size={20} color="var(--primary-neon)" />
                </div>

                {/* Option 2: Playtomic Link */}
                <div
                  onClick={() => setTab('playtomic')}
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease'
                  }}
                  className="glass-card"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ background: 'rgba(56, 189, 248, 0.15)', padding: '10px', borderRadius: '50%', color: '#38bdf8' }}>
                      <Link size={22} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.98rem' }}>Vincular Enlace / Nivel Playtomic</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Añade el enlace a tu perfil oficial de Playtomic</div>
                    </div>
                  </div>
                  <ChevronRight size={20} color="#38bdf8" />
                </div>

                {/* Peer Verification Info */}
                <div style={{ background: 'rgba(34, 197, 94, 0.06)', border: '1px dashed rgba(34, 197, 94, 0.3)', borderRadius: 'var(--radius-sm)', padding: '14px', marginTop: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: '#4ade80', fontSize: '0.88rem', marginBottom: '4px' }}>
                    <Star size={16} />
                    <span>Valoraciones por Compañeros de Partido</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Al finalizar cada partido organizado en la plataforma, tus rivales y compañeros podrán ratificar si tu nivel en pista se corresponde con el indicado en tu perfil.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Test State */}
          {tab === 'test' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <button className="btn-ghost" onClick={() => setTab('menu')} style={{ fontSize: '0.82rem', padding: '4px 8px' }}>
                  <ArrowLeft size={14} /> Volver
                </button>
                <span style={{ fontSize: '0.8rem', color: 'var(--primary-neon)', fontWeight: 700 }}>
                  Pregunta {currentQuestion + 1} de {QUESTIONNAIRE.length}
                </span>
              </div>

              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px', color: 'var(--text-main)' }}>
                {QUESTIONNAIRE[currentQuestion].question}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {QUESTIONNAIRE[currentQuestion].options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswerSelect(opt.score)}
                    className="btn-secondary"
                    style={{
                      justifyContent: 'flex-start',
                      padding: '12px 16px',
                      textAlign: 'left',
                      background: 'rgba(255, 255, 255, 0.04)',
                      borderColor: 'var(--border-color)',
                      fontSize: '0.88rem'
                    }}
                  >
                    <span>{opt.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Result State */}
          {tab === 'result' && (
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <div style={{ width: '64px', height: '64px', background: 'rgba(204, 255, 0, 0.15)', border: '2px solid var(--primary-neon)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--primary-neon)' }}>
                <CheckCircle2 size={36} />
              </div>

              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '6px' }}>¡Nivel Calculado y Verificado!</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
                Según tus respuestas tácticas y técnicas en pista, tu nivel verificado es:
              </p>

              <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--border-highlight)', padding: '20px', borderRadius: 'var(--radius-md)', display: 'inline-block', marginBottom: '24px' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--primary-neon)' }}>
                  Nivel {calculatedLevel}
                </div>
                <span className="level-meter" style={{ marginTop: '6px' }}>
                  ✓ Verificado por Test Oficial
                </span>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn-secondary" onClick={() => setTab('test')} style={{ flex: 1, justifyContent: 'center' }}>
                  Repetir Test
                </button>
                <button className="btn-primary" onClick={handleConfirmTestLevel} style={{ flex: 1, justifyContent: 'center' }}>
                  Guardar Nivel Verificado
                </button>
              </div>
            </div>
          )}

          {/* Playtomic State */}
          {tab === 'playtomic' && (
            <form onSubmit={handleSavePlaytomic}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <button type="button" className="btn-ghost" onClick={() => setTab('menu')} style={{ fontSize: '0.82rem', padding: '4px 8px' }}>
                  <ArrowLeft size={14} /> Volver
                </button>
              </div>

              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>Verificación mediante Playtomic</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Copia y pega la URL de tu perfil público de Playtomic para verificar automáticamente tu nivel en nuestra red.
              </p>

              <div className="form-group">
                <label>Enlace / URL de Perfil de Playtomic</label>
                <input
                  type="url"
                  placeholder="https://playtomic.io/player/..."
                  value={playtomicUrl}
                  onChange={(e) => setPlaytomicUrl(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="btn-secondary" onClick={() => setTab('menu')} style={{ flex: 1, justifyContent: 'center' }}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  Verificar con Playtomic
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

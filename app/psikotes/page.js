'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import SiteHeader from '../../components/SiteHeader';
import SiteFooter from '../../components/SiteFooter';
import { PSIKOTES_MODULES, TIER_ORDER, tierIndex } from '../../lib/packages';
import { Lock, Play, CheckCircle2, ArrowLeft, Trophy, Target, Clock } from 'lucide-react';

export default function PsikotesPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [tier, setTier] = useState('gratis');
  const [loading, setLoading] = useState(true);
  const [activeModule, setActiveModule] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timer, setTimer] = useState(null);
  const [results, setResults] = useState([]);

  useEffect(() => {
    let active = true;
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      if (active) setUser(data.user || null);
      if (active) setLoading(false);
      if (data.user) {
        await loadUserTier(data.user.id);
        await loadUserResults(data.user.id);
      }
    };
    init();
    return () => { active = false; };
  }, []);

  const loadUserTier = async (userId) => {
    const { data: mem } = await supabase
      .from('memberships')
      .select('packages(slug)')
      .eq('user_id', userId)
      .eq('status', 'active');
    if (mem && mem.length) {
      let best = 0;
      mem.forEach((m) => {
        const s = m.packages?.slug;
        if (s) best = Math.max(best, tierIndex(s));
      });
      setTier(TIER_ORDER[best] || 'gratis');
    }
  };

  const loadUserResults = async (userId) => {
    const { data } = await supabase
      .from('psikotes_results')
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })
      .limit(10);
    if (data) setResults(data);
  };

  const isUnlocked = (moduleSlug) => {
    const mod = PSIKOTES_MODULES.find(m => m.slug === moduleSlug);
    if (!mod) return false;
    return tierIndex(tier) >= tierIndex(mod.minTier);
  };

  const startModule = async (slug) => {
    if (!user) { router.push('/member/login?next=/psikotes'); return; }
    if (!isUnlocked(slug)) return;
    const { data } = await supabase
      .from('psikotes_questions')
      .select('*')
      .eq('module_slug', slug)
      .eq('active', true)
      .order('sort_order');
    if (!data?.length) return;
    setActiveModule(PSIKOTES_MODULES.find(m => m.slug === slug));
    setQuestions(data);
    setCurrentQ(0);
    setAnswers([]);
    setSelected(null);
    setShowResult(false);
    setStartTime(Date.now());
    setElapsedTime(0);
    // start timer
    const t = setInterval(() => setElapsedTime(Math.floor((Date.now() - startTime) / 1000)), 1000);
    setTimer(t);
  };

  const handleAnswer = (answer) => { setSelected(answer); };

  const nextQuestion = () => {
    const newAnswers = [...answers, { questionId: questions[currentQ].id, answer: selected, correct: questions[currentQ].correct_answer ? selected === questions[currentQ].correct_answer : true }];
    setAnswers(newAnswers);
    setSelected(null);
    if (currentQ + 1 < questions.length) {
      setCurrentQ(currentQ + 1);
    } else {
      finishTest(newAnswers);
    }
  };

  const finishTest = async (finalAnswers) => {
    clearInterval(timer);
    setTimer(null);
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const correct = finalAnswers.filter(a => a.correct).length;
    const totalQ = questions.length;
    const scr = Math.round((correct / totalQ) * 100);
    setScore(scr);
    setCorrectCount(correct);
    setShowResult(true);

    // save to DB
    if (user) {
      await supabase.from('psikotes_results').insert({
        user_id: user.id,
        module_slug: activeModule.slug,
        score: scr,
        total_questions: totalQ,
        correct_answers: correct,
        time_spent_seconds: timeSpent,
        answers: finalAnswers,
      });
      await loadUserResults(user.id);
    }
  };

  const resetTest = () => {
    setActiveModule(null);
    setQuestions([]);
    setCurrentQ(0);
    setAnswers([]);
    setSelected(null);
    setShowResult(false);
    setScore(0);
  };

  if (loading) {
    return (
      <div>
        <SiteHeader brand="BekasiKerja.id" active="/psikotes" showSearch={false} />
        <main className="container section" style={{ textAlign: 'center' }}>
          <p className="text-muted">Memuat...</p>
        </main>
        <SiteFooter />
      </div>
    );
  }

  // Active Test View
  if (activeModule && !showResult) {
    const q = questions[currentQ];
    return (
      <div>
        <SiteHeader brand="BekasiKerja.id" active="/psikotes" showSearch={false} />
        <main className="container section" style={{ maxWidth: 720 }}>
          <div className="panel" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h2 className="h-section" style={{ fontSize: 20, margin: 0 }}>{activeModule.title}</h2>
                <p className="text-muted" style={{ fontSize: 12, margin: 0 }}>Pertanyaan {currentQ + 1} dari {questions.length}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--hl-blue)', fontWeight: 700 }}>
                <Clock size={16} /> {Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')}
              </div>
            </div>
            {/* Progress */}
            <div style={{ height: 6, background: 'var(--gray-200)', borderRadius: 9999, marginBottom: 24, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${((currentQ + 1) / questions.length) * 100}%`, background: 'var(--hl-blue)', borderRadius: 9999, transition: '.3s' }} />
            </div>
            <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--gray-900)', marginBottom: 24 }}>
              {q.question_text}
            </div>
            <div style={{ display: 'grid', gap: 10, marginBottom: 24 }}>
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(opt)}
                  style={{
                    padding: '14px 18px',
                    border: `2px solid ${selected === opt ? 'var(--hl-blue)' : 'var(--gray-200)'}`,
                    borderRadius: 8,
                    background: selected === opt ? 'rgba(0,92,171,.06)' : '#fff',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: 14,
                    fontWeight: selected === opt ? 600 : 400,
                    transition: '.15s',
                  }}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 24, height: 24, borderRadius: '50%', border: `2px solid ${selected === opt ? 'var(--hl-blue)' : 'var(--gray-300)'}`, background: selected === opt ? 'var(--hl-blue)' : '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {selected === opt && <CheckCircle2 size={14} color="#fff" />}
                    </span>
                    {opt}
                  </span>
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button onClick={resetTest} className="btn-secondary">Batal</button>
              <button onClick={nextQuestion} disabled={!selected} className="btn-primary">
                {currentQ + 1 < questions.length ? 'Selanjutnya' : 'Selesai'}
              </button>
            </div>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  // Result View
  if (showResult) {
    return (
      <div>
        <SiteHeader brand="BekasiKerja.id" active="/psikotes" showSearch={false} />
        <main className="container section" style={{ maxWidth: 720 }}>
          <div className="panel" style={{ padding: 32, textAlign: 'center' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: score >= 70 ? '#e8f7ee' : '#fff0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Trophy size={40} color={score >= 70 ? 'var(--hl-teal)' : 'var(--hl-red)'} />
            </div>
            <h2 className="h-section" style={{ fontSize: 22, margin: 0 }}>Hasil {activeModule.title}</h2>
            <div style={{ fontSize: 48, fontWeight: 800, color: score >= 70 ? 'var(--hl-teal)' : 'var(--hl-blue)', marginTop: 12 }}>{score}</div>
            <p className="text-muted" style={{ fontSize: 14 }}>Nilai</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, margin: '24px 0' }}>
              <div>
                <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--gray-900)' }}>{correctCount}/{questions.length}</div>
                <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>Jawaban Benar</div>
              </div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--gray-900)' }}>{Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')}</div>
                <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>Waktu</div>
              </div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--gray-900)' }}>{score >= 70 ? 'Lulus' : 'Belum'}</div>
                <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>Status</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button onClick={() => startModule(activeModule.slug)} className="btn-primary">Coba Lagi</button>
              <button onClick={resetTest} className="btn-secondary">Kembali ke Daftar</button>
            </div>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  // Default View: Module Catalog
  return (
    <div>
      <SiteHeader brand="BekasiKerja.id" active="/psikotes" showSearch={false} />
      <main className="container section" style={{ maxWidth: 980 }}>
        <section className="panel" style={{ padding: 24 }}>
          <h1 className="h-display" style={{ fontSize: 22, margin: 0 }}>Tes Psikotes & Masuk Kerja</h1>
          <p className="text-muted" style={{ fontSize: 13, marginTop: 8 }}>
            {user ? `Paket aktif: ${tier.toUpperCase()}. Login untuk menyimpan hasil.` : 'Login sebagai member untuk mengakses tes sesuai paketmu.'}
          </p>

          {!user && (
            <div style={{ marginTop: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a href="/member/login?next=/psikotes" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
                <ArrowLeft size={16} /> Login Member
              </a>
              <a href="/member/register" className="btn-secondary" style={{ textDecoration: 'none' }}>Daftar Gratis</a>
            </div>
          )}
        </section>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16, marginTop: 24 }}>
          {PSIKOTES_MODULES.map((m) => {
            const unlocked = user && isUnlocked(m.slug);
            const requiredTier = m.minTier;
            return (
              <div key={m.slug} className="card" style={{ padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h3 className="h-card" style={{ margin: 0 }}>{m.title}</h3>
                  {unlocked ? <Target size={18} color="var(--hl-teal)" /> : <Lock size={18} color="var(--gray-400)" />}
                </div>
                <p className="text-muted" style={{ fontSize: 12, margin: 0 }}>{m.desc}</p>
                <div style={{ marginTop: 14 }}>
                  {unlocked ? (
                    <button onClick={() => startModule(m.slug)} className="btn-primary" style={{ width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                      <Play size={14} /> Mulai Tes
                    </button>
                  ) : (
                    <a
                      href={user ? `/checkout?paket=${requiredTier}` : '/member/login?next=/psikotes'}
                      className="btn-secondary"
                      style={{ width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, textDecoration: 'none', textAlign: 'center' }}
                    >
                      <Lock size={14} /> {user ? `Butuh Paket ${requiredTier.toUpperCase()}` : 'Login'}
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Results */}
        {user && results.length > 0 && (
          <section className="panel" style={{ padding: 20, marginTop: 24 }}>
            <h3 className="h-card" style={{ margin: 0, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Trophy size={18} color="var(--hl-gold)" /> Riwayat Hasil Terbaru
            </h3>
            <div style={{ display: 'grid', gap: 8 }}>
              {results.map((r) => {
                const mod = PSIKOTES_MODULES.find(m => m.slug === r.module_slug);
                return (
                  <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--gray-50)', borderRadius: 8, border: '1px solid var(--gray-200)' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{mod?.title || r.module_slug}</div>
                      <div style={{ fontSize: 11, color: 'var(--gray-500)' }}>{new Date(r.completed_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })} &middot; {r.time_spent_seconds ? `${Math.floor(r.time_spent_seconds / 60)}m ${r.time_spent_seconds % 60}s` : '-'}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700, fontSize: 18, color: r.score >= 70 ? 'var(--hl-teal)' : 'var(--hl-red)' }}>{r.score}</div>
                      <div style={{ fontSize: 11, color: 'var(--gray-500)' }}>{r.correct_answers}/{r.total_questions}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

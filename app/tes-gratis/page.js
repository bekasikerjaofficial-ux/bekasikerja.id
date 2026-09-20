'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import SiteHeader from '../../components/SiteHeader';
import SiteFooter from '../../components/SiteFooter';
import { FREE_TEST_QUESTIONS } from '../../lib/free-test-questions';
import { CheckCircle2, RotateCcw, Sparkles, Target } from 'lucide-react';
import { supabase } from '../../lib/supabase';

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
}

export default function FreeTestPage() {
  const [questions, setQuestions] = useState([]);
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(7 * 60);
  const [timedOut, setTimedOut] = useState(false);
  const [memberLoggedIn, setMemberLoggedIn] = useState(false);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (active) setMemberLoggedIn(Boolean(session?.user));
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setMemberLoggedIn(Boolean(session?.user));
    });
    return () => { active = false; subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    if (!started || finished) return undefined;
    const timer = setInterval(() => {
      setTimeLeft((value) => {
        if (value <= 1) {
          setTimedOut(true);
          setFinished(true);
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, finished]);

  const score = useMemo(() => answers.reduce((total, answer, index) => (
    total + (answer === questions[index]?.answer ? 1 : 0)
  ), 0), [answers, questions]);

  const startTest = () => {
    setQuestions(shuffle(FREE_TEST_QUESTIONS).slice(0, 15));
    setAnswers([]);
    setCurrent(0);
    setFinished(false);
    setTimedOut(false);
    setTimeLeft(7 * 60);
    setStarted(true);
  };

  const chooseAnswer = (answerIndex) => {
    const nextAnswers = [...answers];
    nextAnswers[current] = answerIndex;
    setAnswers(nextAnswers);
  };

  const nextQuestion = () => {
    if (current === questions.length - 1) setFinished(true);
    else setCurrent((value) => value + 1);
  };

  const reset = () => {
    setQuestions([]);
    setAnswers([]);
    setCurrent(0);
    setFinished(false);
    setTimedOut(false);
    setTimeLeft(7 * 60);
    setStarted(false);
  };

  const retakeTest = () => {
    if (!memberLoggedIn) {
      window.location.href = `/member/login?next=${encodeURIComponent('/tes-gratis')}`;
      return;
    }
    startTest();
  };

  return (
    <div>
      <SiteHeader brand="BekasiKerja.id" active="/tes-gratis" showSearch={false} />
      <main className="container section" style={{ maxWidth: 820 }}>
        {!started && (
          <section className="panel free-test-intro">
            <span className="badge-tag news"><Sparkles size={14} /> Gratis</span>
            <h1 className="h-display">Tes Gratis Matematika &amp; Logika</h1>
            <p className="text-muted free-test-lead">
              Uji kemampuan dasar sebelum mengikuti tes kerja. Kerjakan 15 soal acak dalam waktu 7 menit tanpa login dan lihat hasilnya langsung.
            </p>
            <div className="free-test-points">
              <span><Target size={17} /> 15 soal acak</span>
              <span><Target size={17} /> Waktu 7 menit</span>
              <span><CheckCircle2 size={17} /> Matematika &amp; logika</span>
              <span><CheckCircle2 size={17} /> Gratis tanpa login</span>
            </div>
            <button type="button" className="btn-primary free-test-start" onClick={startTest}>Mulai Tes Gratis</button>
            <p className="text-muted" style={{ fontSize: 12, marginTop: 14 }}>
              Soal ini berbeda dari modul psikotes member.
            </p>
          </section>
        )}

        {started && !finished && questions.length > 0 && (
          <section className="panel free-test-card">
            <div className="free-test-progress">
              <span>{questions[current].category}</span>
              <strong><span>Soal {current + 1} dari {questions.length}</span> · <span className="free-test-timer" aria-live="polite">Waktu {formatTime(timeLeft)}</span></strong>
            </div>
            <div className="free-test-progress-bar"><span style={{ width: `${((current + 1) / questions.length) * 100}%` }} /></div>
            <h1 className="free-test-question">{questions[current].question}</h1>
            <div className="free-test-options">
              {questions[current].options.map((option, index) => (
                <button
                  type="button"
                  key={option}
                  className={`free-test-option ${answers[current] === index ? 'selected' : ''}`}
                  onClick={() => chooseAnswer(index)}
                >
                  <span>{String.fromCharCode(65 + index)}</span>{option}
                </button>
              ))}
            </div>
            <button type="button" className="btn-primary" disabled={answers[current] === undefined} onClick={nextQuestion}>
              {current === questions.length - 1 ? 'Lihat Hasil' : 'Soal Berikutnya'} →
            </button>
          </section>
        )}

        {finished && (
          <section className="panel free-test-result">
            <CheckCircle2 size={48} color="var(--hl-teal)" />
            <span className="badge-tag news">Hasil Tes Gratis</span>
            <h1 className="h-display">Skor kamu: {score}/{questions.length}</h1>
            <p className="free-test-score">{Math.round((score / questions.length) * 100)}%</p>
            {timedOut && <p className="free-test-timeout">Waktu 7 menit habis. Jawaban yang sudah tersimpan dinilai.</p>}
            <p className="text-muted">
              {score >= 12 ? 'Hasil sangat baik. Pertahankan ketelitianmu.' : score >= 9 ? 'Hasil cukup baik. Terus latih kecepatan dan ketelitian.' : 'Jadikan hasil ini sebagai acuan untuk berlatih lagi.'}
            </p>
            <div className="free-test-result-actions">
              <button type="button" className="btn-primary" onClick={retakeTest}>
                {memberLoggedIn ? 'Coba Soal Acak Lain' : 'Login Member untuk Tes Ulang'}
              </button>
              <Link href="/paket" className="btn-secondary">Lihat Paket Tes</Link>
              <button type="button" className="btn-secondary" onClick={reset}><RotateCcw size={15} /> Kembali</button>
            </div>
          </section>
        )}

        <div style={{ marginTop: 28, textAlign: 'center' }}>
          <Link href="/" className="btn-secondary">← Kembali ke Beranda</Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

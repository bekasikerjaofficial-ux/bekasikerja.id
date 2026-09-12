'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import SiteHeader from '../../../components/SiteHeader';
import SiteFooter from '../../../components/SiteFooter';
import { User, FileText, Trophy, CreditCard, Settings, LogOut, ChevronRight, Calendar, Target } from 'lucide-react';

export default function MemberDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [cvs, setCvs] = useState([]);
  const [results, setResults] = useState([]);
  const [membership, setMembership] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ full_name: '', phone: '', address: '', birth_date: '', bio: '' });
  const [savingProfile, setSavingProfile] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    let active = true;
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) { router.replace('/member/login?next=/member/dashboard'); return; }
      if (active) setUser(data.user);
      await loadDashboardData(data.user.id);
      if (active) setLoading(false);
    };
    init();
    return () => { active = false; };
  }, []);

  const loadDashboardData = async (userId) => {
    // Profile
    const { data: prof } = await supabase.from('member_profiles').select('*').eq('user_id', userId).single();
    if (prof) {
      setProfile(prof);
      setProfileForm({ full_name: prof.full_name || '', phone: prof.phone || '', address: prof.address || '', birth_date: prof.birth_date || '', bio: prof.bio || '' });
    }

    // CVs
    const { data: cvData } = await supabase.from('member_cvs').select('*').eq('user_id', userId).order('updated_at', { ascending: false });
    if (cvData) setCvs(cvData);

    // Psikotes Results
    const { data: resData } = await supabase.from('psikotes_results').select('*').eq('user_id', userId).order('completed_at', { ascending: false }).limit(5);
    if (resData) setResults(resData);

    // Membership
    const { data: mem } = await supabase
      .from('memberships')
      .select('*, packages(*)')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('started_at', { ascending: false })
      .limit(1)
      .single();
    if (mem) setMembership(mem);
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    setMsg('');
    try {
      const payload = { ...profileForm, user_id: user.id, updated_at: new Date().toISOString() };
      if (profile) {
        await supabase.from('member_profiles').update(payload).eq('user_id', user.id);
      } else {
        await supabase.from('member_profiles').insert(payload);
      }
      setMsg('Profil berhasil disimpan!');
      setEditingProfile(false);
      await loadDashboardData(user.id);
    } catch (e) {
      setMsg('Gagal: ' + e.message);
    }
    setSavingProfile(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/');
  };

  if (loading) {
    return (
      <div>
        <SiteHeader brand="BekasiKerja.id" active="/member/dashboard" showSearch={false} />
        <main className="container section" style={{ textAlign: 'center' }}>
          <p className="text-muted">Memuat dashboard...</p>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Ringkasan', icon: Target },
    { id: 'cvs', label: 'CV Saya', icon: FileText },
    { id: 'results', label: 'Hasil Tes', icon: Trophy },
    { id: 'profile', label: 'Profil', icon: Settings },
  ];

  return (
    <div>
      <SiteHeader brand="BekasiKerja.id" active="/member/dashboard" showSearch={false} />
      <main className="container section" style={{ maxWidth: 1000 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 className="h-display" style={{ fontSize: 24, margin: 0 }}>Dashboard Member</h1>
            <p className="text-muted" style={{ fontSize: 13, margin: 0 }}>Selamat datang, {profile?.full_name || user?.email}</p>
          </div>
          <button onClick={handleLogout} className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <LogOut size={16} /> Logout
          </button>
        </div>

        {/* Membership Badge */}
        {membership?.packages && (
          <div style={{ background: 'var(--hl-blue-grad)', color: '#fff', padding: '16px 20px', borderRadius: 12, marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 12, opacity: .8 }}>Paket Aktif</div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>Paket {membership.packages.name}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 12, opacity: .8 }}>Berlaku hingga</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{membership.expires_at ? new Date(membership.expires_at).toLocaleDateString('id-ID') : 'Selamanya'}</div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '2px solid var(--gray-200)', overflowX: 'auto' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 20px',
                border: 'none',
                background: 'none',
                borderBottom: activeTab === tab.id ? '2px solid var(--hl-blue)' : '2px solid transparent',
                marginBottom: -2,
                cursor: 'pointer',
                fontWeight: activeTab === tab.id ? 700 : 500,
                color: activeTab === tab.id ? 'var(--hl-blue)' : 'var(--gray-600)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 13,
                whiteSpace: 'nowrap',
              }}
            >
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              <div className="card" style={{ padding: 20, textAlign: 'center' }}>
                <FileText size={28} color="var(--hl-blue)" style={{ margin: '0 auto 8px' }} />
                <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--gray-900)' }}>{cvs.length}</div>
                <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>CV Dibuat</div>
              </div>
              <div className="card" style={{ padding: 20, textAlign: 'center' }}>
                <Trophy size={28} color="var(--hl-gold)" style={{ margin: '0 auto 8px' }} />
                <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--gray-900)' }}>{results.length}</div>
                <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>Tes Dikerjakan</div>
              </div>
              <div className="card" style={{ padding: 20, textAlign: 'center' }}>
                <Target size={28} color="var(--hl-teal)" style={{ margin: '0 auto 8px' }} />
                <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--gray-900)' }}>
                  {results.length > 0 ? Math.round(results.reduce((a, r) => a + r.score, 0) / results.length) : 0}
                </div>
                <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>Rata-rata Nilai</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="panel" style={{ padding: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Aksi Cepat</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                <button onClick={() => router.push('/cv-builder')} className="card" style={{ padding: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left' }}>
                  <FileText size={24} color="var(--hl-blue)" />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>Buat CV</div>
                    <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>CV Builder</div>
                  </div>
                  <ChevronRight size={16} color="var(--gray-400)" style={{ marginLeft: 'auto' }} />
                </button>
                <button onClick={() => router.push('/psikotes')} className="card" style={{ padding: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left' }}>
                  <Trophy size={24} color="var(--hl-gold)" />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>Tes Psikotes</div>
                    <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>Latihan soal</div>
                  </div>
                  <ChevronRight size={16} color="var(--gray-400)" style={{ marginLeft: 'auto' }} />
                </button>
                <button onClick={() => router.push('/paket')} className="card" style={{ padding: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left' }}>
                  <CreditCard size={24} color="var(--hl-teal)" />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>Upgrade Paket</div>
                    <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>Buka semua fitur</div>
                  </div>
                  <ChevronRight size={16} color="var(--gray-400)" style={{ marginLeft: 'auto' }} />
                </button>
              </div>
            </div>

            {/* Recent Results */}
            {results.length > 0 && (
              <div className="panel" style={{ padding: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Hasil Tes Terbaru</h3>
                {results.slice(0, 3).map((r) => (
                  <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--gray-100)' }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{r.module_slug.replace('_', ' ').toUpperCase()}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: r.score >= 70 ? 'var(--hl-teal)' : 'var(--hl-red)' }}>{r.score} ({r.correct_answers}/{r.total_questions})</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* CVs Tab */}
        {activeTab === 'cvs' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>CV Tersimpan ({cvs.length})</h3>
              <button onClick={() => router.push('/cv-builder')} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <FileText size={16} /> Buat CV Baru
              </button>
            </div>
            {cvs.length === 0 ? (
              <div className="panel" style={{ padding: 40, textAlign: 'center' }}>
                <FileText size={40} color="var(--gray-300)" style={{ margin: '0 auto 12px' }} />
                <p className="text-muted" style={{ fontSize: 14 }}>Belum ada CV. Mulai buat CV pertama Anda!</p>
                <button onClick={() => router.push('/cv-builder')} className="btn-primary" style={{ marginTop: 12 }}>Buat CV Sekarang</button>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: 12 }}>
                {cvs.map((cv) => (
                  <div key={cv.id} className="card" style={{ padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{cv.full_name || 'Tanpa Nama'}</div>
                      <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>Template: {cv.template_slug} &middot; Diperbarui: {new Date(cv.updated_at).toLocaleDateString('id-ID')}</div>
                    </div>
                    <button onClick={() => router.push('/cv-builder')} className="btn-secondary" style={{ fontSize: 12 }}>Edit</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Results Tab */}
        {activeTab === 'results' && (
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Riwayat Hasil Tes ({results.length})</h3>
            {results.length === 0 ? (
              <div className="panel" style={{ padding: 40, textAlign: 'center' }}>
                <Trophy size={40} color="var(--gray-300)" style={{ margin: '0 auto 12px' }} />
                <p className="text-muted" style={{ fontSize: 14 }}>Belum ada hasil tes. Mulai kerjakan soal psikotes!</p>
                <button onClick={() => router.push('/psikotes')} className="btn-primary" style={{ marginTop: 12 }}>Mulai Tes</button>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: 8 }}>
                {results.map((r) => (
                  <div key={r.id} className="card" style={{ padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{r.module_slug.replace(/_/g, ' ').toUpperCase()}</div>
                      <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>
                        <Calendar size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                        {new Date(r.completed_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        &middot; {r.time_spent_seconds ? `${Math.floor(r.time_spent_seconds / 60)}m ${r.time_spent_seconds % 60}s` : '-'}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 24, fontWeight: 800, color: r.score >= 70 ? 'var(--hl-teal)' : 'var(--hl-red)' }}>{r.score}</div>
                      <div style={{ fontSize: 11, color: 'var(--gray-500)' }}>{r.correct_answers}/{r.total_questions} benar</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="panel" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Profil Member</h3>
              {!editingProfile && (
                <button onClick={() => setEditingProfile(true)} className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <Settings size={14} /> Edit Profil
                </button>
              )}
            </div>

            {msg && (
              <div style={{ background: msg.includes('berhasil') ? '#e8f7ee' : '#fff0f0', border: `1px solid ${msg.includes('berhasil') ? '#b7e3c8' : '#ffd0d0'}`, color: msg.includes('berhasil') ? '#1a7f43' : 'var(--hl-red)', fontSize: 13, padding: 12, borderRadius: 8, marginBottom: 16, fontWeight: 700 }}>
                {msg}
              </div>
            )}

            {editingProfile ? (
              <div style={{ display: 'grid', gap: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="field" style={{ margin: 0 }}>
                    <label>Nama Lengkap</label>
                    <input type="text" value={profileForm.full_name} onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })} />
                  </div>
                  <div className="field" style={{ margin: 0 }}>
                    <label>Telepon</label>
                    <input type="tel" value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} />
                  </div>
                </div>
                <div className="field" style={{ margin: 0 }}>
                  <label>Alamat</label>
                  <input type="text" value={profileForm.address} onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })} />
                </div>
                <div className="field" style={{ margin: 0 }}>
                  <label>Tanggal Lahir</label>
                  <input type="date" value={profileForm.birth_date} onChange={(e) => setProfileForm({ ...profileForm, birth_date: e.target.value })} />
                </div>
                <div className="field" style={{ margin: 0 }}>
                  <label>Bio</label>
                  <textarea rows="3" value={profileForm.bio} onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })} placeholder="Ceritakan tentang diri Anda..." />
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={handleSaveProfile} disabled={savingProfile} className="btn-primary">
                    {savingProfile ? 'Menyimpan...' : 'Simpan Profil'}
                  </button>
                  <button onClick={() => setEditingProfile(false)} className="btn-secondary">Batal</button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: 12 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', padding: '10px 0', borderBottom: '1px solid var(--gray-100)' }}>
                  <span style={{ fontSize: 13, color: 'var(--gray-500)' }}>Email</span>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{user?.email}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', padding: '10px 0', borderBottom: '1px solid var(--gray-100)' }}>
                  <span style={{ fontSize: 13, color: 'var(--gray-500)' }}>Nama Lengkap</span>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{profile?.full_name || '-'}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', padding: '10px 0', borderBottom: '1px solid var(--gray-100)' }}>
                  <span style={{ fontSize: 13, color: 'var(--gray-500)' }}>Telepon</span>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{profile?.phone || '-'}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', padding: '10px 0', borderBottom: '1px solid var(--gray-100)' }}>
                  <span style={{ fontSize: 13, color: 'var(--gray-500)' }}>Alamat</span>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{profile?.address || '-'}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', padding: '10px 0', borderBottom: '1px solid var(--gray-100)' }}>
                  <span style={{ fontSize: 13, color: 'var(--gray-500)' }}>Bergabung</span>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{user?.created_at ? new Date(user.created_at).toLocaleDateString('id-ID') : '-'}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

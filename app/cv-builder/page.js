'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import SiteHeader from '../../components/SiteHeader';
import SiteFooter from '../../components/SiteFooter';
import { Save, Download, Plus, Trash2, Eye, ArrowLeft, FileText, User, Briefcase, GraduationCap, Award, Globe } from 'lucide-react';

const EMPTY_CV = {
  template_slug: 'minimal',
  full_name: '',
  email: '',
  phone: '',
  address: '',
  summary: '',
  experience: [{ company: '', position: '', start_date: '', end_date: '', description: '' }],
  education: [{ school: '', degree: '', start_year: '', end_year: '' }],
  skills: [''],
  certifications: [{ name: '', issuer: '', year: '' }],
  languages: [{ name: '', level: '' }],
};

export default function CvBuilderPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [cvList, setCvList] = useState([]);
  const [activeCv, setActiveCv] = useState(null);
  const [form, setForm] = useState(EMPTY_CV);
  const [templates, setTemplates] = useState([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(true);
  const printRef = useRef();

  useEffect(() => {
    let active = true;
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) { router.replace('/member/login?next=/cv-builder'); return; }
      if (active) setUser(data.user);
      await loadData(data.user.id);
      if (active) setLoading(false);
    };
    init();
    return () => { active = false; };
  }, []);

  const loadData = async (userId) => {
    const { data: tpls } = await supabase.from('cv_templates').select('*').eq('is_active', true).order('sort_order');
    if (tpls) setTemplates(tpls);

    const { data: cvs } = await supabase.from('member_cvs').select('*').eq('user_id', userId).order('updated_at', { ascending: false });
    if (cvs) setCvList(cvs);
  };

  const handleNew = () => {
    setActiveCv(null);
    setForm({ ...EMPTY_CV, email: user?.email || '' });
    setPreview(false);
    setMsg('');
  };

  const handleEdit = (cv) => {
    setActiveCv(cv);
    setForm({
      template_slug: cv.template_slug || 'minimal',
      full_name: cv.full_name || '',
      email: cv.email || '',
      phone: cv.phone || '',
      address: cv.address || '',
      summary: cv.summary || '',
      experience: cv.experience?.length ? cv.experience : EMPTY_CV.experience,
      education: cv.education?.length ? cv.education : EMPTY_CV.education,
      skills: cv.skills?.length ? cv.skills : [''],
      certifications: cv.certifications?.length ? cv.certifications : EMPTY_CV.certifications,
      languages: cv.languages?.length ? cv.languages : EMPTY_CV.languages,
    });
    setPreview(false);
    setMsg('');
  };

  const handleSave = async () => {
    if (!form.full_name.trim()) { setMsg('Nama wajib diisi'); return; }
    setSaving(true);
    setMsg('');
    const payload = { ...form, user_id: user.id, updated_at: new Date().toISOString() };
    try {
      if (activeCv) {
        const { error } = await supabase.from('member_cvs').update(payload).eq('id', activeCv.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('member_cvs').insert(payload);
        if (error) throw error;
      }
      setMsg('CV berhasil disimpan!');
      await loadData(user.id);
      setTimeout(() => setMsg(''), 3000);
    } catch (e) {
      setMsg('Gagal menyimpan: ' + e.message);
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus CV ini?')) return;
    await supabase.from('member_cvs').delete().eq('id', id);
    if (activeCv?.id === id) handleNew();
    await loadData(user.id);
  };

  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;
    const win = window.open('', '_blank');
    win.document.write(`
      <!DOCTYPE html><html><head><title>CV - ${form.full_name}</title>
      <style>
        body { font-family: 'Open Sans', Arial, sans-serif; padding: 40px; color: #212529; line-height: 1.6; }
        h1 { font-size: 28px; margin: 0 0 4px; color: #005cab; }
        h2 { font-size: 16px; text-transform: uppercase; letter-spacing: 1px; color: #005cab; border-bottom: 2px solid #005cab; padding-bottom: 4px; margin-top: 24px; }
        .contact { font-size: 13px; color: #6c757d; margin-bottom: 16px; }
        .summary { font-size: 14px; margin-bottom: 16px; }
        .item { margin-bottom: 12px; }
        .item-title { font-weight: 700; font-size: 14px; }
        .item-sub { font-size: 13px; color: #6c757d; }
        .item-desc { font-size: 13px; margin-top: 4px; }
        .skills-list { display: flex; flex-wrap: wrap; gap: 8px; }
        .skill-tag { background: #e8f0fe; color: #005cab; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; }
        @media print { body { padding: 20px; } }
      </style></head><body>${content.innerHTML}</body></html>
    `);
    win.document.close();
    win.print();
  };

  const updateField = (field, value) => setForm({ ...form, [field]: value });

  const updateArray = (field, idx, key, value) => {
    const arr = [...form[field]];
    arr[idx] = { ...arr[idx], [key]: value };
    setForm({ ...form, [field]: arr });
  };

  const addArrayItem = (field, template) => {
    setForm({ ...form, [field]: [...form[field], template] });
  };

  const removeArrayItem = (field, idx) => {
    const arr = form[field].filter((_, i) => i !== idx);
    setForm({ ...form, [field]: arr.length ? arr : [EMPTY_CV[field][0]] });
  };

  const addSkill = () => setForm({ ...form, skills: [...form.skills, ''] });
  const updateSkill = (idx, val) => {
    const s = [...form.skills];
    s[idx] = val;
    setForm({ ...form, skills: s });
  };
  const removeSkill = (idx) => {
    setForm({ ...form, skills: form.skills.filter((_, i) => i !== idx) });
  };

  if (loading) {
    return (
      <div>
        <SiteHeader brand="BekasiKerja.id" active="/cv-builder" showSearch={false} />
        <main className="container section" style={{ textAlign: 'center' }}>
          <p className="text-muted">Memuat...</p>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div>
      <SiteHeader brand="BekasiKerja.id" active="/cv-builder" showSearch={false} />
      <main className="container section" style={{ maxWidth: 1100 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 className="h-display" style={{ fontSize: 24 }}>CV Builder</h1>
            <p className="text-muted" style={{ fontSize: 13, margin: 0 }}>Buat CV profesional ATS-friendly dalam hitungan menit</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleNew} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Plus size={16} /> CV Baru
            </button>
            <button onClick={() => router.push('/member/dashboard')} className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <ArrowLeft size={16} /> Dashboard
            </button>
          </div>
        </div>

        {msg && (
          <div style={{ background: msg.includes('berhasil') ? '#e8f7ee' : '#fff0f0', border: `1px solid ${msg.includes('berhasil') ? '#b7e3c8' : '#ffd0d0'}`, color: msg.includes('berhasil') ? '#1a7f43' : 'var(--hl-red)', fontSize: 13, padding: 12, borderRadius: 8, marginBottom: 16, fontWeight: 700 }}>
            {msg}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24, alignItems: 'start' }}>
          {/* Sidebar: CV List */}
          <div className="panel" style={{ padding: 16, position: 'sticky', top: 80 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <FileText size={16} color="var(--hl-blue)" /> CV Tersimpan ({cvList.length})
            </h3>
            {cvList.length === 0 ? (
              <p className="text-muted" style={{ fontSize: 12 }}>Belum ada CV. Klik &quot;CV Baru&quot; untuk mulai.</p>
            ) : (
              <div style={{ display: 'grid', gap: 8 }}>
                {cvList.map((cv) => (
                  <div
                    key={cv.id}
                    onClick={() => handleEdit(cv)}
                    style={{ padding: 10, border: `1px solid ${activeCv?.id === cv.id ? 'var(--hl-blue)' : 'var(--gray-200)'}`, borderRadius: 8, cursor: 'pointer', background: activeCv?.id === cv.id ? 'rgba(0,92,171,.04)' : '#fff', transition: '.15s' }}
                  >
                    <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--gray-900)' }}>{cv.full_name || 'Tanpa Nama'}</div>
                    <div style={{ fontSize: 11, color: 'var(--gray-500)', marginTop: 2 }}>{cv.template_slug} &middot; {new Date(cv.updated_at).toLocaleDateString('id-ID')}</div>
                    <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
                      <button onClick={(e) => { e.stopPropagation(); handleEdit(cv); }} style={{ fontSize: 11, padding: '2px 8px', background: 'var(--hl-blue)', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Edit</button>
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(cv.id); }} style={{ fontSize: 11, padding: '2px 8px', background: 'var(--hl-red)', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Hapus</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Main Editor */}
          <div>
            {/* Template Selector */}
            <div className="panel" style={{ padding: 16, marginBottom: 16 }}>
              <label style={{ fontWeight: 600, fontSize: 13, display: 'block', marginBottom: 8 }}>Template</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {templates.map((t) => (
                  <button
                    key={t.slug}
                    onClick={() => updateField('template_slug', t.slug)}
                    style={{ padding: '8px 16px', border: `2px solid ${form.template_slug === t.slug ? 'var(--hl-blue)' : 'var(--gray-200)'}`, borderRadius: 8, background: form.template_slug === t.slug ? 'rgba(0,92,171,.06)' : '#fff', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview Toggle */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <button onClick={() => setPreview(false)} className={!preview ? 'btn-primary' : 'btn-secondary'} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <FileText size={16} /> Edit
              </button>
              <button onClick={() => setPreview(true)} className={preview ? 'btn-primary' : 'btn-secondary'} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Eye size={16} /> Preview
              </button>
              <button onClick={handleSave} disabled={saving} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginLeft: 'auto' }}>
                <Save size={16} /> {saving ? 'Menyimpan...' : 'Simpan'}
              </button>
              {preview && (
                <button onClick={handlePrint} className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <Download size={16} /> Download PDF
                </button>
              )}
            </div>

            {preview ? (
              <div className="panel" style={{ padding: 40, background: '#fff' }}>
                <div ref={printRef}>
                  {form.template_slug === 'minimal' && <MinimalTemplate form={form} />}
                  {form.template_slug === 'modern' && <ModernTemplate form={form} />}
                  {form.template_slug === 'professional' && <ProfessionalTemplate form={form} />}
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: 16 }}>
                {/* Personal Info */}
                <div className="panel" style={{ padding: 20 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <User size={18} color="var(--hl-blue)" /> Informasi Pribadi
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div className="field" style={{ margin: 0 }}>
                      <label>Nama Lengkap *</label>
                      <input type="text" value={form.full_name} onChange={(e) => updateField('full_name', e.target.value)} placeholder="Budi Santoso" />
                    </div>
                    <div className="field" style={{ margin: 0 }}>
                      <label>Email</label>
                      <input type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)} placeholder="budi@email.com" />
                    </div>
                    <div className="field" style={{ margin: 0 }}>
                      <label>Telepon</label>
                      <input type="tel" value={form.phone} onChange={(e) => updateField('phone', e.target.value)} placeholder="08123456789" />
                    </div>
                    <div className="field" style={{ margin: 0 }}>
                      <label>Alamat</label>
                      <input type="text" value={form.address} onChange={(e) => updateField('address', e.target.value)} placeholder="Bekasi, Jawa Barat" />
                    </div>
                  </div>
                  <div className="field" style={{ margin: 0, marginTop: 12 }}>
                    <label>Ringkasan Profesional</label>
                    <textarea rows="3" value={form.summary} onChange={(e) => updateField('summary', e.target.value)} placeholder="Tuliskan ringkasan pengalaman dan keahlian Anda..." />
                  </div>
                </div>

                {/* Experience */}
                <div className="panel" style={{ padding: 20 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Briefcase size={18} color="var(--hl-blue)" /> Pengalaman Kerja
                  </h3>
                  {form.experience.map((exp, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid var(--gray-100)' }}>
                      <div className="field" style={{ margin: 0 }}>
                        <label>Perusahaan</label>
                        <input type="text" value={exp.company} onChange={(e) => updateArray('experience', i, 'company', e.target.value)} placeholder="PT. Contoh" />
                      </div>
                      <div className="field" style={{ margin: 0 }}>
                        <label>Posisi</label>
                        <input type="text" value={exp.position} onChange={(e) => updateArray('experience', i, 'position', e.target.value)} placeholder="Staff Admin" />
                      </div>
                      <div className="field" style={{ margin: 0 }}>
                        <label>Tanggal Mulai</label>
                        <input type="text" value={exp.start_date} onChange={(e) => updateArray('experience', i, 'start_date', e.target.value)} placeholder="Jan 2022" />
                      </div>
                      <div className="field" style={{ margin: 0 }}>
                        <label>Tanggal Selesai</label>
                        <input type="text" value={exp.end_date} onChange={(e) => updateArray('experience', i, 'end_date', e.target.value)} placeholder="Sekarang" />
                      </div>
                      <div className="field" style={{ margin: 0, gridColumn: '1 / -1' }}>
                        <label>Deskripsi</label>
                        <textarea rows="2" value={exp.description} onChange={(e) => updateArray('experience', i, 'description', e.target.value)} placeholder="Jelaskan tanggung jawab dan pencapaian..." />
                      </div>
                      {form.experience.length > 1 && (
                        <button type="button" onClick={() => removeArrayItem('experience', i)} style={{ gridColumn: '1 / -1', justifySelf: 'start', background: 'var(--hl-red)', color: '#fff', border: 'none', padding: '4px 12px', borderRadius: 4, cursor: 'pointer', fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          <Trash2 size={12} /> Hapus
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={() => addArrayItem('experience', EMPTY_CV.experience[0])} className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                    <Plus size={14} /> Tambah Pengalaman
                  </button>
                </div>

                {/* Education */}
                <div className="panel" style={{ padding: 20 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <GraduationCap size={18} color="var(--hl-blue)" /> Pendidikan
                  </h3>
                  {form.education.map((edu, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12, marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid var(--gray-100)' }}>
                      <div className="field" style={{ margin: 0, gridColumn: '1 / -1' }}>
                        <label>Nama Sekolah/Universitas</label>
                        <input type="text" value={edu.school} onChange={(e) => updateArray('education', i, 'school', e.target.value)} placeholder="Universitas Contoh" />
                      </div>
                      <div className="field" style={{ margin: 0 }}>
                        <label>Gelar/Jurusan</label>
                        <input type="text" value={edu.degree} onChange={(e) => updateArray('education', i, 'degree', e.target.value)} placeholder="S1 Teknik Industri" />
                      </div>
                      <div className="field" style={{ margin: 0 }}>
                        <label>Tahun Mulai</label>
                        <input type="text" value={edu.start_year} onChange={(e) => updateArray('education', i, 'start_year', e.target.value)} placeholder="2018" />
                      </div>
                      <div className="field" style={{ margin: 0 }}>
                        <label>Tahun Selesai</label>
                        <input type="text" value={edu.end_year} onChange={(e) => updateArray('education', i, 'end_year', e.target.value)} placeholder="2022" />
                      </div>
                      {form.education.length > 1 && (
                        <button type="button" onClick={() => removeArrayItem('education', i)} style={{ background: 'var(--hl-red)', color: '#fff', border: 'none', padding: '4px 12px', borderRadius: 4, cursor: 'pointer', fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          <Trash2 size={12} /> Hapus
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={() => addArrayItem('education', EMPTY_CV.education[0])} className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                    <Plus size={14} /> Tambah Pendidikan
                  </button>
                </div>

                {/* Skills */}
                <div className="panel" style={{ padding: 20 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Award size={18} color="var(--hl-blue)" /> Keahlian
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {form.skills.map((skill, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'var(--gray-100)', borderRadius: 9999, padding: '4px 8px 4px 12px' }}>
                        <input type="text" value={skill} onChange={(e) => updateSkill(i, e.target.value)} placeholder="Keahlian" style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 13, width: 100 }} />
                        {form.skills.length > 1 && (
                          <button type="button" onClick={() => removeSkill(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--hl-red)', padding: 2 }}>
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button type="button" onClick={addSkill} className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, marginTop: 8 }}>
                    <Plus size={14} /> Tambah Keahlian
                  </button>
                </div>

                {/* Certifications */}
                <div className="panel" style={{ padding: 20 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Award size={18} color="var(--hl-blue)" /> Sertifikasi
                  </h3>
                  {form.certifications.map((cert, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 8, marginBottom: 8, alignItems: 'end' }}>
                      <div className="field" style={{ margin: 0 }}>
                        <label>Nama Sertifikasi</label>
                        <input type="text" value={cert.name} onChange={(e) => updateArray('certifications', i, 'name', e.target.value)} placeholder="Certified Admin" />
                      </div>
                      <div className="field" style={{ margin: 0 }}>
                        <label>Penerbit</label>
                        <input type="text" value={cert.issuer} onChange={(e) => updateArray('certifications', i, 'issuer', e.target.value)} placeholder="BNSP" />
                      </div>
                      <div className="field" style={{ margin: 0 }}>
                        <label>Tahun</label>
                        <input type="text" value={cert.year} onChange={(e) => updateArray('certifications', i, 'year', e.target.value)} placeholder="2023" />
                      </div>
                      {form.certifications.length > 1 && (
                        <button type="button" onClick={() => removeArrayItem('certifications', i)} style={{ background: 'var(--hl-red)', color: '#fff', border: 'none', padding: '8px', borderRadius: 4, cursor: 'pointer', height: 38 }}>
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={() => addArrayItem('certifications', EMPTY_CV.certifications[0])} className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                    <Plus size={14} /> Tambah Sertifikasi
                  </button>
                </div>

                {/* Languages */}
                <div className="panel" style={{ padding: 20 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Globe size={18} color="var(--hl-blue)" /> Bahasa
                  </h3>
                  {form.languages.map((lang, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 8, marginBottom: 8, alignItems: 'end' }}>
                      <div className="field" style={{ margin: 0 }}>
                        <label>Bahasa</label>
                        <input type="text" value={lang.name} onChange={(e) => updateArray('languages', i, 'name', e.target.value)} placeholder="Inggris" />
                      </div>
                      <div className="field" style={{ margin: 0 }}>
                        <label>Tingkat</label>
                        <select value={lang.level} onChange={(e) => updateArray('languages', i, 'level', e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--gray-300)', borderRadius: 8, fontSize: 14 }}>
                          <option value="">Pilih</option>
                          <option value="Pemula">Pemula</option>
                          <option value="Menengah">Menengah</option>
                          <option value="Lancar">Lancar</option>
                        </select>
                      </div>
                      {form.languages.length > 1 && (
                        <button type="button" onClick={() => removeArrayItem('languages', i)} style={{ background: 'var(--hl-red)', color: '#fff', border: 'none', padding: '8px', borderRadius: 4, cursor: 'pointer', height: 38 }}>
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={() => addArrayItem('languages', EMPTY_CV.languages[0])} className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                    <Plus size={14} /> Tambah Bahasa
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

/* ============ CV TEMPLATES ============ */

function MinimalTemplate({ form }) {
  return (
    <div>
      <h1 style={{ fontSize: 28, margin: 0, color: '#005cab' }}>{form.full_name || 'Nama Anda'}</h1>
      <div style={{ fontSize: 13, color: '#6c757d', marginTop: 4 }}>
        {[form.email, form.phone, form.address].filter(Boolean).join(' | ')}
      </div>
      {form.summary && (
 <>
          <h2 style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: 1, color: '#005cab', borderBottom: '2px solid #005cab', paddingBottom: 4, marginTop: 24 }}>Ringkasan</h2>
          <p style={{ fontSize: 14, marginTop: 8 }}>{form.summary}</p>
        </>
      )}
      {form.experience.some(e => e.company || e.position) && (
        <>
          <h2 style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: 1, color: '#005cab', borderBottom: '2px solid #005cab', paddingBottom: 4, marginTop: 24 }}>Pengalaman</h2>
          {form.experience.filter(e => e.company || e.position).map((e, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{e.position} - {e.company}</div>
              <div style={{ fontSize: 12, color: '#6c757d' }}>{e.start_date} - {e.end_date}</div>
              {e.description && <div style={{ fontSize: 13, marginTop: 4 }}>{e.description}</div>}
            </div>
          ))}
        </>
      )}
      {form.education.some(e => e.school) && (
        <>
          <h2 style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: 1, color: '#005cab', borderBottom: '2px solid #005cab', paddingBottom: 4, marginTop: 24 }}>Pendidikan</h2>
          {form.education.filter(e => e.school).map((e, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{e.school}</div>
              <div style={{ fontSize: 12, color: '#6c757d' }}>{e.degree} {e.start_year && `(${e.start_year}-${e.end_year})`}</div>
            </div>
          ))}
        </>
      )}
      {form.skills.some(s => s) && (
        <>
          <h2 style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: 1, color: '#005cab', borderBottom: '2px solid #005cab', paddingBottom: 4, marginTop: 24 }}>Keahlian</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
            {form.skills.filter(Boolean).map((s, i) => (
              <span key={i} style={{ background: '#e8f0fe', color: '#005cab', padding: '4px 12px', borderRadius: 9999, fontSize: 12, fontWeight: 600 }}>{s}</span>
            ))}
          </div>
        </>
      )}
      {form.certifications.some(c => c.name) && (
        <>
          <h2 style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: 1, color: '#005cab', borderBottom: '2px solid #005cab', paddingBottom: 4, marginTop: 24 }}>Sertifikasi</h2>
          {form.certifications.filter(c => c.name).map((c, i) => (
            <div key={i} style={{ fontSize: 13, marginBottom: 4 }}>{c.name} - {c.issuer} {c.year && `(${c.year})`}</div>
          ))}
        </>
      )}
      {form.languages.some(l => l.name) && (
        <>
          <h2 style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: 1, color: '#005cab', borderBottom: '2px solid #005cab', paddingBottom: 4, marginTop: 24 }}>Bahasa</h2>
          {form.languages.filter(l => l.name).map((l, i) => (
            <div key={i} style={{ fontSize: 13, marginBottom: 4 }}>{l.name} - {l.level}</div>
          ))}
        </>
      )}
    </div>
  );
}

function ModernTemplate({ form }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 0 }}>
      <div style={{ background: '#005cab', color: '#fff', padding: '32px 20px' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,.2)', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 800 }}>
          {form.full_name ? form.full_name.charAt(0).toUpperCase() : '?'}
        </div>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, opacity: .8 }}>Kontak</div>
        <div style={{ fontSize: 11, marginBottom: 6, wordBreak: 'break-word' }}>{form.email}</div>
        <div style={{ fontSize: 11, marginBottom: 6 }}>{form.phone}</div>
        <div style={{ fontSize: 11, marginBottom: 6 }}>{form.address}</div>
        {form.skills.some(s => s) && (
          <>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, marginTop: 20, opacity: .8 }}>Keahlian</div>
            {form.skills.filter(Boolean).map((s, i) => (
              <div key={i} style={{ fontSize: 11, marginBottom: 4 }}>{s}</div>
            ))}
          </>
        )}
        {form.languages.some(l => l.name) && (
          <>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, marginTop: 20, opacity: .8 }}>Bahasa</div>
            {form.languages.filter(l => l.name).map((l, i) => (
              <div key={i} style={{ fontSize: 11, marginBottom: 4 }}>{l.name} ({l.level})</div>
            ))}
          </>
        )}
      </div>
      <div style={{ padding: '32px 28px' }}>
        <h1 style={{ fontSize: 26, margin: 0, color: '#005cab' }}>{form.full_name || 'Nama Anda'}</h1>
        {form.summary && <p style={{ fontSize: 13, color: '#6c757d', marginTop: 8, lineHeight: 1.7 }}>{form.summary}</p>}
        {form.experience.some(e => e.company || e.position) && (
          <>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: '#005cab', marginTop: 24, marginBottom: 8 }}>Pengalaman Kerja</h2>
            {form.experience.filter(e => e.company || e.position).map((e, i) => (
              <div key={i} style={{ marginBottom: 14, paddingLeft: 12, borderLeft: '3px solid #005cab' }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{e.position}</div>
                <div style={{ fontSize: 12, color: '#005cab' }}>{e.company}</div>
                <div style={{ fontSize: 11, color: '#6c757d' }}>{e.start_date} - {e.end_date}</div>
                {e.description && <div style={{ fontSize: 12, marginTop: 4 }}>{e.description}</div>}
              </div>
            ))}
          </>
        )}
        {form.education.some(e => e.school) && (
          <>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: '#005cab', marginTop: 24, marginBottom: 8 }}>Pendidikan</h2>
            {form.education.filter(e => e.school).map((e, i) => (
              <div key={i} style={{ marginBottom: 10, paddingLeft: 12, borderLeft: '3px solid #005cab' }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{e.school}</div>
                <div style={{ fontSize: 12, color: '#6c757d' }}>{e.degree} {e.start_year && `(${e.start_year}-${e.end_year})`}</div>
              </div>
            ))}
          </>
        )}
        {form.certifications.some(c => c.name) && (
          <>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: '#005cab', marginTop: 24, marginBottom: 8 }}>Sertifikasi</h2>
            {form.certifications.filter(c => c.name).map((c, i) => (
              <div key={i} style={{ fontSize: 12, marginBottom: 4 }}>{c.name} - {c.issuer} {c.year && `(${c.year})`}</div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

function ProfessionalTemplate({ form }) {
  return (
    <div style={{ fontFamily: "'Open Sans', Arial, sans-serif" }}>
      <div style={{ textAlign: 'center', borderBottom: '3px solid #212529', paddingBottom: 16, marginBottom: 20 }}>
        <h1 style={{ fontSize: 28, margin: 0, letterSpacing: 2, textTransform: 'uppercase' }}>{form.full_name || 'Nama Anda'}</h1>
        <div style={{ fontSize: 12, color: '#6c757d', marginTop: 6 }}>
          {[form.address, form.phone, form.email].filter(Boolean).join(' | ')}
        </div>
      </div>
      {form.summary && (
        <>
          <h2 style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: 2, borderBottom: '1px solid #212529', paddingBottom: 4, marginBottom: 12 }}>Profil Profesional</h2>
          <p style={{ fontSize: 13, lineHeight: 1.8, marginBottom: 20 }}>{form.summary}</p>
        </>
      )}
      {form.experience.some(e => e.company || e.position) && (
        <>
          <h2 style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: 2, borderBottom: '1px solid #212529', paddingBottom: 4, marginBottom: 12 }}>Pengalaman Kerja</h2>
          {form.experience.filter(e => e.company || e.position).map((e, i) => (
            <div key={i} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{e.position}</div>
                <div style={{ fontSize: 11, color: '#6c757d' }}>{e.start_date} - {e.end_date}</div>
              </div>
              <div style={{ fontSize: 13, fontStyle: 'italic', color: '#495057' }}>{e.company}</div>
              {e.description && <div style={{ fontSize: 12, marginTop: 4, lineHeight: 1.6 }}>{e.description}</div>}
            </div>
          ))}
        </>
      )}
      {form.education.some(e => e.school) && (
        <>
          <h2 style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: 2, borderBottom: '1px solid #212529', paddingBottom: 4, marginBottom: 12 }}>Pendidikan</h2>
          {form.education.filter(e => e.school).map((e, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{e.school}</div>
                <div style={{ fontSize: 11, color: '#6c757d' }}>{e.start_year}-{e.end_year}</div>
              </div>
              <div style={{ fontSize: 12 }}>{e.degree}</div>
            </div>
          ))}
        </>
      )}
      {form.skills.some(s => s) && (
        <>
          <h2 style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: 2, borderBottom: '1px solid #212529', paddingBottom: 4, marginBottom: 12 }}>Keahlian</h2>
          <p style={{ fontSize: 12, lineHeight: 1.8 }}>{form.skills.filter(Boolean).join(', ')}</p>
        </>
      )}
      {form.certifications.some(c => c.name) && (
        <>
          <h2 style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: 2, borderBottom: '1px solid #212529', paddingBottom: 4, marginBottom: 12 }}>Sertifikasi</h2>
          {form.certifications.filter(c => c.name).map((c, i) => (
            <div key={i} style={{ fontSize: 12, marginBottom: 4 }}>{c.name} - {c.issuer} {c.year && `(${c.year})`}</div>
          ))}
        </>
      )}
      {form.languages.some(l => l.name) && (
        <>
          <h2 style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: 2, borderBottom: '1px solid #212529', paddingBottom: 4, marginBottom: 12 }}>Bahasa</h2>
          <p style={{ fontSize: 12, lineHeight: 1.8 }}>{form.languages.filter(l => l.name).map(l => `${l.name} (${l.level})`).join(', ')}</p>
        </>
      )}
    </div>
  );
}

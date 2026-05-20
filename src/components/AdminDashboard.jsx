import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

const AdminDashboard = () => {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // CRUD State
  const [projects, setProjects] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [editingProject, setEditingProject] = useState(null); // null = mode tambah baru

  // Form State
  const [titleEn, setTitleEn] = useState('');
  const [titleJa, setTitleJa] = useState('');
  const [descEn, setDescEn] = useState('');
  const [descJa, setDescJa] = useState('');
  const [tagsStr, setTagsStr] = useState(''); // comma-separated e.g. "WEB3, REACT"
  const [color, setColor] = useState('var(--lime)');
  const [imgUrl, setImgUrl] = useState('');
  const [projectUrl, setProjectUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [orderIndex, setOrderIndex] = useState(0);
  const [submitError, setSubmitError] = useState('');

  // 1. Cek sesi login saat ini
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 2. Fetch projects jika user terautentikasi
  useEffect(() => {
    if (session) {
      fetchAdminProjects();
    }
  }, [session]);

  const fetchAdminProjects = async () => {
    setFetchLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('order_index', { ascending: true });
      if (error) throw error;
      setProjects(data || []);
    } catch (err) {
      console.error("Error fetching projects for admin:", err);
    } finally {
      setFetchLoading(false);
    }
  };

  // 3. Handler Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAuthError('');
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (err) {
      setAuthError(err.message || 'Login gagal. Cek kembali email & password Anda.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Handler Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // 5. Set Form saat Edit Proyek
  const startEdit = (project) => {
    setEditingProject(project);
    setTitleEn(project.title_en);
    setTitleJa(project.title_ja);
    setDescEn(project.desc_en);
    setDescJa(project.desc_ja);
    setTagsStr(Array.isArray(project.tags) ? project.tags.join(', ') : '');
    setColor(project.color);
    setImgUrl(project.img_url);
    setProjectUrl(project.project_url || '');
    setGithubUrl(project.github_url || '');
    setOrderIndex(project.order_index || 0);
    setSubmitError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 6. Reset Form
  const resetForm = () => {
    setEditingProject(null);
    setTitleEn('');
    setTitleJa('');
    setDescEn('');
    setDescJa('');
    setTagsStr('');
    setColor('var(--lime)');
    setImgUrl('');
    setProjectUrl('');
    setGithubUrl('');
    setOrderIndex(0);
    setSubmitError('');
  };

  // 7. Handler Submit (Tambah atau Perbarui Proyek)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    
    // Parse tags string to array
    const tagsArray = tagsStr
      .split(',')
      .map(tag => tag.trim().toUpperCase())
      .filter(tag => tag !== '');

    const projectPayload = {
      title_en: titleEn,
      title_ja: titleJa,
      desc_en: descEn,
      desc_ja: descJa,
      tags: tagsArray,
      color,
      img_url: imgUrl,
      project_url: projectUrl || null,
      github_url: githubUrl || null,
      order_index: parseInt(orderIndex, 10) || 0
    };

    try {
      if (editingProject) {
        // UPDATE
        const { error } = await supabase
          .from('projects')
          .update(projectPayload)
          .eq('id', editingProject.id);
        if (error) throw error;
      } else {
        // INSERT
        const { error } = await supabase
          .from('projects')
          .insert([projectPayload]);
        if (error) throw error;
      }

      resetForm();
      fetchAdminProjects();
    } catch (err) {
      setSubmitError(err.message || 'Terjadi kesalahan saat menyimpan data.');
    }
  };

  // 8. Handler Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus proyek ini secara permanen?")) return;
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
      if (error) throw error;
      fetchAdminProjects();
    } catch (err) {
      alert("Gagal menghapus: " + err.message);
    }
  };

  // ── VIEW: SCREEN LOGIN ──
  if (!session) {
    return (
      <div className="admin-login-wrapper" style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f3f3f3',
        padding: '2rem',
        fontFamily: 'monospace'
      }}>
        <div className="admin-login-card neo-border neo-shadow" style={{
          backgroundColor: 'white',
          padding: '3rem',
          maxWidth: '450px',
          width: '100%'
        }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '-1px' }}>
            PORTFOLIO_OS<br/>ADMIN_GATEWAY
          </h2>
          
          <p style={{ marginBottom: '2rem', color: '#555' }}>
            Silakan login menggunakan kredensial admin Supabase Anda untuk mengelola konten portofolio.
          </p>

          {authError && (
            <div className="neo-border" style={{
              backgroundColor: 'var(--pink)',
              padding: '1rem',
              marginBottom: '1.5rem',
              fontWeight: 'bold'
            }}>
              ERROR: {authError}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                ADMIN EMAIL
              </label>
              <input 
                type="email" 
                placeholder="admin@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="neo-input" 
                required 
                style={{ width: '100%', padding: '0.8rem', fontSize: '1rem', border: '3px solid var(--black)' }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                PASSWORD
              </label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="neo-input" 
                required 
                style={{ width: '100%', padding: '0.8rem', fontSize: '1rem', border: '3px solid var(--black)' }}
              />
            </div>

            <button 
              type="submit" 
              className="neo-btn cyan-btn neo-shadow" 
              disabled={loading}
              style={{
                width: '100%',
                padding: '1rem',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                cursor: 'pointer',
                backgroundColor: 'var(--cyan)'
              }}
            >
              {loading ? 'AUTHENTICATING...' : 'ENTER SYSTEM_'}
            </button>
          </form>

          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <a href="#" style={{ color: 'var(--black)', textDecoration: 'underline' }}>Kembali ke Portofolio</a>
          </div>
        </div>
      </div>
    );
  }

  // ── VIEW: SCREEN DASHBOARD CRUD ──
  return (
    <div className="admin-dashboard-container" style={{
      padding: '3rem 2rem',
      backgroundColor: '#f9f9f9',
      minHeight: '100vh',
      fontFamily: 'monospace'
    }}>
      <div className="admin-header" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '4px solid var(--black)',
        paddingBottom: '1.5rem',
        marginBottom: '3rem'
      }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', margin: 0, textTransform: 'uppercase', letterSpacing: '-1.5px' }}>
            WORK_MANAGER_V1.0
          </h1>
          <span style={{ fontSize: '1rem', color: '#666' }}>
            USER: {session.user.email} (ADMIN)
          </span>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <a href="#" className="neo-btn secondary" style={{
            padding: '0.8rem 1.5rem',
            fontSize: '1rem',
            textDecoration: 'none',
            color: 'var(--black)'
          }}>
            VIEW SITE
          </a>
          <button onClick={handleLogout} className="neo-btn" style={{
            padding: '0.8rem 1.5rem',
            backgroundColor: 'var(--pink)',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>
            LOGOUT_
          </button>
        </div>
      </div>

      <div className="admin-grid" style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: '3rem'
      }}>
        {/* KOLOM KIRI: FORM ENTRI DATA */}
        <div className="admin-form-card neo-border neo-shadow" style={{
          backgroundColor: 'white',
          padding: '2.5rem'
        }}>
          <h2 style={{ textTransform: 'uppercase', borderBottom: '3px solid var(--black)', paddingBottom: '0.5rem', marginBottom: '2rem' }}>
            {editingProject ? '🔧 EDIT_PROJECT' : '➕ ADD_NEW_PROJECT'}
          </h2>

          {submitError && (
            <div className="neo-border" style={{ backgroundColor: 'var(--pink)', padding: '1rem', marginBottom: '1.5rem', fontWeight: 'bold' }}>
              ERROR: {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* ENGLISH CONTENT */}
            <div style={{ padding: '1.5rem', backgroundColor: '#fafafa', border: '2px solid #ddd', marginBottom: '2rem' }}>
              <h3 style={{ marginTop: 0, marginBottom: '1rem', color: 'var(--cyan)' }}>ENGLISH DATA</h3>
              
              <div className="form-group" style={{ marginBottom: '1.2rem' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.3rem' }}>PROJECT TITLE (EN)</label>
                <input 
                  type="text" 
                  value={titleEn} 
                  onChange={(e) => setTitleEn(e.target.value)} 
                  required 
                  className="neo-input" 
                  style={{ width: '100%', padding: '0.6rem', border: '2px solid var(--black)' }}
                  placeholder="e.g. NEXUS PAY SYSTEM"
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.3rem' }}>DESCRIPTION (EN)</label>
                <textarea 
                  rows="3" 
                  value={descEn} 
                  onChange={(e) => setDescEn(e.target.value)} 
                  required 
                  className="neo-input" 
                  style={{ width: '100%', padding: '0.6rem', border: '2px solid var(--black)' }}
                  placeholder="Describe the project..."
                />
              </div>
            </div>

            {/* JAPANESE CONTENT */}
            <div style={{ padding: '1.5rem', backgroundColor: '#ffe1e140', border: '2px solid #eed0d0', marginBottom: '2rem' }}>
              <h3 style={{ marginTop: 0, marginBottom: '1rem', color: 'var(--pink)' }}>JAPANESE DATA (日本語)</h3>
              
              <div className="form-group" style={{ marginBottom: '1.2rem' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.3rem' }}>PROJECT TITLE (JA)</label>
                <input 
                  type="text" 
                  value={titleJa} 
                  onChange={(e) => setTitleJa(e.target.value)} 
                  required 
                  className="neo-input" 
                  style={{ width: '100%', padding: '0.6rem', border: '2px solid var(--black)' }}
                  placeholder="例: ネクサス・ペイ・システム"
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.3rem' }}>DESCRIPTION (JA)</label>
                <textarea 
                  rows="3" 
                  value={descJa} 
                  onChange={(e) => setDescJa(e.target.value)} 
                  required 
                  className="neo-input" 
                  style={{ width: '100%', padding: '0.6rem', border: '2px solid var(--black)' }}
                  placeholder="プロジェクトの説明..."
                />
              </div>
            </div>

            {/* OTHER META DATA */}
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.3rem' }}>TAGS (Koma sebagai pemisah)</label>
              <input 
                type="text" 
                value={tagsStr} 
                onChange={(e) => setTagsStr(e.target.value)} 
                className="neo-input" 
                style={{ width: '100%', padding: '0.6rem', border: '2px solid var(--black)' }}
                placeholder="e.g. FINTECH, 2026, REACT"
              />
              <small style={{ color: '#666' }}>Contoh: FINTECH, 2026, REACT</small>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div className="form-group">
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.3rem' }}>WARNA BACKGROUND</label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <select 
                    value={color} 
                    onChange={(e) => setColor(e.target.value)} 
                    className="neo-input" 
                    style={{ flexGrow: 1, padding: '0.6rem', border: '2px solid var(--black)', fontWeight: 'bold' }}
                  >
                    <option value="var(--lime)">Neon Lime</option>
                    <option value="var(--cyan)">Neon Cyan</option>
                    <option value="var(--pink)">Neon Pink</option>
                    <option value="var(--white)">Pure White</option>
                    <option value="#ffe1e1">Soft Peach</option>
                  </select>
                  <div style={{
                    width: '35px',
                    height: '35px',
                    backgroundColor: color.startsWith('var') ? `var(${color.substring(4, color.length - 1)})` : color,
                    border: '2px solid var(--black)'
                  }}></div>
                </div>
              </div>

              <div className="form-group">
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.3rem' }}>URUTAN (Order Index)</label>
                <input 
                  type="number" 
                  value={orderIndex} 
                  onChange={(e) => setOrderIndex(e.target.value)} 
                  className="neo-input" 
                  style={{ width: '100%', padding: '0.6rem', border: '2px solid var(--black)' }}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.3rem' }}>IMAGE URL</label>
              <input 
                type="text" 
                value={imgUrl} 
                onChange={(e) => setImgUrl(e.target.value)} 
                required 
                className="neo-input" 
                style={{ width: '100%', padding: '0.6rem', border: '2px solid var(--black)' }}
                placeholder="https://images.unsplash.com/... atau https://placehold.co/600x400"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
              <div className="form-group">
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.3rem' }}>DEMO LIVE LINK (URL)</label>
                <input 
                  type="text" 
                  value={projectUrl} 
                  onChange={(e) => setProjectUrl(e.target.value)} 
                  className="neo-input" 
                  style={{ width: '100%', padding: '0.6rem', border: '2px solid var(--black)' }}
                  placeholder="https://domain.com/demo"
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.3rem' }}>GITHUB REPO LINK (URL)</label>
                <input 
                  type="text" 
                  value={githubUrl} 
                  onChange={(e) => setGithubUrl(e.target.value)} 
                  className="neo-input" 
                  style={{ width: '100%', padding: '0.6rem', border: '2px solid var(--black)' }}
                  placeholder="https://github.com/user/repo"
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                type="submit" 
                className="neo-btn primary neo-shadow" 
                style={{
                  flexGrow: 2,
                  padding: '1rem',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  backgroundColor: 'var(--lime)'
                }}
              >
                {editingProject ? 'SAVE_CHANGES' : 'CREATE_PROJECT'}
              </button>
              
              {editingProject && (
                <button 
                  type="button" 
                  onClick={resetForm} 
                  className="neo-btn" 
                  style={{
                    flexGrow: 1,
                    padding: '1rem',
                    backgroundColor: '#ddd',
                    cursor: 'pointer'
                  }}
                >
                  CANCEL
                </button>
              )}
            </div>
          </form>
        </div>

        {/* KOLOM KANAN: LIST PROYEK SAAT INI */}
        <div className="admin-list-container">
          <h2 style={{ textTransform: 'uppercase', borderBottom: '3px solid var(--black)', paddingBottom: '0.5rem', marginBottom: '2rem' }}>
            📁 CURRENT_PROJECTS ({projects.length})
          </h2>

          {fetchLoading ? (
            <div style={{ fontSize: '1.2rem', textAlign: 'center', padding: '2rem' }}>
              LOADING_PROJECT_LIST...
            </div>
          ) : projects.length === 0 ? (
            <div style={{ fontSize: '1.1rem', backgroundColor: 'white', padding: '2rem', border: '3px dashed var(--black)', textAlign: 'center' }}>
              Belum ada data proyek di Supabase. Gunakan form di sebelah kiri untuk menambah proyek pertama Anda!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {projects.map((project) => (
                <div key={project.id} className="neo-border neo-shadow" style={{
                  backgroundColor: 'white',
                  padding: '1.5rem',
                  display: 'flex',
                  gap: '1.5rem'
                }}>
                  <img 
                    src={project.img_url} 
                    alt={project.title_en} 
                    style={{
                      width: '100px',
                      height: '100px',
                      objectFit: 'cover',
                      border: '3px solid var(--black)'
                    }} 
                  />
                  <div style={{ flexGrow: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h3 style={{ margin: 0, textTransform: 'uppercase', fontSize: '1.1rem' }}>
                        {project.title_en}
                      </h3>
                      <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem', backgroundColor: '#eee', border: '1px solid var(--black)' }}>
                        IDX: {project.order_index}
                      </span>
                    </div>

                    <p style={{ margin: '0.5rem 0', fontSize: '0.85rem', color: '#555', maxHeight: '50px', overflow: 'hidden' }}>
                      {project.desc_en}
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '1rem' }}>
                      {Array.isArray(project.tags) && project.tags.map((tag, i) => (
                        <span key={i} style={{
                          fontSize: '0.7rem',
                          backgroundColor: project.color.startsWith('var') ? `var(${project.color.substring(4, project.color.length - 1)})` : project.color,
                          padding: '0.1rem 0.4rem',
                          border: '1px solid var(--black)',
                          fontWeight: 'bold'
                        }}>
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div style={{ display: 'flex', gap: '0.8rem' }}>
                      <button 
                        onClick={() => startEdit(project)} 
                        className="neo-btn" 
                        style={{
                          padding: '0.4rem 1rem',
                          backgroundColor: 'var(--cyan)',
                          fontSize: '0.8rem',
                          fontWeight: 'bold',
                          cursor: 'pointer'
                        }}
                      >
                        EDIT_
                      </button>
                      <button 
                        onClick={() => handleDelete(project.id)} 
                        className="neo-btn" 
                        style={{
                          padding: '0.4rem 1rem',
                          backgroundColor: 'var(--pink)',
                          fontSize: '0.8rem',
                          fontWeight: 'bold',
                          cursor: 'pointer'
                        }}
                      >
                        DELETE_
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

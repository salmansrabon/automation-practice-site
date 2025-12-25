import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import PageLayout from '../components/PageLayout';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      router.push('/dashboard/profile');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="row justify-content-center">
      <div className="col-12 col-lg-5">
        <div className="text-center mb-4">
          <h1 className="fw-bold">Welcome Back</h1>
          <p className="text-muted mb-0">Login to access your dashboard and users table.</p>
        </div>
        <div className="card shadow-lg border-0 rounded-4">
          <div className="card-body p-4">
            <h2 className="card-title mb-3">Login</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={onSubmit} className="needs-validation" noValidate>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Enter password" />
              </div>
              <div className="d-grid gap-2">
                <button className="btn btn-primary" type="submit" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </button>
                <div className="text-center">
                  <span className="text-muted me-1">New here?</span>
                  <Link href="/signup">Signup</Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    </PageLayout>
  );
}

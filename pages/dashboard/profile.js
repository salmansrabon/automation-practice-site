import React, { useState } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '../../components/DashboardLayout';
const { getUserFromReq } = require('../../lib/auth');
const { findUserByEmail } = require('../../lib/data');

export default function ProfilePage({ user: initialUser }) {
  const router = useRouter();
  const [user, setUser] = useState(initialUser);
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState({
    firstName: initialUser?.firstName || '',
    lastName: initialUser?.lastName || '',
    phoneNumber: initialUser?.phoneNumber || '',
    gender: initialUser?.gender || 'Male',
  });
  const [photoPreview, setPhotoPreview] = useState(initialUser?.photo || null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validatePhone = (phone) => {
    if (!phone) return true; // optional field
    return /^01\d{9}$/.test(phone);
  };

  const handleEdit = () => {
    setIsEdit(true);
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setIsEdit(false);
    setForm({
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      gender: user.gender,
    });
    setPhotoPreview(user.photo || null);
    setError('');
    setSuccess('');
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setPhotoPreview(event.target.result);
      setForm((f) => ({ ...f, photo: event.target.result }));
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (form.phoneNumber && !validatePhone(form.phoneNumber)) {
      setError('Phone number must start with 01 and be 11 digits');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update profile');
      
      setUser((prev) => ({ ...prev, ...form }));
      setSuccess('Profile updated successfully!');
      setIsEdit(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <DashboardLayout>
      <div className="card shadow-lg border-0 rounded-4">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="card-title mb-0">Profile</h2>
            {!isEdit && (
              <button className="btn btn-primary btn-sm" onClick={handleEdit}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil me-1" viewBox="0 0 16 16">
                  <path d="M12.146.292a.5.5 0 0 1 .708 0l3.854 3.852a.5.5 0 0 1 0 .708l-10.851 10.851a.5.5 0 0 1-.242.135l-4.244.682a.5.5 0 0 1-.619-.619l.682-4.244a.5.5 0 0 1 .135-.242l10.851-10.851zm.162.97a.146.146 0 0 0-.207 0L2.712 12.146a.147.147 0 0 0-.035.077l-.713 4.424 4.424-.713a.146.146 0 0 0 .077-.035l10.851-10.851a.146.146 0 0 0 0-.207l-3.854-3.852Z"/>
                </svg>
                Edit
              </button>
            )}
          </div>

          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          {!user ? (
            <div className="alert alert-warning">No user data</div>
          ) : isEdit ? (
            <form>
              <div className="mb-4 text-center">
                <div className="mb-3">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Profile" className="rounded-circle" style={{ width: '120px', height: '120px', objectFit: 'cover' }} />
                  ) : (
                    <div className="rounded-circle d-inline-flex align-items-center justify-content-center bg-light" style={{ width: '120px', height: '120px' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="bi bi-person-fill text-muted" viewBox="0 0 16 16">
                        <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                      </svg>
                    </div>
                  )}
                </div>
                <label htmlFor="photoInput" className="btn btn-outline-primary btn-sm">
                  Upload Photo
                </label>
                <input
                  id="photoInput"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="d-none"
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">First Name</label>
                  <input
                    className="form-control"
                    value={form.firstName}
                    onChange={(e) => setField('firstName', e.target.value)}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Last Name</label>
                  <input
                    className="form-control"
                    value={form.lastName}
                    onChange={(e) => setField('lastName', e.target.value)}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" value={user.email} disabled />
                  <div className="form-text">Email cannot be changed</div>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Phone <span className="text-muted small">(optional)</span></label>
                  <input
                    className="form-control"
                    value={form.phoneNumber}
                    onChange={(e) => setField('phoneNumber', e.target.value)}
                    placeholder="01500000000"
                    title="Must start with 01 and be 11 digits"
                  />
                  {form.phoneNumber && !validatePhone(form.phoneNumber) && <small className="text-danger">Must start with 01 and be 11 digits</small>}
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Gender</label>
                <div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="gender"
                      id="genderMale"
                      checked={form.gender === 'Male'}
                      onChange={() => setField('gender', 'Male')}
                    />
                    <label className="form-check-label" htmlFor="genderMale">Male</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="gender"
                      id="genderFemale"
                      checked={form.gender === 'Female'}
                      onChange={() => setField('gender', 'Female')}
                    />
                    <label className="form-check-label" htmlFor="genderFemale">Female</label>
                  </div>
                </div>
              </div>

              <div className="d-grid gap-2 d-sm-flex justify-content-sm-end">
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleSave}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="text-center mb-4">
                {user.photo ? (
                  <img src={user.photo} alt="Profile" className="rounded-circle" style={{ width: '120px', height: '120px', objectFit: 'cover' }} />
                ) : (
                  <div className="rounded-circle d-inline-flex align-items-center justify-content-center bg-light" style={{ width: '120px', height: '120px' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="bi bi-person-fill text-muted" viewBox="0 0 16 16">
                      <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                    </svg>
                  </div>
                )}
              </div>
              <ul className="list-group list-group-flush">
              <li className="list-group-item d-flex justify-content-between"><span className="text-muted">First Name</span><span className="fw-semibold">{user.firstName}</span></li>
              <li className="list-group-item d-flex justify-content-between"><span className="text-muted">Last Name</span><span className="fw-semibold">{user.lastName}</span></li>
              <li className="list-group-item d-flex justify-content-between"><span className="text-muted">Email</span><span className="fw-semibold">{user.email}</span></li>
              <li className="list-group-item d-flex justify-content-between"><span className="text-muted">Phone</span><span className="fw-semibold">{user.phoneNumber}</span></li>
              <li className="list-group-item d-flex justify-content-between"><span className="text-muted">Gender</span><span className="fw-semibold">{user.gender}</span></li>
              <li className="list-group-item d-flex justify-content-between" suppressHydrationWarning><span className="text-muted">Joined</span><span className="fw-semibold">{new Date(user.createdAt).toLocaleString()}</span></li>
            </ul>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export async function getServerSideProps(context) {
  const me = getUserFromReq(context.req);
  if (!me) {
    return { redirect: { destination: '/', permanent: false } };
  }
  const user = await findUserByEmail(me.email);
  return { props: { user: user || null } };
}

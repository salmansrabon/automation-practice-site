import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
const { getUserFromReq } = require('../../../lib/auth');
const { findUserById } = require('../../../lib/data');

export default function UserDetailPage({ user, canEdit }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [userState, setUserState] = useState(user || null);
  const [form, setForm] = useState(() => ({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    gender: user?.gender || '',
    birthdate: user?.birthdate || '',
    district: user?.district || '',
    bloodGroup: user?.bloodGroup || '',
    photo: user?.photo || '',
  }));

  useEffect(() => {
    setUserState(user || null);
    setForm({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '',
      gender: user?.gender || '',
      birthdate: user?.birthdate || '',
      district: user?.district || '',
      bloodGroup: user?.bloodGroup || '',
      photo: user?.photo || '',
    });
    setEditing(false);
  }, [user]);

  const onFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((f) => ({ ...f, photo: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const validatePhone = (phone) => {
    if (!phone) return true; // optional field
    return /^01\d{9}$/.test(phone);
  };

  const save = async () => {
    if (form.phoneNumber && !validatePhone(form.phoneNumber)) {
      setError('Phone number must start with 01 and be 11 digits');
      return;
    }
    if (!userState) return;
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`/api/users/${userState.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Update failed');
      setUserState(data.user);
      setEditing(false);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="card shadow-lg border-0 rounded-4">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="card-title mb-0">User Details</h2>
            <div className="d-flex gap-2">
              <a className="btn btn-outline-secondary btn-sm" href="/dashboard/users">Back to Users</a>
              <button name="editButton" type="button" className="btn btn-primary btn-sm" onClick={() => setEditing(true)} disabled={editing}>Edit</button>
            </div>
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          {!user ? (
            <div className="alert alert-warning">User not found</div>
          ) : (
            <>
              <div className="text-center mb-4">
                {(editing ? form.photo : userState.photo) ? (
                  <img src={editing ? form.photo : userState.photo} alt="Profile" className="rounded-circle" style={{ width: '120px', height: '120px', objectFit: 'cover' }} />
                ) : (
                  <div className="rounded-circle d-inline-flex align-items-center justify-content-center bg-light" style={{ width: '120px', height: '120px' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="bi bi-person-fill text-muted" viewBox="0 0 16 16">
                      <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                    </svg>
                  </div>
                )}
              </div>
              {!editing ? (
                <ul className="list-group list-group-flush">
                  <li className="list-group-item d-flex justify-content-between"><span className="text-muted">First Name</span><span className="fw-semibold">{userState.firstName}</span></li>
                  <li className="list-group-item d-flex justify-content-between"><span className="text-muted">Last Name</span><span className="fw-semibold">{userState.lastName}</span></li>
                  <li className="list-group-item d-flex justify-content-between"><span className="text-muted">Email</span><span className="fw-semibold">{userState.email}</span></li>
                  <li className="list-group-item d-flex justify-content-between"><span className="text-muted">Phone</span><span className="fw-semibold">{userState.phoneNumber}</span></li>
                  <li className="list-group-item d-flex justify-content-between"><span className="text-muted">Gender</span><span className="fw-semibold">{userState.gender}</span></li>
                  <li className="list-group-item d-flex justify-content-between"><span className="text-muted">Birthdate</span><span className="fw-semibold">{userState.birthdate || '-'}</span></li>
                  <li className="list-group-item d-flex justify-content-between"><span className="text-muted">District</span><span className="fw-semibold">{userState.district || '-'}</span></li>
                  <li className="list-group-item d-flex justify-content-between"><span className="text-muted">Blood Group</span><span className="fw-semibold">{userState.bloodGroup || '-'}</span></li>
                  <li className="list-group-item d-flex justify-content-between"><span className="text-muted">Joined</span><span className="fw-semibold" suppressHydrationWarning>{new Date(userState.createdAt).toLocaleString()}</span></li>
                </ul>
              ) : (
                <form className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">First Name</label>
                    <input className="form-control" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Last Name</label>
                    <input className="form-control" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Phone <span className="text-muted small">(optional)</span></label>
                    <input className="form-control" value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} placeholder="01500000000" title="Must start with 01 and be 11 digits" />
                    {form.phoneNumber && !validatePhone(form.phoneNumber) && <small className="text-danger">Must start with 01 and be 11 digits</small>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Gender</label>
                    <select className="form-select" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Birthdate</label>
                    <input className="form-control" placeholder="MM/dd/yyyy" value={form.birthdate} onChange={(e) => setForm({ ...form, birthdate: e.target.value })} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">District</label>
                    <select className="form-select" value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })}>
                      <option value="">Select a district</option>
                      <option value="Dhaka">Dhaka</option>
                      <option value="Rajshahi">Rajshahi</option>
                      <option value="Chattogram">Chattogram</option>
                      <option value="Mymensing">Mymensing</option>
                      <option value="Barisal">Barisal</option>
                      <option value="Sylhet">Sylhet</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Blood Group</label>
                    <select className="form-select" value={form.bloodGroup} onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}>
                      <option value="">Select blood group</option>
                      <option value="O+">O+</option>
                      <option value="A+">A+</option>
                      <option value="B+">B+</option>
                      <option value="AB+">AB+</option>
                      <option value="O-">O-</option>
                      <option value="A-">A-</option>
                      <option value="B-">B-</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label">Profile Photo</label>
                    <input type="file" accept="image/*" className="form-control" onChange={onFileChange} />
                    {form.photo && (
                      <div className="mt-2">
                        <small className="text-muted d-block mb-1">Preview:</small>
                        <img src={form.photo} alt="Preview" className="rounded" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                      </div>
                    )}
                  </div>
                </form>
              )}
              {editing && (
                <div className="mt-3 d-flex gap-2 justify-content-end">
                  <button id="saveButton" className="btn btn-success" onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
                  <button className="btn btn-outline-secondary" onClick={() => { setEditing(false); setForm({
                    firstName: userState.firstName || '',
                    lastName: userState.lastName || '',
                    email: userState.email || '',
                    phoneNumber: userState.phoneNumber || '',
                    gender: userState.gender || '',
                    birthdate: userState.birthdate || '',
                    district: userState.district || '',
                    bloodGroup: userState.bloodGroup || '',
                    photo: userState.photo || '',
                  }); }}>Cancel</button>
                </div>
              )}
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
  const { id } = context.params;
  const user = await findUserById(id);
  const canEdit = user && String(me.id) === String(user.id);
  return { props: { user: user || null, canEdit } };
}

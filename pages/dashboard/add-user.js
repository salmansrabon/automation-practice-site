import React, { useState } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '../../components/DashboardLayout';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
const { getUserFromReq } = require('../../lib/auth');

export default function AddUserPage() {
  const router = useRouter();
  const bloodGroups = ['O+', 'A+', 'AB+', 'O-', 'A-', 'AB-'];
  const [bloodOptions, setBloodOptions] = useState([]);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    birthdate: '',
    gender: '',
    district: '',
    bloodGroup: '',
    agreement: false,
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validatePhone = (phone) => {
    if (!phone) return true; // optional field
    return /^01\d{9}$/.test(phone);
  };

  const loadBloodGroups = () => {
    if (bloodOptions.length === 0) {
      setBloodOptions(bloodGroups);
    }
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

  const onSubmit = async (e) => {
    e.preventDefault();
    if (form.phoneNumber && !validatePhone(form.phoneNumber)) {
      setError('Phone number must start with 01 and be 11 digits (e.g., 01500000000)');
      return;
    }
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create user');
      
      setSuccess('User created successfully! Redirecting to users list...');
      setTimeout(() => {
        router.push('/dashboard/users');
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          <div className="card shadow-lg border-0 rounded-4">
            <div className="card-body p-4">
              <h2 className="card-title mb-3">Create New User</h2>
              <p className="text-muted mb-4">Fill in the details below to add a new user.</p>
              
              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}
              
              <form onSubmit={onSubmit} className="needs-validation" noValidate>
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
                      required
                      placeholder="John"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Last Name</label>
                    <input
                      className="form-control"
                      value={form.lastName}
                      onChange={(e) => setField('lastName', e.target.value)}
                      required
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={form.email}
                      onChange={(e) => setField('email', e.target.value)}
                      required
                      placeholder="john@example.com"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Phone Number <span className="text-muted small\">(optional)</span></label>
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

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Blood Group</label>
                    <select
                      className="form-select"
                      value={form.bloodGroup}
                      onChange={(e) => setField('bloodGroup', e.target.value)}
                      onFocus={loadBloodGroups}
                      required
                    >
                      <option value="">Select blood group</option>
                      {bloodOptions.map((bg) => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6 mb-3"></div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={form.password}
                    onChange={(e) => setField('password', e.target.value)}
                    required
                    placeholder="Create a password"
                  />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Birth Date</label>
                    <DatePicker
                      selected={form.birthdate ? new Date(form.birthdate) : null}
                      onChange={(date) => setField('birthdate', date ? date.toISOString().split('T')[0] : '')}
                      dateFormat="MM/dd/yyyy"
                      className="form-control"
                      placeholderText="MM/dd/yyyy"
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">District</label>
                    <select
                      className="form-select"
                      value={form.district}
                      onChange={(e) => setField('district', e.target.value)}
                      required
                    >
                      <option value="">Select a district</option>
                      <option value="Dhaka">Dhaka</option>
                      <option value="Rajshahi">Rajshahi</option>
                      <option value="Chattogram">Chattogram</option>
                      <option value="Mymensing">Mymensing</option>
                      <option value="Barisal">Barisal</option>
                      <option value="Sylhet">Sylhet</option>
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label me-3">Gender</label>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="gender"
                      id="genderMale"
                      value="Male"
                      checked={form.gender === 'Male'}
                      onChange={(e) => setField('gender', e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="genderMale">Male</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="gender"
                      id="genderFemale"
                      value="Female"
                      checked={form.gender === 'Female'}
                      onChange={(e) => setField('gender', e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="genderFemale">Female</label>
                  </div>
                </div>

                <div className="form-check mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="agreement"
                    checked={form.agreement}
                    onChange={(e) => setField('agreement', e.target.checked)}
                    required
                  />
                  <label className="form-check-label" htmlFor="agreement">
                    I confirm this user registration
                  </label>
                </div>

                <div className="d-grid gap-2 d-sm-flex justify-content-sm-end">
                  <button className="btn btn-success" type="submit" disabled={loading}>
                    {loading ? 'Creating...' : 'Create User'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => router.push('/dashboard/users')}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
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
  return { props: {} };
}

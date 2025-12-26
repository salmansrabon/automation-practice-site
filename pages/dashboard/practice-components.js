import React, { useState, useEffect, forwardRef } from 'react';
import ReactDatePicker from 'react-datepicker';
import DashboardLayout from '../../components/DashboardLayout';
const { getUserFromReq } = require('../../lib/auth');

const pad = (n) => `${n}`.padStart(2, '0');
const formatDateTimeLocal = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;

const ReadOnlyInput = forwardRef(({ value, onClick, onFocus }, ref) => (
  <input
    className="form-control"
    value={value || ''}
    onClick={onClick}
    onFocus={onFocus}
    readOnly
    ref={ref}
  />
));
ReadOnlyInput.displayName = 'ReadOnlyInput';

export default function PracticeComponentsPage() {
  const [showModal, setShowModal] = useState(false);
  const [dateTime, setDateTime] = useState(() => formatDateTimeLocal(new Date()));
  const [dateOnly, setDateOnly] = useState(new Date());
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (e.key === 'Enter') {
        handleClickOrEnter();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, []);

  const openNewTab = () => {
    window.open('https://example.com', '_blank', 'noopener,noreferrer');
  };
  const openNewWindow = () => {
    window.open('https://example.com', '_blank', 'noopener,noreferrer,width=900,height=700');
  };

  const handleDoubleClick = () => {
    alert('double clicked!');
  };

  const handleRightClick = (e) => {
    e.preventDefault();
    alert('context clicked!');
  };

  const handleClickOrEnter = () => {
    alert('Enter event pressed!');
  };

  const openModal = () => {
    setModalMessage('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalMessage('Modal Closed!');
  };

  const handleSaveModal = () => {
    setShowModal(false);
    setModalMessage('Data saved!');
  };

  return (
    <DashboardLayout>
      <div className="card shadow-lg border-0 rounded-4">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="mb-0">Practice Components</h2>
            <span className="text-muted small">New tab, new window, iframe, and modal</span>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-4">
              <div className="border rounded-3 p-3 h-100 bg-light">
                <h5 className="mb-2">New Tab</h5>
                <p className="text-muted small mb-3">Opens example.com in a separate browser tab.</p>
                <button id="newTabBtn" className="btn btn-primary" onClick={openNewTab}>Open New Tab</button>
              </div>
            </div>

            <div className="col-md-4">
              <div className="border rounded-3 p-3 h-100 bg-light">
                <h5 className="mb-2">New Window</h5>
                <p className="text-muted small mb-3">Opens example.com in a new window with set dimensions.</p>
                <button id="newWindowBtn" className="btn btn-outline-primary" onClick={openNewWindow}>Open New Window</button>
              </div>
            </div>

            <div className="col-md-4">
              <div className="border rounded-3 p-3 h-100 bg-light">
                <h5 className="mb-2">Modal</h5>
                <p  className="text-muted small mb-3">Opens a Bootstrap-style modal with content.</p>
                <button id="openModalBtn" className="btn btn-success" onClick={openModal}>Open Modal</button>
                {modalMessage && <div className="mt-2 text-success fw-semibold">{modalMessage}</div>}
              </div>
            </div>
          </div>
          <div className="border rounded-3 p-3 bg-light mt-3">
            <h5 className="mb-2">Datepickers</h5>
            <p className="text-muted small mb-3">One with date & time, one date-only and readonly.</p>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Date & Time</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Date Only (readonly)</label> <br/>
                <ReactDatePicker
                  selected={dateOnly}
                  onChange={(val) => setDateOnly(val)}
                  dateFormat="P"
                  placeholderText="Select date"
                  customInput={<ReadOnlyInput />}
                />
              </div>
            </div>
          </div>

          <div className="border rounded-3 p-3 bg-light">
            <h5 className="mb-2">Iframe</h5>
            <p className="text-muted small mb-3">Embedded page below.</p>
            <div className="ratio ratio-16x9 border rounded-3 overflow-hidden bg-white">
              <iframe name="embeddedExample" title="Embedded Example" src="http://localhost:3000" style={{ border: '0' }} allowFullScreen></iframe>
            </div>
          </div>

          <div className="border rounded-3 p-3 bg-light mt-3">
            <h5 className="mb-2">Event Practice Buttons</h5>
            <p className="text-muted small mb-3">Practice different mouse and keyboard events.</p>
            <div className="d-flex flex-wrap gap-2">
              <button id="doubleClickBtn" className="btn btn-warning" onDoubleClick={handleDoubleClick}>Double Click Me</button>
              <button id="rightClickBtn" className="btn btn-info" onContextMenu={handleRightClick}>Right Click Me</button>
              <button id="clickOrEnterBtn" className="btn btn-danger" onClick={handleClickOrEnter}>Click or Press Enter</button>
            </div>
          </div>

          
        </div>
      </div>

      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Practice Modal</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body">
                <p>This is a simple modal for practice. Add any content you like here.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Close</button>
                <button type="button" className="btn btn-primary" onClick={handleSaveModal}>Save changes</button>
              </div>
            </div>
          </div>
        </div>
      )}
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

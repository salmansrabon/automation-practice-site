import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
const { getUserFromReq } = require('../../lib/auth');

export default function PracticeComponentsPage() {
  const [showModal, setShowModal] = useState(false);
  const openNewTab = () => {
    window.open('https://example.com', '_blank', 'noopener,noreferrer');
  };
  const openNewWindow = () => {
    window.open('https://example.com', '_blank', 'noopener,noreferrer,width=900,height=700');
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
                <button className="btn btn-primary" onClick={openNewTab}>Open New Tab</button>
              </div>
            </div>

            <div className="col-md-4">
              <div className="border rounded-3 p-3 h-100 bg-light">
                <h5 className="mb-2">New Window</h5>
                <p className="text-muted small mb-3">Opens example.com in a new window with set dimensions.</p>
                <button className="btn btn-outline-primary" onClick={openNewWindow}>Open New Window</button>
              </div>
            </div>

            <div className="col-md-4">
              <div className="border rounded-3 p-3 h-100 bg-light">
                <h5 className="mb-2">Modal</h5>
                <p className="text-muted small mb-3">Opens a Bootstrap-style modal with content.</p>
                <button className="btn btn-success" onClick={() => setShowModal(true)}>Open Modal</button>
              </div>
            </div>
          </div>

          <div className="border rounded-3 p-3 bg-light">
            <h5 className="mb-2">Iframe</h5>
            <p className="text-muted small mb-3">Embedded page below (example.com).</p>
            <div className="ratio ratio-16x9 border rounded-3 overflow-hidden bg-white">
              <iframe title="Embedded Example" src="http://localhost:3000" style={{ border: '0' }} allowFullScreen></iframe>
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
                <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>This is a simple modal for practice. Add any content you like here.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                <button type="button" className="btn btn-primary" onClick={() => setShowModal(false)}>Save changes</button>
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

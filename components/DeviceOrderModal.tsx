import React, { useState } from 'react';
import { CloseIcon } from './Icons';

interface DeviceOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (details: { name: string; address: string; email: string; phone: string }) => void;
}

const DeviceOrderModal: React.FC<DeviceOrderModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    // Simulate an API call for submission
    setTimeout(() => {
      onSubmit({ name, address, email, phone });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg p-8 bg-[#1a1a1a] border border-cyan-400/20 rounded-2xl shadow-xl transform transition-all"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <CloseIcon className="h-6 w-6" />
        </button>

        <div className="text-center">
          <h2 id="modal-title" className="text-2xl font-bold text-white mb-2">Order Your Aura Device</h2>
          <p className="text-gray-400 mb-8">Fill in your details below to receive your device and start earning.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 bg-gray-500/10 border border-gray-400/20 rounded-lg text-sm text-white placeholder-gray-500 focus:ring-1 focus:ring-cyan-400 focus:outline-none"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-1">Shipping Address</label>
            <textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              rows={3}
              className="w-full px-3 py-2 bg-gray-500/10 border border-gray-400/20 rounded-lg text-sm text-white placeholder-gray-500 focus:ring-1 focus:ring-cyan-400 focus:outline-none"
              placeholder="123 Main St, Anytown, USA 12345"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 bg-gray-500/10 border border-gray-400/20 rounded-lg text-sm text-white placeholder-gray-500 focus:ring-1 focus:ring-cyan-400 focus:outline-none"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">Phone Number (Optional)</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 bg-gray-500/10 border border-gray-400/20 rounded-lg text-sm text-white placeholder-gray-500 focus:ring-1 focus:ring-cyan-400 focus:outline-none"
              placeholder="+1 (555) 123-4567"
            />
          </div>
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-8 py-3 text-base font-bold text-gray-900 bg-cyan-400 rounded-full hover:bg-cyan-300 transition-all duration-300 transform hover:scale-105 disabled:opacity-75 disabled:cursor-not-allowed disabled:scale-100"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeviceOrderModal;

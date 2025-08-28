import React from 'react';

export default function ComingSoon() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-purple-50 px-4">
      <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-10 shadow-xl border border-purple-100">
        <div className="text-5xl mb-4">🚧</div>
        <h1 className="text-3xl font-extrabold text-purple-700 mb-2">Coming Soon</h1>
        <p className="text-gray-600 max-w-md mx-auto">
          This feature is under development. Stay tuned for updates!
        </p>
      </div>
    </div>
  );
}


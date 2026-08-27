import React from 'react';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();

  const handleCreate = () => {
    navigate('/create-company');
  };

  const features = [
    { title: 'Multi-Agent Intelligence', description: 'Leverage multiple specialized AI agents collaborating seamlessly.' },
    { title: 'Autonomous Decision Making', description: 'AI-driven strategic decisions based on data and market insights.' },
    { title: 'Business Simulation', description: 'Run realistic simulations of company performance over time.' },
  ];

  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-gray-900 text-white p-4">
      <div className="w-full max-w-5xl pt-12 text-center">
        <h1 className="text-5xl font-extrabold mb-4">AI Enterprise Simulator</h1>
        <div className="bg-gray-800 p-8 rounded-lg text-center text-indigo-300 mt-6">
          Tailwind CSS is working!
        </div>
        <p className="text-xl text-gray-300 mb-8">
          Build, simulate, and manage an autonomous AI‑powered company.
        </p>
        <button
          onClick={handleCreate}
          className="rounded bg-indigo-600 px-8 py-3 text-lg font-medium hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        >
          Create Company
        </button>
      </div>

      {/* Feature cards */}
      <div className="mt-16 w-full grid grid-cols-1 gap-6 md:grid-cols-3 px-4">
        {features.map((f, idx) => (
          <div
            key={idx}
            className="rounded-lg border border-gray-700 bg-gray-800 p-6 shadow-lg hover:shadow-xl transition"
          >
            <h2 className="text-2xl font-semibold mb-2 text-indigo-400">{f.title}</h2>
            <p className="text-gray-300">{f.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LandingPage;

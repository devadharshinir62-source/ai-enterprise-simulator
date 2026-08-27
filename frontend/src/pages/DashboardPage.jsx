import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { runAgents, runSimulation } from '../api/agents';

function DashboardPage() {
  const navigate = useNavigate();
  const stored = localStorage.getItem('ai_enterprise_company');
  const [company, setCompany] = useState(stored ? JSON.parse(stored) : null);
  const [agentsResult, setAgentsResult] = useState(null);
  const [decisionResult, setDecisionResult] = useState(null);
  const [loadingType, setLoadingType] = useState(null); // 'simulation' | 'agents' | null
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Safe numeric conversion helper
  const safeNumber = (val) => Number(val ?? 0);

  // Extract fields supporting both snake_case and camelCase safely
  const initialBudget = safeNumber(company?.initial_budget ?? company?.initialBudget);
  const currentCapital = safeNumber(company?.current_capital ?? company?.currentCapital);
  const revenue = safeNumber(company?.revenue);
  const expenses = safeNumber(company?.expenses);
  const customers = safeNumber(company?.customers);
  const currentMonth = safeNumber(company?.current_month ?? company?.currentMonth);
  const simulationDuration = Math.max(1, safeNumber(company?.simulation_duration_months ?? company?.simulationDuration ?? 12));
  const companyName = company?.company_name ?? company?.companyName ?? 'Enterprise Command';
  const businessIdea = company?.business_idea ?? company?.businessIdea ?? 'No business idea specified.';
  const targetMarket = company?.target_market ?? company?.targetMarket ?? 'Target market not defined.';
  const businessObjective = company?.business_objective ?? company?.businessObjective ?? 'Sustainable growth & market validation.';
  const rawStatus = (company?.status ?? 'initialized').toLowerCase();

  // Progress percentage calculation
  const progressPercent = Math.min(100, Math.max(0, Math.round((currentMonth / simulationDuration) * 100)));
  const isCompleted = rawStatus === 'completed' || currentMonth >= simulationDuration;
  const displayStatus = isCompleted ? 'Completed' : rawStatus === 'running' || currentMonth > 0 ? 'Running' : 'Initialized';

  if (!company) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white p-6 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-md w-full bg-slate-900/80 border border-slate-800 rounded-3xl p-8 text-center shadow-2xl backdrop-blur-xl relative z-10">
          <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600/20 to-purple-600/20 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-indigo-500/30 shadow-inner">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-100 mb-2">No Active Enterprise</h2>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            No simulated company configuration was found. Create a new virtual company to initiate the AI simulation engine.
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 px-5 py-3 font-semibold text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-200"
          >
            Create New Company
          </button>
        </div>
      </div>
    );
  }

  const handleRunSimulation = async () => {
    setLoadingType('simulation');
    setError('');
    setSuccessMessage('');
    try {
      const updated = await runSimulation(company.id);
      setCompany(updated);
      setSuccessMessage(`Advanced to Month ${safeNumber(updated?.current_month ?? currentMonth + 1)} successfully!`);
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (e) {
      setError(e.message || 'Simulation step failed');
    } finally {
      setLoadingType(null);
    }
  };

  const handleRunAgents = async () => {
    setLoadingType('agents');
    setError('');
    setSuccessMessage('');
    try {
      const result = await runAgents(company.id);
      setAgentsResult(result);
      if (result && result.decision) {
        setDecisionResult(result.decision);
      }
      setSuccessMessage('AI Leadership Team analysis completed successfully!');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (e) {
      setError(e.message || 'AI Leadership analysis failed');
    } finally {
      setLoadingType(null);
    }
  };

  const agentDefinitions = [
    {
      id: 'ceo',
      name: 'CEO Agent',
      role: 'Chief Executive Officer',
      desc: 'Formulates comprehensive executive strategy, prioritizes initiatives, and evaluates holistic corporate risk.',
      data: agentsResult?.ceo,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      accent: 'from-purple-500 to-indigo-500',
      badgeColor: 'text-purple-400 bg-purple-950/60 border-purple-700/50',
    },
    {
      id: 'market',
      name: 'Market Agent',
      role: 'VP of Market Intelligence',
      desc: 'Analyzes target personas, competitor positioning, industry trends, and market opportunity vectors.',
      data: agentsResult?.market,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      ),
      accent: 'from-blue-500 to-cyan-500',
      badgeColor: 'text-cyan-400 bg-cyan-950/60 border-cyan-700/50',
    },
    {
      id: 'finance',
      name: 'Finance Agent',
      role: 'Chief Financial Officer',
      desc: 'Models burn rates, runway sustainability, unit economics, and capital allocation frameworks.',
      data: agentsResult?.finance,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      accent: 'from-emerald-500 to-teal-500',
      badgeColor: 'text-emerald-400 bg-emerald-950/60 border-emerald-700/50',
    },
    {
      id: 'product',
      name: 'Product Agent',
      role: 'VP of Product Management',
      desc: 'Architects MVP feature scoping, roadmap prioritization, and development cycle timelines.',
      data: agentsResult?.product,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      accent: 'from-amber-500 to-orange-500',
      badgeColor: 'text-amber-400 bg-amber-950/60 border-amber-700/50',
    },
    {
      id: 'marketing',
      name: 'Marketing Agent',
      role: 'Chief Marketing Officer',
      desc: 'Designs multi-channel user acquisition, launch campaign funnels, and customer acquisition cost targets.',
      data: agentsResult?.marketing,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      ),
      accent: 'from-pink-500 to-rose-500',
      badgeColor: 'text-pink-400 bg-pink-950/60 border-pink-700/50',
    },
    {
      id: 'decision',
      name: 'Decision Engine',
      role: 'Autonomous Executive Synthesis',
      desc: 'Evaluates and scores all specialized agent proposals to synthesize the definitive strategic business mandate.',
      data: agentsResult?.decision,
      isSpecial: true,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      accent: 'from-indigo-400 via-purple-400 to-pink-400',
      badgeColor: 'text-indigo-300 bg-indigo-950/80 border-indigo-500/60',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 selection:bg-indigo-500 selection:text-white">
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">

        {/* 1. HERO HEADER */}
        <header className="bg-slate-900/80 border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-indigo-500/10 via-purple-500/5 to-transparent rounded-full blur-2xl pointer-events-none"></div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/25 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                  AI ENTERPRISE SIMULATOR
                </span>
                
                {/* Status Badge */}
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider border shadow-sm ${
                  displayStatus === 'Completed'
                    ? 'bg-purple-500/10 text-purple-300 border-purple-500/25'
                    : displayStatus === 'Running'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                    : 'bg-blue-500/10 text-blue-400 border-blue-500/25'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    displayStatus === 'Completed' ? 'bg-purple-400' : displayStatus === 'Running' ? 'bg-emerald-400' : 'bg-blue-400'
                  }`}></span>
                  Status: {displayStatus}
                </span>
              </div>

              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400 tracking-tight">
                  Company Command Center
                </h1>
                <p className="text-slate-400 text-sm sm:text-base max-w-3xl mt-1 leading-relaxed">
                  Autonomous leadership intelligence system that simulates, analyzes, and evolves <span className="text-indigo-300 font-semibold">{companyName}</span> across multiple operating cycles.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 self-start lg:self-center">
              <div className="bg-slate-800/90 border border-slate-700/70 rounded-2xl px-5 py-3 text-center shadow-lg">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Simulation Progress</span>
                <span className="text-xl font-extrabold text-indigo-300">
                  Month {currentMonth} <span className="text-slate-500 text-xs font-normal">/ {simulationDuration}</span>
                </span>
              </div>
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-800/90 border border-slate-700/80 px-4 py-3.5 text-sm font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-all duration-200 shadow-md"
              >
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                New Company
              </button>
            </div>
          </div>
        </header>

        {/* Global Success / Error Feedback */}
        {successMessage && (
          <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-600/80 text-emerald-200 flex items-center gap-3 text-sm shadow-lg animate-fade-in">
            <svg className="w-5 h-5 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-semibold">{successMessage}</span>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-700/80 text-rose-200 flex items-start gap-3 text-sm shadow-lg">
            <svg className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <span className="font-bold block">Execution Notification</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* 2. KPI CARDS (6 Responsive Cards) */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Enterprise Performance Indicators
            </h2>
            <span className="text-xs text-slate-400 font-medium">Standardized Currency: INR (₹)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            
            {/* KPI 1: Current Capital */}
            <div className="group bg-slate-900/75 border border-slate-800/80 hover:border-emerald-500/50 rounded-2xl p-4 shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-emerald-500/10 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Current Capital</span>
                  <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20 group-hover:scale-110 transition duration-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-black text-emerald-400 tracking-tight">
                  ₹ {Number(currentCapital || 0).toLocaleString('en-IN')}
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">Available operating treasury</p>
            </div>

            {/* KPI 2: Total Revenue */}
            <div className="group bg-slate-900/75 border border-slate-800/80 hover:border-cyan-500/50 rounded-2xl p-4 shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-cyan-500/10 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Revenue</span>
                  <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-500/20 group-hover:scale-110 transition duration-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-black text-cyan-400 tracking-tight">
                  ₹ {Number(revenue || 0).toLocaleString('en-IN')}
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">Cumulative gross earnings</p>
            </div>

            {/* KPI 3: Total Expenses */}
            <div className="group bg-slate-900/75 border border-slate-800/80 hover:border-rose-500/50 rounded-2xl p-4 shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-rose-500/10 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Expenses</span>
                  <div className="p-2 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20 group-hover:scale-110 transition duration-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 14l6-6m0 0l-6-6m6 6H3" />
                    </svg>
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-black text-rose-400 tracking-tight">
                  ₹ {Number(expenses || 0).toLocaleString('en-IN')}
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">Operational expenditures</p>
            </div>

            {/* KPI 4: Customers */}
            <div className="group bg-slate-900/75 border border-slate-800/80 hover:border-purple-500/50 rounded-2xl p-4 shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-purple-500/10 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Customers</span>
                  <div className="p-2 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20 group-hover:scale-110 transition duration-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-black text-purple-300 tracking-tight">
                  {Number(customers || 0).toLocaleString('en-IN')}
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">Active client accounts</p>
            </div>

            {/* KPI 5: Current Month */}
            <div className="group bg-slate-900/75 border border-slate-800/80 hover:border-indigo-500/50 rounded-2xl p-4 shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-indigo-500/10 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Current Month</span>
                  <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20 group-hover:scale-110 transition duration-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-black text-indigo-300 tracking-tight">
                  Month {Number(currentMonth || 0).toLocaleString('en-IN')}
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">Active simulation cycle</p>
            </div>

            {/* KPI 6: Simulation Duration */}
            <div className="group bg-slate-900/75 border border-slate-800/80 hover:border-amber-500/50 rounded-2xl p-4 shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-amber-500/10 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Duration</span>
                  <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20 group-hover:scale-110 transition duration-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-black text-amber-300 tracking-tight">
                  {Number(simulationDuration || 0).toLocaleString('en-IN')} Months
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">Configured time horizon</p>
            </div>

          </div>
        </section>

        {/* 3. FINANCIAL OVERVIEW */}
        <section className="bg-slate-900/75 border border-slate-800/80 rounded-3xl p-6 sm:p-7 shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                Financial Overview & Capital Health
              </h2>
              <p className="text-xs text-slate-400">Treasury progression and cumulative revenue/expense ratio</p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              Net Delta: ₹ {Number((currentCapital - initialBudget) || 0).toLocaleString('en-IN')}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Initial Budget</span>
              <p className="text-lg font-bold text-white mt-1">₹ {Number(initialBudget || 0).toLocaleString('en-IN')}</p>
              <p className="text-[11px] text-slate-500 mt-1">Seed equity allocation</p>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Current Capital</span>
              <p className="text-lg font-bold text-emerald-400 mt-1">₹ {Number(currentCapital || 0).toLocaleString('en-IN')}</p>
              <p className="text-[11px] text-slate-500 mt-1">
                {currentCapital >= initialBudget ? '↑ Net Capital Gain' : '↓ Net Capital Drawdown'}
              </p>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Total Revenue</span>
              <p className="text-lg font-bold text-cyan-400 mt-1">₹ {Number(revenue || 0).toLocaleString('en-IN')}</p>
              <p className="text-[11px] text-slate-500 mt-1">~5% initial capital / mo</p>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Total Expenses</span>
              <p className="text-lg font-bold text-rose-400 mt-1">₹ {Number(expenses || 0).toLocaleString('en-IN')}</p>
              <p className="text-[11px] text-slate-500 mt-1">~3% initial capital / mo</p>
            </div>
          </div>
        </section>

        {/* 8. BUSINESS OVERVIEW */}
        <section className="bg-slate-900/70 border border-slate-800/80 rounded-3xl p-6 sm:p-7 shadow-xl backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-800/80">
            <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20 shadow-inner">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">Business Overview</h2>
              <p className="text-xs text-slate-400">Foundational business thesis and operating parameters</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-4">
              <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider block mb-1">Business Idea</span>
              <p className="text-xs text-slate-300 leading-relaxed">{businessIdea}</p>
            </div>
            <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-4">
              <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block mb-1">Target Market</span>
              <p className="text-xs text-slate-300 leading-relaxed">{targetMarket}</p>
            </div>
            <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-4">
              <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider block mb-1">Business Objective</span>
              <p className="text-xs text-slate-300 leading-relaxed">{businessObjective}</p>
            </div>
          </div>
        </section>

        {/* 4. SIMULATION CONTROL */}
        <section className="bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-900 border border-indigo-500/25 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="w-full lg:w-1/2 space-y-2.5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Simulation Control
                </h2>
                <span className="text-xs font-bold text-indigo-300 bg-indigo-950/60 border border-indigo-500/30 px-3 py-1 rounded-full">
                  {progressPercent}% Horizon Elapsed
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-800/90 rounded-full h-3.5 p-0.5 border border-slate-700/60 overflow-hidden shadow-inner">
                <div
                  className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 h-full rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>

              <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                <span>Month {Number(currentMonth || 0).toLocaleString('en-IN')}</span>
                <span>Horizon: {Number(simulationDuration || 0).toLocaleString('en-IN')} Months</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 w-full lg:w-auto">
              <button
                onClick={handleRunSimulation}
                disabled={Boolean(loadingType)}
                className="flex-1 lg:flex-initial inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                {loadingType === 'simulation' ? (
                  <>
                    <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    Simulating Next Month...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Run Simulation (+1 Month)
                  </>
                )}
              </button>

              {/* 6. RUN AI TEAM BUTTON */}
              <button
                onClick={handleRunAgents}
                disabled={Boolean(loadingType)}
                className="flex-1 lg:flex-initial inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                {loadingType === 'agents' ? (
                  <>
                    <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    Running AI Leadership Team...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Run AI Leadership Team
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* 5. AI LEADERSHIP TEAM SECTION */}
        <section className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                AI Leadership Team
              </h2>
              <p className="text-xs text-slate-400">Six collaborative deterministic intelligence agents</p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              6 Agents Configured
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {agentDefinitions.map((agent) => {
              const isCompleted = agent.data?.status === 'completed';
              return (
                <div
                  key={agent.id}
                  className={`relative rounded-3xl p-5 sm:p-6 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between ${
                    agent.isSpecial
                      ? 'bg-gradient-to-b from-indigo-950/50 via-purple-950/30 to-slate-900 border-2 border-indigo-500/50 shadow-xl shadow-indigo-500/10'
                      : 'bg-slate-900/75 border border-slate-800/80 hover:border-slate-700 shadow-lg hover:-translate-y-0.5'
                  }`}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-2xl bg-gradient-to-br ${agent.accent} text-white shadow-md`}>
                          {agent.icon}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-100 text-base">{agent.name}</h3>
                          <p className="text-[11px] font-medium text-slate-400">{agent.role}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border shadow-sm ${agent.badgeColor}`}>
                        {isCompleted ? 'Completed' : loadingType === 'agents' ? 'Running' : 'Ready'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 mb-4 leading-relaxed">{agent.desc}</p>

                    {/* Agent Preview */}
                    {isCompleted && agent.data?.recommendation && (
                      <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800 text-xs">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block mb-1">
                          Latest Recommendation:
                        </span>
                        <p className="text-slate-200 line-clamp-2 leading-relaxed">{agent.data.recommendation}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 7. AGENT ANALYSIS SECTION */}
        {agentsResult && (
          <section className="space-y-6 pt-4">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-100 flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400"></span>
                  AI Leadership Analysis & Intelligence Report
                </h2>
                <p className="text-xs text-slate-400">Structured outputs, cross-functional recommendations, and final executive mandate</p>
              </div>
              <span className="text-xs text-indigo-400 font-semibold bg-indigo-950/60 border border-indigo-800/40 px-3 py-1 rounded-full">
                Month {Number(currentMonth || 0).toLocaleString('en-IN')}
              </span>
            </div>

            {/* Executive Decision (Prominent) */}
            {decisionResult && (
              <div className="relative overflow-hidden bg-gradient-to-br from-indigo-950/70 via-purple-950/50 to-slate-900 border-2 border-indigo-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-5 border-b border-indigo-500/20">
                  <div className="flex items-center gap-3.5">
                    <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-inner">
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200">
                        Executive Decision
                      </h3>
                      <p className="text-xs text-indigo-300/80">Decision Engine Final Intelligence Synthesis</p>
                    </div>
                  </div>

                  {decisionResult.confidence && (
                    <div className="flex items-center gap-2 bg-indigo-950/80 border border-indigo-500/40 px-3.5 py-1.5 rounded-full">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-300">
                        Confidence: {decisionResult.confidence}
                      </span>
                    </div>
                  )}
                </div>

                {decisionResult.decision && (
                  <div className="bg-slate-950/90 rounded-2xl p-5 border border-indigo-500/30 mb-6 shadow-inner">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-400 block mb-2">
                      Definitive Strategy Mandate:
                    </span>
                    <p className="text-base sm:text-lg font-bold text-slate-100 leading-relaxed">
                      {decisionResult.decision}
                    </p>
                  </div>
                )}

                {decisionResult.reasoning && Array.isArray(decisionResult.reasoning) && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Analytical Reasoning & Justification</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {decisionResult.reasoning.map((item, idx) => (
                        <div key={idx} className="bg-slate-900/80 rounded-2xl p-3.5 border border-slate-800/80 flex items-start gap-3 text-xs text-slate-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0 mt-1.5"></span>
                          <span className="leading-relaxed font-medium">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 5 Functional Intelligence Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* 1. Market Analysis */}
              {agentsResult?.market && (
                <div className="bg-slate-900/75 border border-slate-800/80 rounded-3xl p-6 space-y-4 shadow-xl">
                  <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-sm">
                    <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    Market Analysis
                  </div>

                  {agentsResult.market.market_assessment && (
                    <p className="text-xs text-slate-300 leading-relaxed">
                      <span className="text-slate-400 font-semibold block mb-0.5">Market Assessment:</span>
                      {agentsResult.market.market_assessment}
                    </p>
                  )}

                  {agentsResult.market.target_customers && Array.isArray(agentsResult.market.target_customers) && (
                    <div className="text-xs text-slate-300">
                      <span className="text-slate-400 font-semibold block mb-1.5">Target Segments:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {agentsResult.market.target_customers.map((c, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-lg bg-cyan-950/60 text-cyan-300 border border-cyan-800/40 text-[11px] font-medium">{c}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {agentsResult.market.opportunities && Array.isArray(agentsResult.market.opportunities) && (
                    <div className="text-xs text-slate-300">
                      <span className="text-slate-400 font-semibold block mb-1">Opportunities:</span>
                      <ul className="list-disc list-inside space-y-1 text-slate-300 pl-1 text-[11px]">
                        {agentsResult.market.opportunities.map((opp, i) => <li key={i}>{opp}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* 2. Finance Analysis */}
              {agentsResult?.finance && (
                <div className="bg-slate-900/75 border border-slate-800/80 rounded-3xl p-6 space-y-4 shadow-xl">
                  <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-sm">
                    <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    Finance Analysis
                  </div>

                  {agentsResult.finance.financial_health && (
                    <p className="text-xs text-slate-300 leading-relaxed">
                      <span className="text-slate-400 font-semibold block mb-0.5">Financial Health:</span>
                      {agentsResult.finance.financial_health}
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    {agentsResult.finance.runway_months !== undefined && (
                      <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
                        <span className="text-slate-400 text-[10px] uppercase font-bold block">Runway Horizon</span>
                        <span className="text-emerald-400 font-black text-base">{agentsResult.finance.runway_months} Months</span>
                      </div>
                    )}
                    {agentsResult.finance.estimated_monthly_expenses !== undefined && (
                      <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
                        <span className="text-slate-400 text-[10px] uppercase font-bold block">Est. Monthly Burn</span>
                        <span className="text-rose-400 font-black text-base">₹ {Number(agentsResult.finance.estimated_monthly_expenses || 0).toLocaleString('en-IN')}</span>
                      </div>
                    )}
                  </div>

                  {agentsResult.finance.financial_risks && Array.isArray(agentsResult.finance.financial_risks) && (
                    <div className="text-xs text-slate-300">
                      <span className="text-slate-400 font-semibold block mb-1">Financial Risk Factors:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {agentsResult.finance.financial_risks.map((r, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-lg bg-rose-950/60 text-rose-300 border border-rose-800/40 text-[11px] font-medium">{r}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 3. Product Analysis */}
              {agentsResult?.product && (
                <div className="bg-slate-900/75 border border-slate-800/80 rounded-3xl p-6 space-y-4 shadow-xl">
                  <div className="flex items-center gap-2.5 text-amber-400 font-bold text-sm">
                    <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    Product Analysis
                  </div>

                  {agentsResult.product.product_positioning && (
                    <p className="text-xs text-slate-300 leading-relaxed">
                      <span className="text-slate-400 font-semibold block mb-0.5">Product Positioning:</span>
                      {agentsResult.product.product_positioning}
                    </p>
                  )}

                  {agentsResult.product.mvp_features && Array.isArray(agentsResult.product.mvp_features) && (
                    <div className="text-xs text-slate-300">
                      <span className="text-slate-400 font-semibold block mb-1.5">Core MVP Features:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {agentsResult.product.mvp_features.map((f, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-lg bg-amber-950/60 text-amber-300 border border-amber-800/40 text-[11px] font-medium">{f}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {agentsResult.product.estimated_development_months && (
                    <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800 text-xs flex justify-between items-center">
                      <span className="text-slate-400 font-semibold">Estimated Development Time:</span>
                      <span className="text-amber-400 font-bold">{agentsResult.product.estimated_development_months} Months</span>
                    </div>
                  )}
                </div>
              )}

              {/* 4. Marketing Strategy */}
              {agentsResult?.marketing && (
                <div className="bg-slate-900/75 border border-slate-800/80 rounded-3xl p-6 space-y-4 shadow-xl">
                  <div className="flex items-center gap-2.5 text-pink-400 font-bold text-sm">
                    <div className="p-1.5 rounded-lg bg-pink-500/10 border border-pink-500/20">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                      </svg>
                    </div>
                    Marketing Strategy
                  </div>

                  {agentsResult.marketing.customer_acquisition_strategy && (
                    <p className="text-xs text-slate-300 leading-relaxed">
                      <span className="text-slate-400 font-semibold block mb-0.5">Acquisition Thesis:</span>
                      {agentsResult.marketing.customer_acquisition_strategy}
                    </p>
                  )}

                  {agentsResult.marketing.marketing_channels && Array.isArray(agentsResult.marketing.marketing_channels) && (
                    <div className="text-xs text-slate-300">
                      <span className="text-slate-400 font-semibold block mb-1.5">Acquisition Channels:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {agentsResult.marketing.marketing_channels.map((ch, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-lg bg-pink-950/60 text-pink-300 border border-pink-800/40 text-[11px] font-medium">{ch}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {agentsResult.marketing.estimated_marketing_allocation !== undefined && (
                    <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800 text-xs flex justify-between items-center">
                      <span className="text-slate-400 font-semibold">Recommended Budget Allocation:</span>
                      <span className="text-pink-400 font-bold">₹ {Number(agentsResult.marketing.estimated_marketing_allocation || 0).toLocaleString('en-IN')}</span>
                    </div>
                  )}
                </div>
              )}

              {/* 5. CEO Recommendation */}
              {agentsResult?.ceo && (
                <div className="bg-slate-900/75 border border-slate-800/80 rounded-3xl p-6 space-y-4 shadow-xl md:col-span-2">
                  <div className="flex items-center gap-2.5 text-purple-400 font-bold text-sm">
                    <div className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    CEO Recommendation & Strategic Alignment
                  </div>

                  {agentsResult.ceo.summary && (
                    <p className="text-xs text-slate-300 leading-relaxed">
                      <span className="text-slate-400 font-semibold block mb-0.5">Executive Summary:</span>
                      {agentsResult.ceo.summary}
                    </p>
                  )}

                  {agentsResult.ceo.strategic_priorities && Array.isArray(agentsResult.ceo.strategic_priorities) && (
                    <div className="text-xs text-slate-300">
                      <span className="text-slate-400 font-semibold block mb-1.5">Strategic Priorities:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {agentsResult.ceo.strategic_priorities.map((p, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-lg bg-purple-950/60 text-purple-300 border border-purple-800/40 text-[11px] font-medium">{p}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {agentsResult.ceo.risks && Array.isArray(agentsResult.ceo.risks) && (
                    <div className="text-xs text-slate-300">
                      <span className="text-slate-400 font-semibold block mb-1">Executive Risk Mitigation:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {agentsResult.ceo.risks.map((r, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-lg bg-rose-950/60 text-rose-300 border border-rose-800/40 text-[11px] font-medium">{r}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          </section>
        )}

      </div>
    </div>
  );
}

export default DashboardPage;

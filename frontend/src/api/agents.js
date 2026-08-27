const API_URL = "https://ai-enterprise-simulator.onrender.com";

export async function runAgents(companyId) {
  let id = companyId;
  if (!id) {
    const stored = localStorage.getItem('ai_enterprise_company');
    if (!stored) throw new Error('No company data found in storage');
    const company = JSON.parse(stored);
    id = company.id;
  }
  const response = await fetch(`${API_URL}/api/company/${id}/agents/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Failed to run agents: ${response.status} ${err}`);
  }
  return await response.json();
}

export async function runSimulation(companyId) {
  let id = companyId;
  if (!id) {
    const stored = localStorage.getItem('ai_enterprise_company');
    if (!stored) throw new Error('No company data found in storage');
    const company = JSON.parse(stored);
    id = company.id;
  }
  const response = await fetch(`${API_URL}/api/company/${id}/simulate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Failed to simulate month: ${response.status} ${err}`);
  }
  const updated = await response.json();
  localStorage.setItem('ai_enterprise_company', JSON.stringify(updated));
  return updated;
}

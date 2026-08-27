# backend/app/agents/market_agent.py
"""Market agent implementation.

The agent provides a deterministic placeholder analysis of the market based on
the company state supplied by the frontend. No external services are called –
all values are derived from simple deterministic heuristics so that the API can
be exercised without an API key.
"""

from __future__ import annotations

from typing import Dict, List

from backend.app.core.company_state import CompanyState
from backend.app.agents.base_agent import BaseAgent


class MarketAgent(BaseAgent):
    """Agent that performs a (placeholder) market research analysis.

    The analysis is deliberately deterministic: it extracts key fields from the
    provided ``CompanyState`` and builds simple strings/lists that mimic a real
    market study. This keeps the implementation lightweight and testable.
    """

    name: str = "Market Agent"
    role: str = "Market Research"
    description: str = "Analyzes the target market, customers, competitors, opportunities and risks."

    def __init__(self) -> None:
        super().__init__(name=self.name, role=self.role, description=self.description)

    def analyze(self, company_state: CompanyState) -> Dict[str, any]:
        """Return a deterministic market analysis.

        Parameters
        ----------
        company_state: CompanyState
            The current state of the simulated company.

        Returns
        -------
        dict
            Structured market analysis compatible with the API schema.
        """
        # ----- Deterministic placeholder logic ---------------------------------
        # Market assessment string – simple concatenation of key fields.
        market_assessment = (
            f"The business idea '{company_state.business_idea}' targets the market "
            f"'{company_state.target_market}'. With an initial budget of ₹{company_state.initial_budget:,.0f}, "
            "the opportunity appears modest but viable."
        )

        # Derive a list of target customer archetypes from the market description.
        target_customers: List[str] = [
            f"Primary: {company_state.target_market}",
            "Secondary: Urban tech‑savvy early adopters",
        ]

        # Simple deterministic competitor list based on the business idea.
        competitors = [
            f"Competitor A offering similar {company_state.business_idea.split()[0]} solutions",
            "Competitor B with a broader platform",
        ]

        # Opportunities derived from budget and objective.
        opportunities = [
            "Early‑stage market entry with low‑cost MVP",
            "Leverage digital channels for rapid outreach",
        ]

        # Risks – static list with a deterministic element from the objective.
        risks = [
            "Limited brand awareness",
            "Potential regulatory constraints in the target market",
        ]
        if "sustain" in company_state.business_objective.lower():
            risks.append("Long‑term sustainability risk due to limited cash flow")

        # Recommendation – a short deterministic suggestion.
        recommendation = (
            "Focus on validating product‑market fit within the first 3 months, "
            "allocate ~20% of the budget to market research and early user acquisition."
        )

        # -----------------------------------------------------------------------
        return {
            "agent": self.name,
            "status": "completed",
            "market_assessment": market_assessment,
            "target_customers": target_customers,
            "competitors": competitors,
            "opportunities": opportunities,
            "risks": risks,
            "recommendation": recommendation,
        }

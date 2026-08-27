# backend/app/agents/marketing_agent.py
"""Marketing agent implementation.

Provides a deterministic placeholder marketing analysis based solely on the
company's state. No external APIs are called – all values are derived from the
fields supplied by ``CompanyState``.
"""

from __future__ import annotations

from typing import Dict, List, Any

from backend.app.core.company_state import CompanyState
from backend.app.agents.base_agent import BaseAgent


class MarketingAgent(BaseAgent):
    """Agent that creates a simple marketing strategy.

    The analysis is deterministic and uses only the information stored in the
    ``CompanyState`` model. This keeps the implementation lightweight and easy to
    test.
    """

    name: str = "Marketing Agent"
    role: str = "Marketing Strategy"
    description: str = (
        "Analyzes target market, defines acquisition strategy, channels, "
        "launch campaign and estimates marketing spend and ROI."
    )

    def __init__(self) -> None:
        super().__init__(name=self.name, role=self.role, description=self.description)

    def analyze(self, company_state: CompanyState) -> Dict[str, Any]:
        """Return a deterministic marketing analysis.

        Parameters
        ----------
        company_state: CompanyState
            Current company data supplied by the frontend.

        Returns
        -------
        dict
            Structured marketing analysis matching the required schema.
        """
        # ----- Deterministic placeholder logic ---------------------------------
        # Use the current capital (budget) to allocate a portion for marketing.
        # Allocate 20% of the current capital, but never less than 1,000.
        allocation = max(1_000, round(company_state.current_capital * 0.20, 2))

        # Simple acquisition strategy based on business idea and target market.
        acquisition_strategy = (
            f"Leverage digital channels to reach {company_state.target_market} "
            f"with messaging around the core value of {company_state.business_idea.split()[0]}."
        )

        # Choose marketing channels deterministically.
        if "student" in company_state.target_market.lower():
            channels = ["Social media (Instagram, TikTok)", "Campus ambassadors", "Influencer partnerships"]
        elif "enterprise" in company_state.target_market.lower():
            channels = ["LinkedIn ads", "Industry webinars", "Content marketing (whitepapers)"]
        else:
            channels = ["Google Ads", "Facebook ads", "Email newsletters"]

        # Simple launch campaign description.
        launch_campaign = (
            f"A three‑month launch campaign focusing on awareness, trial offers "
            f"and early‑adopter incentives, funded primarily from the allocated "
            f"₹{allocation:,.0f} marketing budget."
        )

        # Expected customer acquisition – deterministic: 0.05 customers per ₹1,000 spent.
        expected_acquisition = int((allocation / 1_000) * 0.05 * 1000)  # scale to integer customers
        # The above simplifies to allocation * 0.05 / 1 => allocation * 0.00005? Let's make clearer:
        # We'll calculate as: each ₹10,000 yields 1 customer.
        expected_acquisition = int(allocation // 10_000)

        # Risks – simple list with a deterministic element based on objective.
        risks: List[str] = []
        if "growth" in company_state.business_objective.lower():
            risks.append("Aggressive growth may outpace marketing effectiveness")
        if allocation < 5_000:
            risks.append("Insufficient marketing spend may limit reach")
        if not risks:
            risks.append("No major marketing risks identified")

        recommendation = (
            f"Allocate ₹{allocation:,.0f} to the identified channels, monitor CPL and "
            f"adjust spend to achieve at least {expected_acquisition} new customers in the first quarter."
        )

        # -----------------------------------------------------------------------
        return {
            "agent": self.name,
            "status": "completed",
            "customer_acquisition_strategy": acquisition_strategy,
            "marketing_channels": channels,
            "launch_campaign": launch_campaign,
            "estimated_marketing_allocation": allocation,
            "expected_customer_acquisition": expected_acquisition,
            "marketing_risks": risks,
            "recommendation": recommendation,
        }

"""Product agent implementation.

Deterministic placeholder analysis that uses the provided CompanyState.
"""

from __future__ import annotations

from typing import List, Dict, Any

from backend.app.core.company_state import CompanyState
from backend.app.agents.base_agent import BaseAgent


class ProductAgent(BaseAgent):
    """Agent responsible for product strategy analysis.

    It examines the business idea, target market, business objective, and the
    available budget to produce a simple deterministic product plan.
    """

    name: str = "Product Agent"
    role: str = "Product Strategy"
    description: str = "Analyzes product positioning, MVP features, development priorities, and risks."

    def __init__(self) -> None:
        super().__init__(name=self.name, role=self.role, description=self.description)

    def analyze(self, company_state: CompanyState) -> Dict[str, Any]:
        """Perform deterministic placeholder analysis of the product.

        Args:
            company_state: The current state of the simulated company.

        Returns:
            A dictionary matching the required schema.
        """
        # Simple deterministic logic based on company attributes
        idea = company_state.business_idea.lower()
        market = company_state.target_market.lower()
        objective = company_state.business_objective.lower()
        budget = company_state.current_capital

        # Product positioning string
        positioning = (
            f"A solution targeting {market} that addresses the need for "
            f"{idea.split(' ')[0] if idea else 'innovation'}."
        )

        # MVP features – choose based on keywords in the idea
        if "water" in idea:
            mvp_features = ["Smart sensor", "Mobile app integration", "Battery optimization"]
        elif "platform" in idea:
            mvp_features = ["Core API", "User dashboard", "Analytics module"]
        else:
            mvp_features = ["Core functionality", "User interface", "Basic reporting"]

        # Development priorities – depend on budget size
        if budget > 500_000:
            development_priorities = ["Fast time‑to‑market", "Scalable architecture", "User experience"]
        elif budget > 200_000:
            development_priorities = ["MVP release", "Reliability", "Feedback loop"]
        else:
            development_priorities = ["Essential features", "Cost containment", "Iterative releases"]

        # Estimated development months – simple function of budget
        estimated_development_months = max(1, int(budget // 100_000))

        # Risks – deterministic based on objective keywords
        risks: List[str] = []
        if "scale" in objective:
            risks.append("Scaling challenges")
        if "regulation" in objective:
            risks.append("Regulatory compliance")
        if not risks:
            risks.append("Market adoption uncertainty")

        recommendation = (
            f"Focus on delivering the MVP features ({', '.join(mvp_features)}) within "
            f"{estimated_development_months} month(s) while keeping costs aligned with the budget."
        )

        return {
            "agent": "Product Agent",
            "status": "completed",
            "product_positioning": positioning,
            "mvp_features": mvp_features,
            "development_priorities": development_priorities,
            "estimated_development_months": estimated_development_months,
            "product_risks": risks,
            "recommendation": recommendation,
        }

# backend/app/agents/finance_agent.py
"""Finance agent implementation.

Provides a deterministic placeholder financial analysis based on the supplied
:class:`~backend.app.core.company_state.CompanyState`. No external services are
used – the calculations are simple arithmetic derived from the company's
budget and other fields.
"""

from __future__ import annotations

from typing import Dict, List

from backend.app.core.company_state import CompanyState
from backend.app.agents.base_agent import BaseAgent


class FinanceAgent(BaseAgent):
    """Agent that evaluates the company's financial situation.

    The analysis is completely deterministic and uses only the values stored
    in ``CompanyState``. This keeps the implementation testable without any
    external dependencies.
    """

    name: str = "Finance Agent"
    role: str = "Financial Strategy"
    description: str = (
        "Analyzes capital, budgeting, runway, and financial risks for the company."
    )

    def __init__(self) -> None:
        super().__init__(name=self.name, role=self.role, description=self.description)

    def analyze(self, company_state: CompanyState) -> Dict[str, any]:
        """Return a deterministic financial analysis.

        Parameters
        ----------
        company_state: CompanyState
            Current company state supplied by the frontend.

        Returns
        -------
        dict
            Structured financial analysis compatible with the API schema.
        """
        # ---- Simple deterministic financial heuristics ----------------------
        # Budget analysis narrative.
        budget_analysis = (
            f"The company begins with an initial budget of ₹{company_state.initial_budget:,.0f}. "
            f"Current capital stands at ₹{company_state.current_capital:,.0f}, "
            "which will fund development, marketing and operating expenses."
        )

        # Estimate development cost as 30% of initial budget.
        estimated_development_cost = round(company_state.initial_budget * 0.30, 2)
        # Marketing budget as 20% of initial budget.
        estimated_marketing_budget = round(company_state.initial_budget * 0.20, 2)
        # Operating cost as 10% of initial budget per month.
        estimated_operating_cost = round(company_state.initial_budget * 0.10, 2)

        # Financial runway (months) = current capital / (monthly operating + marketing).
        monthly_outflow = estimated_operating_cost + (estimated_marketing_budget / 6)  # spread marketing over 6 months
        financial_runway_months = (
            round(company_state.current_capital / monthly_outflow, 1) if monthly_outflow > 0 else 0
        )

        # Simple revenue projection – 0.5x initial budget after first year.
        revenue_projection = round(company_state.initial_budget * 0.5, 2)

        # Risks based on runway length and budget proportion.
        financial_risks: List[str] = []
        if financial_runway_months < 3:
            financial_risks.append("Short runway – less than 3 months of cash remaining.")
        if estimated_development_cost > company_state.current_capital * 0.5:
            financial_risks.append("Development cost consumes more than half of current capital.")
        if "scale" in company_state.business_objective.lower():
            financial_risks.append("Scaling ambition may outpace cash flow.")
        if not financial_risks:
            financial_risks.append("No major financial risks identified at this stage.")

        recommendation = (
            "Allocate roughly 30% of the budget to product development, "
            "20% to marketing, and preserve the remainder for operating costs. "
            "Monitor runway closely and consider raising additional capital if "
            f"runway falls below {financial_runway_months} months."
        )

        # -------------------------------------------------------------------
        return {
            "agent": self.name,
            "status": "completed",
            "budget_analysis": budget_analysis,
            "estimated_development_cost": estimated_development_cost,
            "estimated_marketing_budget": estimated_marketing_budget,
            "estimated_operating_cost": estimated_operating_cost,
            "financial_runway_months": financial_runway_months,
            "revenue_projection": revenue_projection,
            "financial_risks": financial_risks,
            "recommendation": recommendation,
        }

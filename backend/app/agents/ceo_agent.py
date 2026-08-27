# backend/app/agents/ceo_agent.py
"""CEO agent implementation.

The CEO aggregates the analysis results from the Market, Finance, Product and
Marketing agents and produces a high‑level executive summary. All logic is
deterministic and based solely on the data supplied by the other agents – no
external AI services are used.
"""

from __future__ import annotations

from typing import Dict, Any, List

from backend.app.core.company_state import CompanyState
from backend.app.agents.base_agent import BaseAgent


class CEOAgent(BaseAgent):
    """Agent that synthesises the outputs of the other agents.

    The ``analyze`` method expects the ``company_state`` as usual and also a
    dictionary containing the previously gathered analyses. For simplicity the
    method receives only the ``company_state`` and will internally instantiate
    the other agents, call their ``analyze`` methods, and then combine the
    results.
    """

    name: str = "CEO Agent"
    role: str = "Executive Decision Making"
    description: str = (
        "Combines market, finance, product and marketing analyses to produce "
        "an executive summary and strategic priorities."
    )

    def __init__(self) -> None:
        super().__init__(name=self.name, role=self.role, description=self.description)

    def analyze(self, company_state: CompanyState) -> Dict[str, Any]:
        """Run a deterministic synthesis of all agent outputs.

        Returns a dictionary that matches the specification for the CEO agent.
        """
        # Import concrete agents locally to avoid circular imports at package init.
        from backend.app.agents.market_agent import MarketAgent
        from backend.app.agents.finance_agent import FinanceAgent
        from backend.app.agents.product_agent import ProductAgent
        from backend.app.agents.marketing_agent import MarketingAgent

        # Run each sub‑agent.
        market_res = MarketAgent().analyze(company_state)
        finance_res = FinanceAgent().analyze(company_state)
        product_res = ProductAgent().analyze(company_state)
        marketing_res = MarketingAgent().analyze(company_state)

        # Simple deterministic synthesis.
        summary_parts: List[str] = []
        summary_parts.append(market_res.get("market_assessment", ""))
        summary_parts.append(finance_res.get("budget_analysis", ""))
        summary_parts.append(product_res.get("product_positioning", ""))
        summary_parts.append(marketing_res.get("customer_acquisition_strategy", ""))
        executive_summary = " ".join([p for p in summary_parts if p])

        strategic_priorities = [
            "Validate product‑market fit",
            "Control cash burn",
            "Iterate on MVP features",
            "Execute targeted marketing campaigns",
        ]

        # Gather risks from each agent (unique list).
        risks_set = set()
        for res in (market_res, finance_res, product_res, marketing_res):
            # Different agents have different risk keys; handle gracefully.
            for key in ("risks", "financial_risks", "product_risks", "marketing_risks"):
                if key in res and isinstance(res[key], list):
                    risks_set.update(res[key])
        risks = list(risks_set) or ["No major risks identified"]

        recommendation = (
            "Proceed with the outlined strategy, monitor cash runway, "
            "and adjust marketing spend based on early customer acquisition metrics."
        )

        return {
            "agent": self.name,
            "status": "completed",
            "summary": executive_summary,
            "strategic_priorities": strategic_priorities,
            "risks": risks,
            "recommended_actions": [],  # kept for compatibility with earlier spec
            "recommendation": recommendation,
        }

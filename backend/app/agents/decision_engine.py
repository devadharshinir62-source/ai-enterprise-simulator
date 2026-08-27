# backend/app/agents/decision_engine.py
"""Decision engine implementation.

The engine receives the analyses from the other agents and produces a single
combined decision using a very simple deterministic scoring algorithm. No
external AI services are used.
"""

from __future__ import annotations

from typing import Dict, Any, List

from backend.app.core.company_state import CompanyState
from backend.app.agents.base_agent import BaseAgent


class DecisionEngine(BaseAgent):
    """Aggregates all agent analyses and produces a final decision.

    The ``analyze`` method expects the ``company_state`` and a dictionary of
    previous analyses keyed by agent name. It scores each analysis on a few
    deterministic criteria and selects the highest‑scoring actions.
    """

    name: str = "Decision Engine"
    role: str = "Decision Aggregation"
    description: str = (
        "Evaluates the outputs of all other agents and returns a final "
        "decision with confidence score."
    )

    def __init__(self) -> None:
        super().__init__(name=self.name, role=self.role, description=self.description)

    def analyze(
        self,
        company_state: CompanyState,
        analyses: Dict[str, Dict[str, Any]],
    ) -> Dict[str, Any]:
        """Return a deterministic decision based on supplied analyses.

        Parameters
        ----------
        company_state: CompanyState
            The current company state (unused for this placeholder).
        analyses: dict
            Mapping from agent name (e.g. "Market Agent") to that agent's output
            dictionary.

        Returns
        -------
        dict
            Combined decision structure.
        """
        # Simple deterministic scoring – each completed analysis gets 1 point.
        scores: Dict[str, int] = {}
        for agent_name, result in analyses.items():
            status = result.get("status", "")
            scores[agent_name] = 1 if status == "completed" else 0

        # Determine the "best" agent (highest score, tie‑break by alphabetical).
        best_agent = max(sorted(scores.keys()), key=lambda k: scores[k])
        decision = f"Follow recommendations from {best_agent}."
        confidence = scores[best_agent] / max(1, len(scores))

        # Collect selected and rejected actions (placeholder).
        selected_actions = [best_agent]
        rejected_actions = [a for a in scores if a != best_agent]

        # Gather reasons – just list each agent's status.
        reasoning = [f"{a}: {analyses[a].get('status', 'unknown')}" for a in analyses]

        return {
            "agent": self.name,
            "status": "completed",
            "decision": decision,
            "reasoning": reasoning,
            "selected_actions": selected_actions,
            "rejected_actions": rejected_actions,
            "confidence": round(confidence, 2),
        }

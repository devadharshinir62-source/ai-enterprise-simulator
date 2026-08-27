# backend/app/agents/base_agent.py
"""Base class for all simulator agents.

All specialized agents inherit from :class:`BaseAgent` and implement the
``analyze`` method, which receives a :class:`~backend.app.core.company_state.CompanyState`
instance and returns a JSON‑serialisable ``dict`` containing the agent's
analysis.
"""

from __future__ import annotations

from typing import Any, Dict

from backend.app.core.company_state import CompanyState


class BaseAgent:
    """Abstract base class for agents.

    Attributes
    ----------
    name: str
        Human‑readable agent name.
    role: str
        Short description of the agent's responsibility.
    description: str
        Longer narrative explaining what the agent does.
    """

    name: str = "Base Agent"
    role: str = "Generic"
    description: str = "Base class for agents – does not implement analysis."

    def __init__(self, name: str | None = None, role: str | None = None, description: str | None = None) -> None:
        """Create a new agent instance.

        Parameters
        ----------
        name: Optional[str]
            Override the default name.
        role: Optional[str]
            Override the default role.
        description: Optional[str]
            Override the default description.
        """
        if name is not None:
            self.name = name
        if role is not None:
            self.role = role
        if description is not None:
            self.description = description

    def analyze(self, company_state: CompanyState) -> Dict[str, Any]:
        """Placeholder analysis method.

        Concrete agents must override this method. The base implementation
        returns a minimal dictionary containing the agent's metadata.
        """
        return {
            "agent": self.name,
            "role": self.role,
            "description": self.description,
            "status": "not_implemented",
            "analysis": {},
        }

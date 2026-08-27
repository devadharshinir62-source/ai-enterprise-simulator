from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from uuid import uuid4
from typing import Dict, Any

from backend.app.core.company_state import CompanyState

from backend.app.agents.market_agent import MarketAgent
from backend.app.agents.finance_agent import FinanceAgent
from backend.app.agents.product_agent import ProductAgent
from backend.app.agents.marketing_agent import MarketingAgent
from backend.app.agents.ceo_agent import CEOAgent
from backend.app.agents.decision_engine import DecisionEngine
router = APIRouter()

# In‑memory storage for companies
_company_store: Dict[str, CompanyState] = {}

class CompanyCreateRequest(BaseModel):
    company_name: str = Field(..., description="Human readable company name")
    business_idea: str = Field(..., description="Brief description of the product/service")
    initial_budget: float = Field(..., ge=0, description="Starting capital in INR")
    target_market: str = Field(..., description="Target market description")
    business_objective: str = Field(..., description="Primary business objective")
    simulation_duration_months: int = Field(..., ge=1, description="Number of months to simulate")

@router.post("/company/create", response_model=CompanyState)
def create_company(payload: CompanyCreateRequest):
    """Create a new CompanyState and store it in memory."""
    company_id = str(uuid4())
    state = CompanyState(
        id=company_id,
        company_name=payload.company_name,
        business_idea=payload.business_idea,
        initial_budget=payload.initial_budget,
        current_capital=payload.initial_budget,
        target_market=payload.target_market,
        business_objective=payload.business_objective,
        simulation_duration_months=payload.simulation_duration_months,
        current_month=0,
        revenue=0.0,
        expenses=0.0,
        customers=0,
        status="initialized",
    )
    _company_store[company_id] = state
    return state

@router.get("/company/{company_id}", response_model=CompanyState)
def get_company(company_id: str):
    """Retrieve a stored CompanyState by its identifier."""
    if company_id not in _company_store:
        raise HTTPException(status_code=404, detail="Company not found")
    return _company_store[company_id]

@router.post("/company/{company_id}/simulate", response_model=CompanyState)
def simulate_month(company_id: str):
    """Advance the simulation by one month using deterministic logic.

    * revenue grows by 5 % of the initial budget each month.
    * expenses grow by 3 % of the initial budget each month.
    * each month gains 10 new customers.
    * current capital is updated by adding revenue and subtracting expenses.
    * status becomes ‘completed’ when the simulation reaches the configured duration.
    """
    company = _company_store.get(company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    growth_factor = 0.05
    expense_factor = 0.03
    company.current_month += 1
    month_revenue = company.initial_budget * growth_factor
    month_expenses = company.initial_budget * expense_factor
    company.revenue += month_revenue
    company.expenses += month_expenses
    company.customers += 10
    company.current_capital += month_revenue - month_expenses
    if company.current_month >= company.simulation_duration_months:
        company.status = "completed"
    else:
        company.status = "running"
    _company_store[company_id] = company
    return company

@router.get("/company/{company_id}/agents")
def list_agents(company_id: str) -> Dict[str, Any]:
    """Return a static status list for each AI leadership agent."""
    if company_id not in _company_store:
        raise HTTPException(status_code=404, detail="Company not found")
    agents = [
        {"name": "CEO Agent", "status": "ready"},
        {"name": "Market Agent", "status": "ready"},
        {"name": "Finance Agent", "status": "ready"},
        {"name": "Product Agent", "status": "ready"},
        {"name": "Marketing Agent", "status": "ready"},
        {"name": "Decision Engine", "status": "ready"},
    ]
    return {"agents": agents}

@router.post("/company/{company_id}/agents/run")
def run_agents(company_id: str) -> Dict[str, Any]:
    """Execute all six agents against the current company state and return their analyses.

    Order: Market → Finance → Product → Marketing → CEO → Decision Engine.
    """
    company = _company_store.get(company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    market_res = MarketAgent().analyze(company)
    finance_res = FinanceAgent().analyze(company)
    product_res = ProductAgent().analyze(company)
    marketing_res = MarketingAgent().analyze(company)
    ceo_res = CEOAgent().analyze(company)
    decision_res = DecisionEngine().analyze(company, {
        "Market Agent": market_res,
        "Finance Agent": finance_res,
        "Product Agent": product_res,
        "Marketing Agent": marketing_res,
        "CEO Agent": ceo_res,
    })
    return {
        "market": market_res,
        "finance": finance_res,
        "product": product_res,
        "marketing": marketing_res,
        "ceo": ceo_res,
        "decision": decision_res,
    }

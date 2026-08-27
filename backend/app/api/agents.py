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


# ============================================================
# ROUTER
# ============================================================

router = APIRouter()


# ============================================================
# IN-MEMORY COMPANY STORAGE
# ============================================================

_company_store: Dict[str, CompanyState] = {}


# ============================================================
# COMPANY CREATION REQUEST
# ============================================================

class CompanyCreateRequest(BaseModel):
    company_name: str = Field(
        ...,
        description="Human readable company name",
    )

    business_idea: str = Field(
        ...,
        description="Brief description of the product or service",
    )

    initial_budget: float = Field(
        ...,
        ge=0,
        description="Starting capital in INR",
    )

    target_market: str = Field(
        ...,
        description="Target market description",
    )

    business_objective: str = Field(
        ...,
        description="Primary business objective",
    )

    simulation_duration_months: int = Field(
        ...,
        ge=1,
        description="Number of months to simulate",
    )


# ============================================================
# CREATE COMPANY
# ============================================================

@router.post(
    "/company/create",
    response_model=CompanyState,
)
def create_company(payload: CompanyCreateRequest):

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


# ============================================================
# GET COMPANY
# ============================================================

@router.get(
    "/company/{company_id}",
    response_model=CompanyState,
)
def get_company(company_id: str):

    company = _company_store.get(company_id)

    if company is None:
        raise HTTPException(
            status_code=404,
            detail="Company not found",
        )

    return company


# ============================================================
# SIMULATE ONE MONTH
# ============================================================

@router.post(
    "/company/{company_id}/simulate",
    response_model=CompanyState,
)
def simulate_month(company_id: str):

    company = _company_store.get(company_id)

    if company is None:
        raise HTTPException(
            status_code=404,
            detail="Company not found",
        )

    # Prevent simulation after completion
    if company.current_month >= company.simulation_duration_months:
        company.status = "completed"
        return company

    # --------------------------------------------------------
    # Simulation calculations
    # --------------------------------------------------------

    revenue_factor = 0.05
    expense_factor = 0.03
    customers_per_month = 10

    company.current_month += 1

    month_revenue = (
        company.initial_budget * revenue_factor
    )

    month_expenses = (
        company.initial_budget * expense_factor
    )

    company.revenue += month_revenue

    company.expenses += month_expenses

    company.customers += customers_per_month

    company.current_capital += (
        month_revenue - month_expenses
    )

    # --------------------------------------------------------
    # Update status
    # --------------------------------------------------------

    if company.current_month >= company.simulation_duration_months:
        company.status = "completed"
    else:
        company.status = "running"

    _company_store[company_id] = company

    return company


# ============================================================
# LIST AI AGENTS
# ============================================================

@router.get(
    "/company/{company_id}/agents"
)
def list_agents(company_id: str) -> Dict[str, Any]:

    if company_id not in _company_store:
        raise HTTPException(
            status_code=404,
            detail="Company not found",
        )

    agents = [
        {
            "name": "CEO Agent",
            "status": "ready",
        },
        {
            "name": "Market Agent",
            "status": "ready",
        },
        {
            "name": "Finance Agent",
            "status": "ready",
        },
        {
            "name": "Product Agent",
            "status": "ready",
        },
        {
            "name": "Marketing Agent",
            "status": "ready",
        },
        {
            "name": "Decision Engine",
            "status": "ready",
        },
    ]

    return {
        "agents": agents
    }


# ============================================================
# RUN ALL AI AGENTS
# ============================================================

@router.post(
    "/company/{company_id}/agents/run"
)
def run_agents(company_id: str) -> Dict[str, Any]:

    company = _company_store.get(company_id)

    if company is None:
        raise HTTPException(
            status_code=404,
            detail="Company not found",
        )

    # --------------------------------------------------------
    # Run Market Agent
    # --------------------------------------------------------

    market_res = MarketAgent().analyze(company)

    # --------------------------------------------------------
    # Run Finance Agent
    # --------------------------------------------------------

    finance_res = FinanceAgent().analyze(company)

    # --------------------------------------------------------
    # Run Product Agent
    # --------------------------------------------------------

    product_res = ProductAgent().analyze(company)

    # --------------------------------------------------------
    # Run Marketing Agent
    # --------------------------------------------------------

    marketing_res = MarketingAgent().analyze(company)

    # --------------------------------------------------------
    # Run CEO Agent
    # --------------------------------------------------------

    ceo_res = CEOAgent().analyze(company)

    # --------------------------------------------------------
    # Run Decision Engine
    # --------------------------------------------------------

    decision_res = DecisionEngine().analyze(
        company,
        {
            "Market Agent": market_res,
            "Finance Agent": finance_res,
            "Product Agent": product_res,
            "Marketing Agent": marketing_res,
            "CEO Agent": ceo_res,
        },
    )

    # --------------------------------------------------------
    # Return complete AI analysis
    # --------------------------------------------------------

    return {
        "market": market_res,
        "finance": finance_res,
        "product": product_res,
        "marketing": marketing_res,
        "ceo": ceo_res,
        "decision": decision_res,
    }
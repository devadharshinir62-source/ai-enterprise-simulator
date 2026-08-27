from pydantic import BaseModel, Field


class CompanyState(BaseModel):
    """
    Model representing the mutable state of a simulated company.

    All fields are JSON-serialisable and used for FastAPI
    request/response models and as a simple container for
    deterministic agents.
    """

    id: str = Field(
        ...,
        description="Unique identifier for the company"
    )

    company_name: str = Field(
        ...,
        description="Human readable company name"
    )

    business_idea: str = Field(
        ...,
        description="Brief description of the product/service"
    )

    initial_budget: float = Field(
        ...,
        ge=0,
        description="Starting capital in INR"
    )

    current_capital: float = Field(
        ...,
        ge=0,
        description="Current cash after operations"
    )

    target_market: str = Field(
        ...,
        description="Target market description"
    )

    business_objective: str = Field(
        ...,
        description="Primary business objective"
    )

    simulation_duration_months: int = Field(
        ...,
        ge=1,
        description="Number of months to simulate"
    )

    current_month: int = Field(
        0,
        ge=0,
        description="Current month of the simulation"
    )

    revenue: float = Field(
        0.0,
        ge=0,
        description="Cumulative revenue earned so far"
    )

    expenses: float = Field(
        0.0,
        ge=0,
        description="Cumulative expenses incurred so far"
    )

    customers: int = Field(
        0,
        ge=0,
        description="Total customers acquired"
    )

    status: str = Field(
        "initialized",
        description="Simulation status flag"
    )
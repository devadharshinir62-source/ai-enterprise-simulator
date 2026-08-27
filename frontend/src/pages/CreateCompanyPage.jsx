import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8000";

function CreateCompanyPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    companyName: "",
    businessIdea: "",
    initialBudget: "",
    targetMarket: "",
    businessObjective: "",
    simulationDuration: "",
  });

  const [errors, setErrors] = useState({});
  const [fetchError, setFetchError] = useState("");
  const [loading, setLoading] = useState(false);

  // -----------------------------------------
  // Handle input changes
  // -----------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Remove error for the field being edited
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setFetchError("");
  };

  // -----------------------------------------
  // Validate form
  // -----------------------------------------
  const validate = () => {
    const newErrors = {};

    if (!form.companyName.trim()) {
      newErrors.companyName = "Company name is required.";
    }

    if (!form.businessIdea.trim()) {
      newErrors.businessIdea = "Business idea is required.";
    } else if (form.businessIdea.trim().length < 10) {
      newErrors.businessIdea =
        "Business idea must contain at least 10 characters.";
    }

    if (!form.initialBudget) {
      newErrors.initialBudget = "Initial budget is required.";
    } else if (Number(form.initialBudget) <= 0) {
      newErrors.initialBudget = "Budget must be greater than 0.";
    }

    if (!form.targetMarket.trim()) {
      newErrors.targetMarket = "Target market is required.";
    }

    if (!form.businessObjective.trim()) {
      newErrors.businessObjective = "Business objective is required.";
    } else if (form.businessObjective.trim().length < 10) {
      newErrors.businessObjective =
        "Business objective must contain at least 10 characters.";
    }

    if (!form.simulationDuration) {
      newErrors.simulationDuration = "Simulation duration is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // -----------------------------------------
  // Submit form
  // -----------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("=================================");
    console.log("INITIALIZE COMPANY CLICKED");
    console.log("FORM DATA:", form);
    console.log("=================================");

    setFetchError("");

    // Validate form
    const isValid = validate();

    if (!isValid) {
      console.log("FORM VALIDATION FAILED");
      return;
    }

    // Create backend payload
    const payload = {
      company_name: form.companyName.trim(),
      business_idea: form.businessIdea.trim(),
      initial_budget: Number(form.initialBudget),
      target_market: form.targetMarket.trim(),
      business_objective: form.businessObjective.trim(),
      simulation_duration_months: Number(form.simulationDuration),
    };

    console.log("SENDING REQUEST TO BACKEND");
    console.log("URL:", `${API_URL}/api/company/create`);
    console.log("PAYLOAD:", payload);

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/company/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      console.log("BACKEND STATUS:", response.status);

      // Handle backend error
      if (!response.ok) {
        let errorMessage = "Failed to create company.";

        try {
          const errorData = await response.json();

          console.error("BACKEND ERROR:", errorData);

          if (errorData.detail) {
            errorMessage =
              typeof errorData.detail === "string"
                ? errorData.detail
                : JSON.stringify(errorData.detail);
          } else if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (error) {
          console.error("Could not read backend error:", error);
        }

        throw new Error(errorMessage);
      }

      // Read successful response
      const company = await response.json();

      console.log("COMPANY CREATED SUCCESSFULLY:");
      console.log(company);

      // Save company information
      localStorage.setItem(
        "ai_enterprise_company",
        JSON.stringify(company)
      );

      // Navigate to dashboard
      console.log("NAVIGATING TO DASHBOARD...");

      navigate("/dashboard");
    } catch (error) {
      console.error("COMPANY CREATION ERROR:", error);

      if (error instanceof TypeError) {
        setFetchError(
          "Unable to connect to the backend. Please make sure FastAPI is running on http://localhost:8000."
        );
      } else {
        setFetchError(
          error.message || "Something went wrong while creating the company."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------
  // Go back
  // -----------------------------------------
  const goBack = () => {
    navigate("/");
  };

  // -----------------------------------------
  // UI
  // -----------------------------------------
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 flex items-center justify-center">
      <div className="w-full max-w-2xl py-8">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3">
            Create Your Virtual Company
          </h1>

          <p className="text-gray-300">
            Define your business. Our AI leadership team will handle the
            strategy.
          </p>
        </div>

        {/* Error from backend */}
        {fetchError && (
          <div className="mb-6 rounded-lg border border-red-500 bg-red-900/30 p-4 text-red-300">
            <strong>Error:</strong> {fetchError}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* Company Name */}
          <div>
            <label className="block mb-2 font-semibold">
              Company Name
            </label>

            <input
              type="text"
              name="companyName"
              value={form.companyName}
              onChange={handleChange}
              placeholder="Enter your company name"
              className="w-full rounded-lg border border-gray-700 bg-gray-800 p-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            {errors.companyName && (
              <p className="mt-1 text-sm text-red-400">
                {errors.companyName}
              </p>
            )}
          </div>

          {/* Business Idea */}
          <div>
            <label className="block mb-2 font-semibold">
              Business / Product Idea
            </label>

            <textarea
              name="businessIdea"
              value={form.businessIdea}
              onChange={handleChange}
              placeholder="Example: AI-powered smart water bottle for college students"
              rows={4}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 p-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            {errors.businessIdea && (
              <p className="mt-1 text-sm text-red-400">
                {errors.businessIdea}
              </p>
            )}
          </div>

          {/* Initial Budget */}
          <div>
            <label className="block mb-2 font-semibold">
              Initial Budget (₹)
            </label>

            <input
              type="number"
              name="initialBudget"
              value={form.initialBudget}
              onChange={handleChange}
              placeholder="100000"
              min="1"
              className="w-full rounded-lg border border-gray-700 bg-gray-800 p-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            {errors.initialBudget && (
              <p className="mt-1 text-sm text-red-400">
                {errors.initialBudget}
              </p>
            )}
          </div>

          {/* Target Market */}
          <div>
            <label className="block mb-2 font-semibold">
              Target Market
            </label>

            <input
              type="text"
              name="targetMarket"
              value={form.targetMarket}
              onChange={handleChange}
              placeholder="College students in India"
              className="w-full rounded-lg border border-gray-700 bg-gray-800 p-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            {errors.targetMarket && (
              <p className="mt-1 text-sm text-red-400">
                {errors.targetMarket}
              </p>
            )}
          </div>

          {/* Business Objective */}
          <div>
            <label className="block mb-2 font-semibold">
              Business Objective
            </label>

            <textarea
              name="businessObjective"
              value={form.businessObjective}
              onChange={handleChange}
              placeholder="Launch the product and achieve profitability"
              rows={3}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 p-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            {errors.businessObjective && (
              <p className="mt-1 text-sm text-red-400">
                {errors.businessObjective}
              </p>
            )}
          </div>

          {/* Simulation Duration */}
          <div>
            <label className="block mb-2 font-semibold">
              Simulation Duration
            </label>

            <select
              name="simulationDuration"
              value={form.simulationDuration}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 p-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select duration</option>
              <option value="3">3 months</option>
              <option value="6">6 months</option>
              <option value="12">12 months</option>
              <option value="24">24 months</option>
            </select>

            {errors.simulationDuration && (
              <p className="mt-1 text-sm text-red-400">
                {errors.simulationDuration}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">

            {/* Initialize Company */}
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-indigo-600 px-6 py-4 text-lg font-semibold hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              {loading ? "Creating Company..." : "Initialize Company"}
            </button>

            {/* Back */}
            <button
              type="button"
              onClick={goBack}
              disabled={loading}
              className="flex-1 rounded-lg bg-gray-700 px-6 py-4 text-lg font-semibold hover:bg-gray-600 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Back
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateCompanyPage;
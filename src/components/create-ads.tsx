import React, { useState } from "react";
import { FacebookPage } from "../types/facebook";
import { ArrowLeft, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { facebookSDK } from "../services/facebookSDK";

interface AdCreationProps {
  page: FacebookPage;
  onBack: () => void;
}

export const AdCreation: React.FC<AdCreationProps> = ({ page, onBack }) => {
  const [adText, setAdText] = useState("");
  const [budget, setBudget] = useState("100");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [error, setError] = useState("");

  const handleAdCreate = async () => {
    setStatus("loading");
    setError("");
    try {
      await facebookSDK.createAdCampaign(
        page.id,
        page.access_token,
        adText,
        budget
      );
      setStatus("success");
    } catch (err: unknown) {
      setStatus("error");
      setError(
        typeof err === "object" && err !== null && "message" in err
          ? String((err as { message?: unknown }).message)
          : "Failed to create ad"
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white mt-6 rounded-xl shadow">
      <div className="flex items-center space-x-4 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-semibold">Create Ad for: {page.name}</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Ad Text</label>
          <textarea
            className="w-full border rounded px-3 py-2"
            rows={4}
            value={adText}
            onChange={(e) => setAdText(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Budget (INR)</label>
          <input
            type="number"
            className="w-full border rounded px-3 py-2"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
        </div>

        <button
          onClick={handleAdCreate}
          disabled={status === "loading"}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded"
        >
          {status === "loading" ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Creating Ad...</span>
            </div>
          ) : (
            "Create Ad"
          )}
        </button>

        {status === "success" && (
          <div className="flex items-center text-green-700 bg-green-100 px-4 py-2 rounded space-x-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>Ad created successfully!</span>
          </div>
        )}
        {status === "error" && (
          <div className="flex items-center text-red-700 bg-red-100 px-4 py-2 rounded space-x-2">
            <AlertTriangle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from "react";

export function CampaignManager() {
  const [name, setName] = useState("");
  const [repo, setRepo] = useState("");
  const [campaignId, setCampaignId] = useState("");
  const [scores, setScores] = useState<any>(null);

  const handleCreate = async () => {
    const res = await fetch("/api/campaign/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, repo }),
    });
    const data = await res.json();
    if (data.success) setCampaignId(data.campaign.id);
    else alert(data.error);
  };

  const handleFinalize = async () => {
    const res = await fetch("/api/campaign/finalize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ campaignId }),
    });
    const data = await res.json();
    if (data.success) setScores(data.result.scores);
    else alert(data.error);
  };

  return (
    <div className="p-4 border rounded max-w-md mx-auto my-8 bg-white shadow">
      <h2 className="text-xl font-bold mb-2">Create Campaign</h2>
      <input
        className="border p-2 mb-2 w-full"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Campaign Name"
      />
      <input
        className="border p-2 mb-2 w-full"
        value={repo}
        onChange={e => setRepo(e.target.value)}
        placeholder="GitHub Repo (owner/repo)"
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
        onClick={handleCreate}
      >
        Create
      </button>
      {campaignId && (
        <div className="mb-4">
          <div className="font-mono text-sm">Campaign ID: {campaignId}</div>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded mt-2"
            onClick={handleFinalize}
          >
            Finalize & Score
          </button>
        </div>
      )}
      {scores && (
        <div>
          <h3 className="font-bold mt-4">Scores</h3>
          <pre className="bg-gray-100 p-2 rounded">{JSON.stringify(scores, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

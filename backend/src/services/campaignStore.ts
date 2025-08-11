// In-memory campaign store for PoC
export interface Campaign {
  id: string;
  name: string;
  repo: string;
  createdAt: number;
  finalized: boolean;
}

const campaigns: Record<string, Campaign> = {};

export function createCampaign(name: string, repo: string): Campaign {
  const id = Math.random().toString(36).slice(2, 10);
  const campaign: Campaign = { id, name, repo, createdAt: Date.now(), finalized: false };
  campaigns[id] = campaign;
  return campaign;
}

export function getCampaign(id: string): Campaign | undefined {
  return campaigns[id];
}

export function finalizeCampaignStore(id: string) {
  if (campaigns[id]) campaigns[id].finalized = true;
}

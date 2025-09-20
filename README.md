# 🌟 Welcome to FairPlay Protocol

FairPlay Protocol is a groundbreaking on-chain reward distribution system designed to ensure fairness and transparency in collaborative environments. Whether you're running a hackathon, a bounty campaign, or any contribution-based initiative, FairPlay ensures contributors are rewarded equitably based on their efforts.

Check out on-chain: 3YqitnvPHdQ94PWCvpTWy8CDjYiVrYCUT6D5AZUzwAK1
---

## 🤔 What is FairPlay?

FairPlay Protocol is built to:
- **Launch campaigns**: Organizers can create campaigns with a reward pool (in USDC) and set deadlines.
- **Track contributions**: Automatically monitor GitHub Pull Requests (PRs) and evaluate their impact.
- **Distribute rewards**: Allocate rewards transparently based on a scoring model.

---

## 🚀 How to Interact with FairPlay

### For Organizers:
1. **Create a Campaign**: Use the frontend to set up a campaign, define the reward pool, and specify the GitHub repository to track.
2. **Fund the Campaign**: Deposit USDC into the campaign's escrow account.
3. **Monitor Contributions**: Let the backend handle GitHub PR tracking and scoring.
4. **Close the Campaign**: Once the deadline passes, finalize the campaign to calculate rewards.

### For Contributors:
1. **Connect Your Wallet**: Link your Solana wallet to the campaign via the frontend.
2. **Contribute**: Submit meaningful PRs to the specified GitHub repository.
3. **Track Your Score**: View your contribution score and potential rewards in real-time.
4. **Claim Rewards**: After the campaign ends, withdraw your share of the reward pool.

---

## 🧮 How Rewards Are Calculated

FairPlay uses a transparent scoring model:

| Contribution Type         | Description                        | Score |
|---------------------------|------------------------------------|-------|
| ✅ **Merged PR**          | Successfully merged into the repo | 100   |
| 🕵️‍♂️ **Reviewed PR**     | Not merged but reviewed/discussed | 20    |
| 🚫 **Spam/Invalid PR**    | Irrelevant or spammy              | 0     |

Rewards are distributed proportionally:

```
reward_i = (score_i / total_scores) * total_reward
```

---

## 🛠️ Technology Stack

- **Blockchain**: Solana (Anchor framework)
- **Backend**: Node.js / Express
- **Frontend**: React + TailwindCSS
- **Token**: USDC on Solana

---

## 📜 Key Features

- **On-Chain Transparency**: All campaign and reward data is stored on Solana.
- **GitHub Integration**: Automatically syncs and scores contributions.
- **User-Friendly Interface**: Intuitive frontend for both organizers and contributors.

---

## 🤝 Join the FairPlay Community

We believe in building together. If you have ideas, feedback, or want to contribute, reach out to us:

- **Lead Developer**: Emmanuel Adebayo Abimbola
- **GitHub**: [github.com/neocryptoquant](https://github.com/neocryptoquant)
- **Twitter**: [@eurojohnson1](https://twitter.com/eurojohnson1)

---

## ⚠️ Disclaimer

FairPlay Protocol is currently in its Proof of Concept (PoC) phase. While we strive for reliability, this version is intended for experimental use only. Future iterations will address scalability, security, and multi-campaign support.

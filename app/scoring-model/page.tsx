const ScoringModelPage = () => {
  return (
    <div className="bg-gray-900 rounded-xl p-6 text-green-400 font-mono text-sm overflow-x-auto">
      <div className="mb-2">{"// Pseudocode for reward calculation"}</div>
      <div className="mb-2">{"function calculateRewards(contributors, totalRewardPool) {"}</div>
      <div className="ml-4 mb-2">{"  totalScore = sum(contributors.map(c => c.score))"}</div>
      <div className="ml-4 mb-2">{"  contributors.forEach(contributor => {"}</div>
      <div className="ml-8 mb-2">{"    percentage = contributor.score / totalScore"}</div>
      <div className="ml-8 mb-2">{"    contributor.reward = percentage * totalRewardPool"}</div>
      <div className="ml-4 mb-2">{"  })"}</div>
      <div className="mb-2">{"  return contributors"}</div>
      <div>{"}"}</div>
    </div>
  )
}

export default ScoringModelPage

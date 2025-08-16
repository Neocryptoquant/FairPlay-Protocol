async function handleContribution(userWallet, contributionType, prStatus) {
  // 1. Validate input
  if (!userWallet || !contributionType) throw Error("Invalid data")

  // 2. Determine score based on rules
  const score = prStatus === "merged" ? 100 : prStatus === "unmerged_with_issues" ? 20 : 0

  // 3. Prepare transaction data for Solana program
  const txData = {
    campaignId: currentCampaignId, // from state
    contributor: userWallet,
    score,
  }

  // 4. Call Solana program function
  const txSig = await solanaProgram.methods
    .assignScore(new BN(score))
    .accounts({
      campaign: campaignPDA,
      contributor: contributorPDA(userWallet),
      authority: backendAuthority,
      systemProgram: SystemProgram.programId,
    })
    .signers([backendAuthorityKeypair])
    .rpc()

  // 5. Update frontend state
  emitToFrontend("scoreUpdated", { userWallet, score, txSig })

  // 6. Log result
  console.log(`Score ${score} assigned to ${userWallet}. Tx: ${txSig}`)
}

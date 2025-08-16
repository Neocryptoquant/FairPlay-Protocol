import { type Connection, PublicKey, Transaction, SystemProgram } from "@solana/web3.js"
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from "@solana/spl-token"
import * as anchor from "@coral-xyz/anchor"

// Program ID from your IDL
const PROGRAM_ID = new PublicKey("3YqitnvPHdQ94PWCvpTWy8CDjYiVrYCUT6D5AZUzwAK1")
const USDC_MINT = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v") // USDC mainnet

export interface CampaignData {
  gitRepoUrl: string
  rewardAmount: number
  duration: number
  description: string
}

export class SolanaProgram {
  private connection: Connection
  private wallet: any

  constructor(connection: Connection, wallet: any) {
    this.connection = connection
    this.wallet = wallet
  }

  // Generate PDAs
  private getCampaignConfigPDA(seed: number) {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("CampaignConfig"), new anchor.BN(seed).toArrayLike(Buffer, "le", 8)],
      PROGRAM_ID,
    )
  }

  private getEscrowPDA(user: PublicKey, seed: number) {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("escrow"), user.toBuffer(), new anchor.BN(seed).toArrayLike(Buffer, "le", 8)],
      PROGRAM_ID,
    )
  }

  private getContributorPDA(user: PublicKey) {
    return PublicKey.findProgramAddressSync([Buffer.from("Contributor"), user.toBuffer()], PROGRAM_ID)
  }

  private getVaultPDA(escrow: PublicKey) {
    return PublicKey.findProgramAddressSync(
      [escrow.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), USDC_MINT.toBuffer()],
      ASSOCIATED_TOKEN_PROGRAM_ID,
    )
  }

  // Initialize campaign
  async initializeCampaign(campaignData: CampaignData): Promise<string> {
    if (!this.wallet.publicKey) throw new Error("Wallet not connected")

    console.log("[v0] Starting campaign initialization...")
    console.log("[v0] Campaign data:", campaignData)

    const seed = Math.floor(Math.random() * 1000000)
    const campaignId = Math.floor(Math.random() * 255)

    const [campaignConfig] = this.getCampaignConfigPDA(seed)
    const [escrow] = this.getEscrowPDA(this.wallet.publicKey, seed)
    const [contributor] = this.getContributorPDA(this.wallet.publicKey)
    const [vault] = this.getVaultPDA(escrow)

    console.log("[v0] Generated PDAs:")
    console.log("[v0] - Campaign Config:", campaignConfig.toString())
    console.log("[v0] - Escrow:", escrow.toString())
    console.log("[v0] - Contributor:", contributor.toString())
    console.log("[v0] - Vault:", vault.toString())

    const startTime = new anchor.BN(Date.now() / 1000)
    const endTime = new anchor.BN(Date.now() / 1000 + campaignData.duration * 24 * 60 * 60)
    const totalPoolAmount = new anchor.BN(campaignData.rewardAmount * 1_000_000) // Convert to USDC decimals

    console.log("[v0] Campaign parameters:")
    console.log("[v0] - Seed:", seed)
    console.log("[v0] - Campaign ID:", campaignId)
    console.log("[v0] - Start time:", startTime.toString())
    console.log("[v0] - End time:", endTime.toString())
    console.log("[v0] - Total pool amount:", totalPoolAmount.toString())

    try {
      // Create instruction data
      const instructionData = Buffer.concat([
        Buffer.from([175, 175, 109, 31, 13, 152, 155, 237]), // initialize discriminator
        new anchor.BN(seed).toArrayLike(Buffer, "le", 8),
        Buffer.from([campaignId]),
        totalPoolAmount.toArrayLike(Buffer, "le", 16),
        startTime.toArrayLike(Buffer, "le", 8),
        endTime.toArrayLike(Buffer, "le", 8),
        new anchor.BN(0).toArrayLike(Buffer, "le", 16), // total_score
        new anchor.BN(0).toArrayLike(Buffer, "le", 4), // no_of_contributors
        startTime.toArrayLike(Buffer, "le", 8), // created_at
      ])

      console.log("[v0] Instruction data length:", instructionData.length)

      const instruction = {
        programId: PROGRAM_ID,
        keys: [
          { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
          { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
          { pubkey: ASSOCIATED_TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
          { pubkey: this.wallet.publicKey, isSigner: true, isWritable: true }, // sponsor
          { pubkey: this.wallet.publicKey, isSigner: true, isWritable: true }, // user
          { pubkey: USDC_MINT, isSigner: false, isWritable: false },
          { pubkey: escrow, isSigner: false, isWritable: true },
          { pubkey: campaignConfig, isSigner: false, isWritable: true },
          { pubkey: contributor, isSigner: false, isWritable: true },
          { pubkey: vault, isSigner: false, isWritable: true },
        ],
        data: instructionData,
      }

      console.log("[v0] Creating transaction...")
      const transaction = new Transaction().add(instruction)

      console.log("[v0] Sending transaction...")
      const signature = await this.wallet.sendTransaction(transaction, this.connection)
      console.log("[v0] Transaction sent with signature:", signature)

      console.log("[v0] Confirming transaction...")
      const confirmation = await this.connection.confirmTransaction(signature, "confirmed")
      console.log("[v0] Transaction confirmation:", confirmation)

      if (confirmation.value.err) {
        throw new Error(`Transaction failed: ${JSON.stringify(confirmation.value.err)}`)
      }

      console.log("[v0] Campaign initialized successfully!")
      return `${seed}-${campaignId}`
    } catch (error) {
      console.error("[v0] Error in initializeCampaign:", error)
      if (error instanceof Error) {
        console.error("[v0] Error message:", error.message)
        console.error("[v0] Error stack:", error.stack)
      }
      throw error
    }
  }

  // Deposit USDC to campaign
  async depositToCampaign(campaignId: string, amount: number): Promise<string> {
    if (!this.wallet.publicKey) throw new Error("Wallet not connected")

    console.log("[v0] Starting deposit to campaign:", campaignId)
    console.log("[v0] Deposit amount:", amount)

    try {
      const [seed] = campaignId.split("-").map(Number)
      const [escrow] = this.getEscrowPDA(this.wallet.publicKey, seed)
      const [campaignConfig] = this.getCampaignConfigPDA(seed)
      const [contributor] = this.getContributorPDA(this.wallet.publicKey)
      const [vault] = this.getVaultPDA(escrow)

      const sponsorTokenAccount = await getAssociatedTokenAddress(USDC_MINT, this.wallet.publicKey)
      const depositAmount = new anchor.BN(amount * 1_000_000) // Convert to USDC decimals

      console.log("[v0] Deposit PDAs:")
      console.log("[v0] - Sponsor token account:", sponsorTokenAccount.toString())
      console.log("[v0] - Vault:", vault.toString())
      console.log("[v0] - Deposit amount (micro USDC):", depositAmount.toString())

      const instructionData = Buffer.concat([
        Buffer.from([242, 35, 198, 137, 82, 225, 242, 182]), // deposit discriminator
        depositAmount.toArrayLike(Buffer, "le", 8),
      ])

      const instruction = {
        programId: PROGRAM_ID,
        keys: [
          { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
          { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
          { pubkey: ASSOCIATED_TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
          { pubkey: this.wallet.publicKey, isSigner: true, isWritable: true }, // sponsor
          { pubkey: this.wallet.publicKey, isSigner: true, isWritable: true }, // user
          { pubkey: USDC_MINT, isSigner: false, isWritable: false },
          { pubkey: escrow, isSigner: false, isWritable: false },
          { pubkey: campaignConfig, isSigner: false, isWritable: false },
          { pubkey: contributor, isSigner: false, isWritable: false },
          { pubkey: vault, isSigner: false, isWritable: true },
          { pubkey: sponsorTokenAccount, isSigner: false, isWritable: true },
        ],
        data: instructionData,
      }

      const transaction = new Transaction().add(instruction)
      console.log("[v0] Sending deposit transaction...")
      const signature = await this.wallet.sendTransaction(transaction, this.connection)
      console.log("[v0] Deposit transaction sent:", signature)

      const confirmation = await this.connection.confirmTransaction(signature, "confirmed")
      console.log("[v0] Deposit confirmation:", confirmation)

      if (confirmation.value.err) {
        throw new Error(`Deposit transaction failed: ${JSON.stringify(confirmation.value.err)}`)
      }

      console.log("[v0] Deposit completed successfully!")
      return signature
    } catch (error) {
      console.error("[v0] Error in depositToCampaign:", error)
      if (error instanceof Error) {
        console.error("[v0] Error message:", error.message)
      }
      throw error
    }
  }

  // Assign score to contributor
  async assignScore(campaignId: string, contributorPublicKey: PublicKey, score: number): Promise<string> {
    if (!this.wallet.publicKey) throw new Error("Wallet not connected")

    const [seed] = campaignId.split("-").map(Number)
    const [escrow] = this.getEscrowPDA(contributorPublicKey, seed)
    const [campaignConfig] = this.getCampaignConfigPDA(seed)
    const [contributor] = this.getContributorPDA(contributorPublicKey)
    const [vault] = this.getVaultPDA(escrow)

    const contributionScore = new anchor.BN(score)

    const instructionData = Buffer.concat([
      Buffer.from([228, 170, 169, 248, 127, 170, 0, 110]), // assign_score discriminator
      new anchor.BN(seed).toArrayLike(Buffer, "le", 8),
      contributionScore.toArrayLike(Buffer, "le", 16),
    ])

    const instruction = {
      programId: PROGRAM_ID,
      keys: [
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
        { pubkey: ASSOCIATED_TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
        { pubkey: this.wallet.publicKey, isSigner: true, isWritable: true }, // sponsor
        { pubkey: contributorPublicKey, isSigner: true, isWritable: true }, // user
        { pubkey: USDC_MINT, isSigner: false, isWritable: false },
        { pubkey: escrow, isSigner: false, isWritable: true },
        { pubkey: campaignConfig, isSigner: false, isWritable: true },
        { pubkey: contributor, isSigner: false, isWritable: true },
        { pubkey: vault, isSigner: false, isWritable: true },
      ],
      data: instructionData,
    }

    const transaction = new Transaction().add(instruction)
    const signature = await this.wallet.sendTransaction(transaction, this.connection)
    await this.connection.confirmTransaction(signature)

    return signature
  }

  // Claim rewards
  async claimReward(campaignId: string, rewardShare: number): Promise<string> {
    if (!this.wallet.publicKey) throw new Error("Wallet not connected")

    const [seed] = campaignId.split("-").map(Number)
    const [escrow] = this.getEscrowPDA(this.wallet.publicKey, seed)
    const [campaignConfig] = this.getCampaignConfigPDA(seed)
    const [contributor] = this.getContributorPDA(this.wallet.publicKey)
    const [vault] = this.getVaultPDA(escrow)

    const userTokenAccount = await getAssociatedTokenAddress(USDC_MINT, this.wallet.publicKey)
    const rewardAmount = new anchor.BN(rewardShare)

    const instructionData = Buffer.concat([
      Buffer.from([149, 95, 181, 242, 94, 90, 158, 162]), // claim_reward discriminator
      rewardAmount.toArrayLike(Buffer, "le", 8),
    ])

    const instruction = {
      programId: PROGRAM_ID,
      keys: [
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
        { pubkey: ASSOCIATED_TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
        { pubkey: this.wallet.publicKey, isSigner: true, isWritable: true }, // sponsor
        { pubkey: this.wallet.publicKey, isSigner: true, isWritable: true }, // user
        { pubkey: USDC_MINT, isSigner: false, isWritable: false },
        { pubkey: escrow, isSigner: false, isWritable: false },
        { pubkey: campaignConfig, isSigner: false, isWritable: false },
        { pubkey: contributor, isSigner: false, isWritable: true },
        { pubkey: vault, isSigner: false, isWritable: true },
        { pubkey: userTokenAccount, isSigner: false, isWritable: true },
      ],
      data: instructionData,
    }

    const transaction = new Transaction().add(instruction)
    const signature = await this.wallet.sendTransaction(transaction, this.connection)
    await this.connection.confirmTransaction(signature)

    return signature
  }

  async finalizeCampaign(campaignId: string): Promise<string> {
    if (!this.wallet.publicKey) throw new Error("Wallet not connected")

    const [seed] = campaignId.split("-").map(Number)
    const [escrow] = this.getEscrowPDA(this.wallet.publicKey, seed)
    const [campaignConfig] = this.getCampaignConfigPDA(seed)
    const [contributor] = this.getContributorPDA(this.wallet.publicKey)
    const [vault] = this.getVaultPDA(escrow)

    const instructionData = Buffer.concat([
      Buffer.from([204, 94, 227, 230, 158, 148, 60, 5]), // finalize discriminator (placeholder)
      new anchor.BN(seed).toArrayLike(Buffer, "le", 8),
    ])

    const instruction = {
      programId: PROGRAM_ID,
      keys: [
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
        { pubkey: ASSOCIATED_TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
        { pubkey: this.wallet.publicKey, isSigner: true, isWritable: true }, // sponsor
        { pubkey: this.wallet.publicKey, isSigner: true, isWritable: true }, // user
        { pubkey: USDC_MINT, isSigner: false, isWritable: false },
        { pubkey: escrow, isSigner: false, isWritable: true },
        { pubkey: campaignConfig, isSigner: false, isWritable: true },
        { pubkey: contributor, isSigner: false, isWritable: true },
        { pubkey: vault, isSigner: false, isWritable: true },
      ],
      data: instructionData,
    }

    const transaction = new Transaction().add(instruction)
    const signature = await this.wallet.sendTransaction(transaction, this.connection)
    await this.connection.confirmTransaction(signature)

    console.log("[v0] Campaign finalized with signature:", signature)
    return signature
  }

  async isCampaignEnded(campaignId: string): Promise<boolean> {
    try {
      const [seed] = campaignId.split("-").map(Number)
      const [campaignConfig] = this.getCampaignConfigPDA(seed)

      const accountInfo = await this.connection.getAccountInfo(campaignConfig)
      if (!accountInfo) return false

      // Parse end_time from account data (assuming it's at offset 32)
      const endTime = new anchor.BN(accountInfo.data.slice(32, 40), "le")
      const currentTime = Math.floor(Date.now() / 1000)

      return endTime.toNumber() < currentTime
    } catch (error) {
      console.error("[v0] Error checking campaign status:", error)
      return false
    }
  }
}

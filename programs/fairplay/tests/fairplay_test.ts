import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import BN from "bn.js";
import type { Fairplay } from "../target/types/fairplay";
import { PublicKey, Keypair, SystemProgram } from "@solana/web3.js";
import { 
  TOKEN_PROGRAM_ID, 
  ASSOCIATED_TOKEN_PROGRAM_ID, 
  createMint, 
  createAssociatedTokenAccount, 
  mintTo, 
  getAssociatedTokenAddress 
} from "@solana/spl-token";
import { expect } from "chai";

describe("FairPlay Protocol Tests", () => {
  // Initialize provider and program
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.Fairplay as Program<Fairplay>;

  // Test configuration
  const seed = new BN(Math.floor(Math.random() * 1000000));
  const campaignId = 1;
  const totalPoolAmount = new BN(1000000); // 1 USDC
  const depositAmount = new BN(500000); // 0.5 USDC
  const contributionScore = new BN(100);
  const rewardShare = new BN(250000); // 0.25 USDC

  // Accounts
  let sponsor: Keypair;
  let user: Keypair;
  let usdcMint: PublicKey;
  let sponsorTokenAccount: PublicKey;
  let userTokenAccount: PublicKey;
  
  // PDAs
  let escrowPDA: PublicKey;
  let campaignConfig: PublicKey;
  let contributor: PublicKey;
  let vault: PublicKey;

  // Helper to fund wallet
  const fundWallet = async (wallet: Keypair): Promise<void> => {
    const sig = await provider.connection.requestAirdrop(
      wallet.publicKey, 
      5 * anchor.web3.LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(sig);
    // Wait for balance to reflect
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  before(async () => {
    console.log("Setting up test environment...");
    
    // Create wallets
    sponsor = Keypair.generate();
    user = Keypair.generate();
    
    // Fund wallets
    await fundWallet(sponsor);
    await fundWallet(user);
    
    console.log(`Sponsor: ${sponsor.publicKey}`);
    console.log(`User: ${user.publicKey}`);
    
    // Create USDC mint
    usdcMint = await createMint(
      provider.connection,
      sponsor,
      sponsor.publicKey,
      null,
      6
    );
    console.log(`USDC Mint: ${usdcMint}`);
    
    // Create token accounts
    sponsorTokenAccount = await createAssociatedTokenAccount(
      provider.connection,
      sponsor,
      usdcMint,
      sponsor.publicKey
    );
    
    userTokenAccount = await createAssociatedTokenAccount(
      provider.connection,
      user,
      usdcMint,
      user.publicKey
    );
    
    // Mint tokens to sponsor
    await mintTo(
      provider.connection,
      sponsor,
      usdcMint,
      sponsorTokenAccount,
      sponsor.publicKey,
      2000000 // 2 USDC
    );
    
    // Derive PDAs
    [escrowPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("escrow"), user.publicKey.toBuffer(), seed.toArrayLike(Buffer, "le", 8)],
      program.programId
    );
    
    [campaignConfig] = PublicKey.findProgramAddressSync(
      [Buffer.from("CampaignConfig"), seed.toArrayLike(Buffer, "le", 8)],
      program.programId
    );
    
    [contributor] = PublicKey.findProgramAddressSync(
      [Buffer.from("Contributor"), user.publicKey.toBuffer()],
      program.programId
    );
    
    vault = await getAssociatedTokenAddress(
      usdcMint,
      escrowPDA,
      true
    );
    
    console.log("\n=== PDAs ===");
    console.log(`Escrow: ${escrowPDA}`);
    console.log(`Campaign: ${campaignConfig}`);
    console.log(`Contributor: ${contributor}`);
    console.log(`Vault: ${vault}`);
  });

  it("Initialize campaign", async () => {
    const tx = await program.methods
      .initialize(
        seed,
        campaignId,
        totalPoolAmount,
        new BN(Math.floor(Date.now() / 1000)),
        new BN(Math.floor(Date.now() / 1000) + 86400),
        new BN(0),
        0,
        new BN(Math.floor(Date.now() / 1000))
      )
      .accounts({
        escrow: escrowPDA,
        sponsor: sponsor.publicKey,
        user: user.publicKey,
        usdcTokenMint: usdcMint,
        campaignConfig,
        contributor,
        vault,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      })
      .signers([sponsor, user])
      .rpc();

    console.log(`✅ Initialized: ${tx}`);
    
    // Verify escrow was created
    const escrowAccount = await program.account.escrow.fetch(escrowPDA);
    expect(escrowAccount.seed.toString()).to.equal(seed.toString());
    expect(escrowAccount.owner.toString()).to.equal(user.publicKey.toString());
  });

  it("Deposit funds", async () => {
    // Load existing accounts to get their data
    const escrowAccount = await program.account.escrow.fetch(escrowPDA);
    const campaignAccount = await program.account.campaignConfig.fetch(campaignConfig);
    
    const tx = await program.methods
      .deposit(depositAmount)
      .accounts({
        sponsor: sponsor.publicKey,
        user: user.publicKey,
        usdcTokenMint: usdcMint,
        escrow: escrowPDA,
        campaignConfig,
        contributor,
        vault,
        sponsorTokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .signers([sponsor, user])
      .rpc();

    console.log(`✅ Deposited: ${tx}`);
  });

  it("Assign score", async () => {
    // Load accounts first
    const escrowAccount = await program.account.escrow.fetch(escrowPDA);
    const campaignAccount = await program.account.campaignConfig.fetch(campaignConfig);
    
    const tx = await program.methods
      .assignScore(seed, contributionScore)
      .accounts({
        sponsor: sponsor.publicKey,
        user: user.publicKey,
        usdcTokenMint: usdcMint,
        escrow: escrowPDA,
        campaignConfig,
        contributor,
        vault,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      })
      .signers([sponsor, user])
      .rpc();

    console.log(`✅ Score assigned: ${tx}`);
    
    // Verify contributor state
    const contributorAccount = await program.account.contributorState.fetch(contributor);
    expect(contributorAccount.contributionScore.toString()).to.equal(contributionScore.toString());
  });

  it("Execute scoring engine", async () => {
    // Load accounts
    const escrowAccount = await program.account.escrow.fetch(escrowPDA);
    const campaignAccount = await program.account.campaignConfig.fetch(campaignConfig);
    
    const tx = await program.methods
      .scoringEngine(contributionScore)
      .accounts({
        sponsor: sponsor.publicKey,
        user: user.publicKey,
        usdcTokenMint: usdcMint,
        escrow: escrowPDA,
        campaignConfig,
        contributor,
        vault,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      })
      .signers([sponsor, user])
      .rpc();

    console.log(`✅ Scoring engine: ${tx}`);
  });

  it("Claim reward", async () => {
    // Load accounts
    const escrowAccount = await program.account.escrow.fetch(escrowPDA);
    const campaignAccount = await program.account.campaignConfig.fetch(campaignConfig);
    
    const tx = await program.methods
      .claimReward(rewardShare)
      .accounts({
        sponsor: sponsor.publicKey,
        user: user.publicKey,
        usdcTokenMint: usdcMint,
        escrow: escrowPDA,
        campaignConfig,
        contributor,
        vault,
        userTokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .signers([sponsor, user])
      .rpc();

    console.log(`✅ Reward claimed: ${tx}`);
    
    // Verify claim
    const contributorAccount = await program.account.contributorState.fetch(contributor);
    expect(contributorAccount.claimed).to.be.true;
  });
});
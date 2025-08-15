import * as anchor from "@coral-xyz/anchor";
import { type Program } from "@coral-xyz/anchor";
// const {BN} = anchor.BN;
import BN from "bn.js";
import type {Fairplay} from "/home/eaa/turbin3/capstone/fairplay/target/types/fairplay.ts";
import { PublicKey, Keypair, SystemProgram } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, createMint, createAssociatedTokenAccount, mintTo } from "@solana/spl-token";
import { expect } from "chai";

// Test configuration
const TEST_CONFIG = {
  seed: new BN(Math.floor(Math.random() * 1000000)),
  campaignId: 1,
  totalPoolAmount: new BN(1000000), // 1 USDC (6 decimals)
  startTime: new BN(Math.floor(Date.now() / 1000)),
  endTime: new BN(Math.floor(Date.now() / 1000) + 86400), // 24 hours from now
  totalScore: new BN(0),
  noOfContributors: 0,
  contributionScore: new BN(100),
  depositAmount: new BN(500000), // 0.5 USDC
  rewardShare: new BN(250000), // 0.25 USDC
};

// Global test variables
let sponsor: Keypair;
let user: Keypair;
let escrow: PublicKey;
let usdcMint: PublicKey;
let sponsorTokenAccount: PublicKey;
let userTokenAccount: PublicKey;

// Helper function to create and fund a signer
const createAndFundSigner = async (provider: anchor.AnchorProvider): Promise<Keypair> => {
  const keyPair = Keypair.generate();
  
  // Request airdrop
  await provider.connection.requestAirdrop(keyPair.publicKey, 5 * anchor.web3.LAMPORTS_PER_SOL);
  
  // Wait for confirmation
  await new Promise((resolve) => setTimeout(resolve, 2000));
  
  return keyPair;
};

describe("FairPlay Protocol Tests", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());
  
  const program = anchor.workspace.Fairplay as Program<Fairplay>;
  const provider = anchor.AnchorProvider.env();
  
  before(async () => {
    console.log("Setting up test environment...");
    
    // Create and fund signers
    sponsor = await createAndFundSigner(provider);
    user = await createAndFundSigner(provider);
    
    console.log(`Sponsor: ${sponsor.publicKey.toString()}`);
    console.log(`User: ${user.publicKey.toString()}`);
    
    // Create test USDC mint
    usdcMint = await createMint(
      provider.connection,
      sponsor,
      sponsor.publicKey,
      null,
      6 // USDC has 6 decimals
    );
    console.log(`USDC Mint: ${usdcMint.toString()}`);
    
    // Create and fund sponsor token account
    sponsorTokenAccount = await createAssociatedTokenAccount(
      provider.connection,
      sponsor,
      usdcMint,
      sponsor.publicKey
    );

    // create escrow
    escrow = await createAssociatedTokenAccount(
      provider.connection,
      sponsor,
      usdcMint,
      sponsor.publicKey
    );
    console.log(`Escrow: ${escrow.toString()}`);
    
    // Create user token account
    userTokenAccount = await createAssociatedTokenAccount(
      provider.connection,
      user,
      usdcMint,
      user.publicKey
    );
    
    // Mint tokens to sponsor account
    await mintTo(
      provider.connection,
      sponsor,
      usdcMint,
      sponsorTokenAccount,
      sponsor.publicKey,
      2000000 // 2 USDC
    );
    
    console.log("Test environment setup complete!");
  });

  it("should initialize the campaign", async () => {
    console.log("\n=== Testing Campaign Initialization ===");
    
    // Derive PDAs
    const [escrowPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("escrow"), user.publicKey.toBuffer(), TEST_CONFIG.seed.toArrayLike(Buffer, "le", 8)],
      program.programId
    );
    
    const [campaignConfig] = PublicKey.findProgramAddressSync(
      [Buffer.from("CampaignConfig"), TEST_CONFIG.seed.toArrayLike(Buffer, "le", 8)],
      program.programId
    );
    
    const [contributor] = PublicKey.findProgramAddressSync(
      [Buffer.from("Contributor"), user.publicKey.toBuffer()],
      program.programId
    );
    
    const [vault] = PublicKey.findProgramAddressSync(
      [escrow.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), usdcMint.toBuffer()],
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    const tx = await program.methods
      .initialize(
        TEST_CONFIG.seed,
        TEST_CONFIG.campaignId,
        TEST_CONFIG.totalPoolAmount,
        TEST_CONFIG.startTime,
        TEST_CONFIG.endTime,
        TEST_CONFIG.totalScore,
        TEST_CONFIG.noOfContributors,
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

    console.log(`✅ Campaign initialized! Signature: ${tx}`);
    expect(tx).to.exist;
  });

  it("should deposit funds", async () => {
    console.log("\n=== Testing Fund Deposit ===");
    
    // Derive PDAs
    const [escrow] = PublicKey.findProgramAddressSync(
      [Buffer.from("escrow"), user.publicKey.toBuffer(), TEST_CONFIG.seed.toArrayLike(Buffer, "le", 8)],
      program.programId
    );
    
    const [vault] = PublicKey.findProgramAddressSync(
      [escrow.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), usdcMint.toBuffer()],
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    const tx = await program.methods
      .deposit(TEST_CONFIG.depositAmount)
      .accounts({
        sponsor: sponsor.publicKey,
        usdcTokenMint: usdcMint,
        escrow,
        vault,
        sponsorTokenAccount,
      })
      .signers([sponsor])
      .rpc();

    console.log(`✅ Funds deposited! Signature: ${tx}`);
    expect(tx).to.exist;
  });

  it("should assign a score", async () => {
    console.log("\n=== Testing Score Assignment ===");
    
    // Derive PDAs
    const [campaignConfig] = PublicKey.findProgramAddressSync(
      [Buffer.from("CampaignConfig"), TEST_CONFIG.seed.toArrayLike(Buffer, "le", 8)],
      program.programId
    );
    
    const [contributor] = PublicKey.findProgramAddressSync(
      [Buffer.from("Contributor"), user.publicKey.toBuffer()],
      program.programId
    );

    const tx = await program.methods
      .assignScore(TEST_CONFIG.seed, TEST_CONFIG.contributionScore)
      .accounts({
        sponsor: sponsor.publicKey,
        user: user.publicKey,
        usdcTokenMint: usdcMint,
        campaignConfig,
        contributor,
      })
      .signers([sponsor, user])
      .rpc();

    console.log(`✅ Score assigned! Signature: ${tx}`);
    expect(tx).to.exist;
  });

  it("should execute the scoring engine", async () => {
    console.log("\n=== Testing Scoring Engine ===");
    
    // Derive PDAs
    const [campaignConfig] = PublicKey.findProgramAddressSync(
      [Buffer.from("CampaignConfig"), TEST_CONFIG.seed.toArrayLike(Buffer, "le", 8)],
      program.programId
    );
    
    const [contributor] = PublicKey.findProgramAddressSync(
      [Buffer.from("Contributor"), user.publicKey.toBuffer()],
      program.programId
    );

    const tx = await program.methods
      .scoringEngine(TEST_CONFIG.contributionScore)
      .accounts({
        sponsor: sponsor.publicKey,
        user: user.publicKey,
        usdcTokenMint: usdcMint,
        campaignConfig,
        contributor,
      })
      .signers([sponsor, user])
      .rpc();

    console.log(`✅ Scoring engine executed! Signature: ${tx}`);
    expect(tx).to.exist;
  });

  it("should claim a reward", async () => {
    console.log("\n=== Testing Reward Claim ===");
    
    // Derive PDAs
    const [escrow] = PublicKey.findProgramAddressSync(
      [Buffer.from("escrow"), user.publicKey.toBuffer(), TEST_CONFIG.seed.toArrayLike(Buffer, "le", 8)],
      program.programId
    );
    
    const [campaignConfig] = PublicKey.findProgramAddressSync(
      [Buffer.from("CampaignConfig"), TEST_CONFIG.seed.toArrayLike(Buffer, "le", 8)],
      program.programId
    );
    
    const [contributor] = PublicKey.findProgramAddressSync(
      [Buffer.from("Contributor"), user.publicKey.toBuffer()],
      program.programId
    );
    
    const [vault] = PublicKey.findProgramAddressSync(
      [escrow.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), usdcMint.toBuffer()],
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    const tx = await program.methods
      .claimReward(TEST_CONFIG.rewardShare)
      .accounts({
        user: user.publicKey,
        usdcTokenMint: usdcMint,
        escrow,
        campaignConfig,
        contributor,
        vault,
        userTokenAccount,
      })
      .signers([user])
      .rpc();

    console.log(`✅ Reward claimed! Signature: ${tx}`);
    expect(tx).to.exist;
  });

});
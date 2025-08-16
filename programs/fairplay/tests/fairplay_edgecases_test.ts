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
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import { expect } from "chai";

describe("FairPlay Protocol - Edge Case Tests", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.Fairplay as Program<Fairplay>;

  // Common variables
  let sponsor: Keypair;
  let attacker: Keypair;
  let user: Keypair;
  let usdcMint: PublicKey;
  let sponsorTokenAccount: PublicKey;
  let attackerTokenAccount: PublicKey;
  let userTokenAccount: PublicKey;

  // helper to airdrop
  const fundWallet = async (wallet: Keypair) => {
    const sig = await provider.connection.requestAirdrop(
      wallet.publicKey,
      5 * anchor.web3.LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(sig);
    await new Promise((res) => setTimeout(res, 500));
  };

  // Helper to assert that a promise reverts/fails
  const assertRevert = async (p: Promise<any>, expectedMsg?: string) => {
    try {
      await p;
      throw new Error("Expected transaction to fail but it succeeded");
    } catch (err: any) {
      if (expectedMsg) {
        const asString = err?.toString?.() ?? JSON.stringify(err);
        if (!asString.includes(expectedMsg)) {
          // Re-throw so test fails if message doesn't match
          throw new Error(
            `Transaction failed, but not with expected message. Got: ${asString}`
          );
        }
      }
      // otherwise success (it failed as expected)
    }
  };

  before(async () => {
    sponsor = Keypair.generate();
    attacker = Keypair.generate();
    user = Keypair.generate();

    await fundWallet(sponsor);
    await fundWallet(attacker);
    await fundWallet(user);

    // create USDC mint and token accounts
    usdcMint = await createMint(
      provider.connection,
      sponsor,
      sponsor.publicKey,
      null,
      6
    );

    sponsorTokenAccount = await createAssociatedTokenAccount(
      provider.connection,
      sponsor,
      usdcMint,
      sponsor.publicKey
    );

    attackerTokenAccount = await createAssociatedTokenAccount(
      provider.connection,
      attacker,
      usdcMint,
      attacker.publicKey
    );

    userTokenAccount = await createAssociatedTokenAccount(
      provider.connection,
      user,
      usdcMint,
      user.publicKey
    );

    // mint some USDC to sponsor (1 USDC = 1e6)
    await mintTo(
      provider.connection,
      sponsor,
      usdcMint,
      sponsorTokenAccount,
      sponsor.publicKey,
      5_000_000 // 5 USDC
    );
  });

  // helper to derive PDAs using same seeds as your program
  const deriveCampaignPDAs = (seedBn: BN, subjectPubkey: PublicKey) => {
    const seedBuf = seedBn.toArrayLike(Buffer, "le", 8);
    const [escrowPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("escrow"), subjectPubkey.toBuffer(), seedBuf],
      program.programId
    );

    const [campaignConfig] = PublicKey.findProgramAddressSync(
      [Buffer.from("CampaignConfig"), seedBuf],
      program.programId
    );

    const [contributor] = PublicKey.findProgramAddressSync(
      [Buffer.from("Contributor"), subjectPubkey.toBuffer()],
      program.programId
    );

    return { escrowPDA, campaignConfig, contributor };
  };

  // Simple helper to initialize a campaign
  const createCampaign = async (seedBn: BN, sponsorKeypair: Keypair, owner: Keypair, poolAmountBn: BN, startOffsetSec = 0, durationSec = 86400) => {
    const nowSec = Math.floor(Date.now() / 1000);
    const startTime = new BN(nowSec + startOffsetSec);
    const endTime = new BN(nowSec + startOffsetSec + durationSec);

    const { escrowPDA, campaignConfig, contributor } = deriveCampaignPDAs(seedBn, owner.publicKey);

    const tx = await program.methods
      .initialize(
        seedBn,
        1, // campaign_id
        poolAmountBn, 
        startTime,
        endTime,
        new BN(0),
        0,
        new BN(nowSec)
      )
      .accounts({
        escrow: escrowPDA,
        sponsor: sponsorKeypair.publicKey,
        user: owner.publicKey,
        usdcTokenMint: usdcMint,
        campaignConfig,
        contributor,
        vault: await getAssociatedTokenAddress(usdcMint, escrowPDA, true),
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      })
      .signers([sponsorKeypair, owner])
      .rpc();

    return { tx, escrowPDA, campaignConfig, contributor, startTime, endTime };
  };

  // it("1) Initialize with past deadline should fail", async () => {
  //   const seedBn = new BN(Math.floor(Math.random() * 1e6));
  //   const testUser = Keypair.generate();
  //   await fundWallet(testUser);
  //   const nowSec = Math.floor(Date.now() / 1000);

  //   const startTime = new BN(nowSec - 2000);
  //   const endTime = new BN(nowSec - 1000); // already in the past
    
  //   console.log(`Current time: ${nowSec}, End time: ${endTime.toNumber()}`);

  //   const seedBuf = seedBn.toArrayLike(Buffer, "le", 8);
  //   const [escrowPDA] = PublicKey.findProgramAddressSync(
  //     [Buffer.from("escrow"), testUser.publicKey.toBuffer(), seedBuf],
  //     program.programId
  //   );

  //   const [campaignConfig] = PublicKey.findProgramAddressSync(
  //     [Buffer.from("CampaignConfig"), seedBuf],
  //     program.programId
  //   );

  //   const [contributorPDA] = PublicKey.findProgramAddressSync(
  //     [Buffer.from("Contributor"), testUser.publicKey.toBuffer()],
  //     program.programId
  //   );

  //   await assertRevert(
  //     program.methods
  //       .initialize(
  //         seedBn,
  //         2,
  //         new BN(1_000_000),
  //         startTime,
  //         endTime,
  //         new BN(0),
  //         0,
  //         new BN(nowSec)
  //       )
  //       .accounts({
  //         escrow: escrowPDA,
  //         sponsor: sponsor.publicKey,
  //         user: testUser.publicKey,
  //         usdcTokenMint: usdcMint,
  //         campaignConfig,
  //         contributor: contributorPDA,
  //         vault: await getAssociatedTokenAddress(usdcMint, escrowPDA, true),
  //         systemProgram: SystemProgram.programId,
  //         tokenProgram: TOKEN_PROGRAM_ID,
  //         associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
  //       })
  //       .signers([sponsor, testUser])
  //       .rpc(),
  //     "InvalidEndTime" // optional expected message substring
  //   );
  // });

  it("2) Deposit before initialize should fail", async () => {
    const seedBn = new BN(Math.floor(Math.random() * 1e6));
    const testUser = Keypair.generate();
    await fundWallet(testUser);
    const { escrowPDA, campaignConfig, contributor } = deriveCampaignPDAs(seedBn, testUser.publicKey);

    await assertRevert(
      program.methods
        .deposit(new BN(1000))
        .accounts({
          sponsor: sponsor.publicKey,
          user: testUser.publicKey,
          usdcTokenMint: usdcMint,
          escrow: escrowPDA,
          campaignConfig,
          contributor,
          vault: await getAssociatedTokenAddress(usdcMint, escrowPDA, true),
          sponsorTokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([sponsor, testUser])
        .rpc()
    );
  });

  it("3) Deposit more than sponsor balance should fail", async () => {
    const seedBn = new BN(Math.floor(Math.random() * 1e6));
    const testUser = Keypair.generate();
    await fundWallet(testUser);
    const poolAmount = new BN(0); // initialize with zero pool
    const { escrowPDA, campaignConfig, contributor } = await (async () => {
      const res = await createCampaign(seedBn, sponsor, testUser, poolAmount, 0, 86400);
      return { escrowPDA: res.escrowPDA, campaignConfig: res.campaignConfig, contributor: res.contributor };
    })();

    const largeDeposit = new BN(99_999_999_999);

    await assertRevert(
      program.methods
        .deposit(largeDeposit)
        .accounts({
          sponsor: sponsor.publicKey,
          user: testUser.publicKey,
          usdcTokenMint: usdcMint,
          escrow: escrowPDA,
          campaignConfig,
          contributor,
          vault: await getAssociatedTokenAddress(usdcMint, escrowPDA, true),
          sponsorTokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([sponsor, testUser])
        .rpc()
    );
  });

  it("4) Assign score by non-creator should fail", async () => {
    const seedBn = new BN(Math.floor(Math.random() * 1e6));
    const testUser = Keypair.generate();
    await fundWallet(testUser);
    const poolAmount = new BN(1_000_000);
    const { escrowPDA, campaignConfig, contributor, endTime } = await createCampaign(seedBn, sponsor, testUser, poolAmount);

    await assertRevert(
      program.methods
        .assignScore(seedBn, new BN(50))
        .accounts({
          sponsor: attacker.publicKey, // attacker pretending to be sponsor
          user: testUser.publicKey,
          usdcTokenMint: usdcMint,
          escrow: escrowPDA,
          campaignConfig,
          contributor,
          vault: await getAssociatedTokenAddress(usdcMint, escrowPDA, true),
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        })
        .signers([attacker, testUser])
        .rpc()
    );
  });

  // it("5) Assign score after campaign deadline should fail", async () => {
  //   const seedBn = new BN(Math.floor(Math.random() * 1e6));
  //   const testUser = Keypair.generate();
  //   await fundWallet(testUser);
  //   const poolAmount = new BN(1_000_000);
  //   
  //   // Create a campaign with past deadline
  //   const nowSec = Math.floor(Date.now() / 1000);
  //   const startTime = new BN(nowSec - 2000);
  //   const endTime = new BN(nowSec - 1000); // Already expired
  //   
  //   const { escrowPDA, campaignConfig, contributor } = deriveCampaignPDAs(seedBn, testUser.publicKey);
  //   
  //   // First initialize the campaign with past deadline (this should work for setup)
  //   await program.methods
  //     .initialize(
  //       seedBn,
  //       99,
  //       poolAmount,
  //       startTime,
  //       endTime,
  //       new BN(0),
  //       0,
  //       new BN(nowSec - 2000)
  //     )
  //     .accounts({
  //       escrow: escrowPDA,
  //       sponsor: sponsor.publicKey,
  //       user: testUser.publicKey,
  //       usdcTokenMint: usdcMint,
  //       campaignConfig,
  //       contributor,
  //       vault: await getAssociatedTokenAddress(usdcMint, escrowPDA, true),
  //       systemProgram: SystemProgram.programId,
  //       tokenProgram: TOKEN_PROGRAM_ID,
  //       associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
  //     })
  //     .signers([sponsor, testUser])
  //     .rpc();
  //
  //   // Now try to assign score after deadline - this should fail
  //   await assertRevert(
  //     program.methods
  //       .assignScore(seedBn, new BN(50))
  //       .accounts({
  //         sponsor: sponsor.publicKey,
  //         user: testUser.publicKey,
  //         usdcTokenMint: usdcMint,
  //         escrow: escrowPDA,
  //         campaignConfig,
  //         contributor,
  //         vault: await getAssociatedTokenAddress(usdcMint, escrowPDA, true),
  //         systemProgram: SystemProgram.programId,
  //         tokenProgram: TOKEN_PROGRAM_ID,
  //         associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
  //       })
  //       .signers([sponsor, testUser])
  //       .rpc(),
  //     "CampaignExpired"
  //   );
  // });

  it("6) Scoring engine with zero total score should fail", async () => {
    const seedBn = new BN(Math.floor(Math.random() * 1e6));
    const testUser = Keypair.generate();
    await fundWallet(testUser);
    const poolAmount = new BN(1_000_000);
    const { escrowPDA, campaignConfig, contributor } = await createCampaign(seedBn, sponsor, testUser, poolAmount);

    // Assign zero score explicitly via assignScore
    await program.methods
      .assignScore(seedBn, new BN(0))
      .accounts({
        sponsor: sponsor.publicKey,
        user: testUser.publicKey,
        usdcTokenMint: usdcMint,
        escrow: escrowPDA,
        campaignConfig,
        contributor,
        vault: await getAssociatedTokenAddress(usdcMint, escrowPDA, true),
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      })
      .signers([sponsor, testUser])
      .rpc();

    await assertRevert(
      program.methods
        .scoringEngine(new BN(0))
        .accounts({
          sponsor: sponsor.publicKey,
          user: testUser.publicKey,
          usdcTokenMint: usdcMint,
          escrow: escrowPDA,
          campaignConfig,
          contributor,
          vault: await getAssociatedTokenAddress(usdcMint, escrowPDA, true),
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        })
        .signers([sponsor, testUser])
        .rpc()
    );
  });

  // it("7) Claim reward twice should fail on second attempt", async () => {
  //   const seedBn = new BN(Math.floor(Math.random() * 1e6));
  //   const testUser = Keypair.generate();
  //   await fundWallet(testUser);
  //   const poolAmount = new BN(1_000_000);
  //   const { escrowPDA, campaignConfig, contributor } = await createCampaign(seedBn, sponsor, testUser, poolAmount);
  //   
  //   // Create token account for testUser
  //   const testUserTokenAccount = await createAssociatedTokenAccount(
  //     provider.connection,
  //     testUser,
  //     usdcMint,
  //     testUser.publicKey
  //   );
  //
  //   await program.methods
  //     .assignScore(seedBn, new BN(100))
  //     .accounts({
  //       sponsor: sponsor.publicKey,
  //       user: testUser.publicKey,
  //       usdcTokenMint: usdcMint,
  //       escrow: escrowPDA,
  //       campaignConfig,
  //       contributor,
  //       vault: await getAssociatedTokenAddress(usdcMint, escrowPDA, true),
  //       systemProgram: SystemProgram.programId,
  //       tokenProgram: TOKEN_PROGRAM_ID,
  //       associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
  //     })
  //     .signers([sponsor, testUser])
  //     .rpc();
  //
  //   await program.methods
  //     .scoringEngine(new BN(100))
  //     .accounts({
  //       sponsor: sponsor.publicKey,
  //       user: testUser.publicKey,
  //       usdcTokenMint: usdcMint,
  //       escrow: escrowPDA,
  //       campaignConfig,
  //       contributor,
  //       vault: await getAssociatedTokenAddress(usdcMint, escrowPDA, true),
  //       systemProgram: SystemProgram.programId,
  //       tokenProgram: TOKEN_PROGRAM_ID,
  //       associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
  //     })
  //     .signers([sponsor, testUser])
  //     .rpc();
  //
  //   await program.methods
  //     .claimReward(new BN(1))
  //     .accounts({
  //       sponsor: sponsor.publicKey,
  //       user: testUser.publicKey,
  //       usdcTokenMint: usdcMint,
  //       escrow: escrowPDA,
  //       campaignConfig,
  //       contributor,
  //       vault: await getAssociatedTokenAddress(usdcMint, escrowPDA, true),
  //       userTokenAccount: testUserTokenAccount,
  //       tokenProgram: TOKEN_PROGRAM_ID,
  //       associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
  //       systemProgram: SystemProgram.programId,
  //     })
  //     .signers([sponsor, testUser])
  //     .rpc();
  //
  //   await assertRevert(
  //     program.methods
  //       .claimReward(new BN(1))
  //       .accounts({
  //         sponsor: sponsor.publicKey,
  //         user: testUser.publicKey,
  //         usdcTokenMint: usdcMint,
  //         escrow: escrowPDA,
  //         campaignConfig,
  //         contributor,
  //         vault: await getAssociatedTokenAddress(usdcMint, escrowPDA, true),
  //         userTokenAccount: testUserTokenAccount,
  //         tokenProgram: TOKEN_PROGRAM_ID,
  //         associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
  //         systemProgram: SystemProgram.programId,
  //       })
  //       .signers([sponsor, testUser])
  //       .rpc()
  //   );
  // });

  it("8) Claim reward before scoring engine runs should fail", async () => {
    const seedBn = new BN(Math.floor(Math.random() * 1e6));
    const testUser = Keypair.generate();
    await fundWallet(testUser);
    const poolAmount = new BN(1_000_000);
    const { escrowPDA, campaignConfig, contributor } = await createCampaign(seedBn, sponsor, testUser, poolAmount);

    await assertRevert(
      program.methods
        .claimReward(new BN(1))
        .accounts({
          sponsor: sponsor.publicKey,
          user: testUser.publicKey,
          usdcTokenMint: usdcMint,
          escrow: escrowPDA,
          campaignConfig,
          contributor,
          vault: await getAssociatedTokenAddress(usdcMint, escrowPDA, true),
          userTokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([sponsor, testUser])
        .rpc()
    );
  });

  it("9) Finalize with zero pool amount should fail", async () => {
    const seedBn = new BN(Math.floor(Math.random() * 1e6));
    const testUser = Keypair.generate();
    await fundWallet(testUser);
    const poolAmount = new BN(0); // no funds
    const { escrowPDA, campaignConfig, contributor } = await createCampaign(seedBn, sponsor, testUser, poolAmount);

    await program.methods
      .assignScore(seedBn, new BN(100))
      .accounts({
        sponsor: sponsor.publicKey,
        user: testUser.publicKey,
        usdcTokenMint: usdcMint,
        escrow: escrowPDA,
        campaignConfig,
        contributor,
        vault: await getAssociatedTokenAddress(usdcMint, escrowPDA, true),
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      })
      .signers([sponsor, testUser])
      .rpc();

    await assertRevert(
      program.methods
        .scoringEngine(new BN(100))
        .accounts({
          sponsor: sponsor.publicKey,
          user: testUser.publicKey,
          usdcTokenMint: usdcMint,
          escrow: escrowPDA,
          campaignConfig,
          contributor,
          vault: await getAssociatedTokenAddress(usdcMint, escrowPDA, true),
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        })
        .signers([sponsor, testUser])
        .rpc()
    );
  });

  it("10) Invalid PDA derivation should fail", async () => {
    const seedBn = new BN(Math.floor(Math.random() * 1e6));
    const testUser = Keypair.generate();
    await fundWallet(testUser);
    const seedBuf = seedBn.toArrayLike(Buffer, "le", 8);
    const [wrongEscrow] = PublicKey.findProgramAddressSync(
      [Buffer.from("escrow"), attacker.publicKey.toBuffer(), seedBuf],
      program.programId
    );

    const [campaignConfig] = PublicKey.findProgramAddressSync(
      [Buffer.from("CampaignConfig"), seedBuf],
      program.programId
    );

    const [contributorPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("Contributor"), testUser.publicKey.toBuffer()],
      program.programId
    );

    await assertRevert(
      program.methods
        .deposit(new BN(1000))
        .accounts({
          sponsor: sponsor.publicKey,
          user: testUser.publicKey,
          usdcTokenMint: usdcMint,
          escrow: wrongEscrow,
          campaignConfig,
          contributor: contributorPDA,
          vault: await getAssociatedTokenAddress(usdcMint, wrongEscrow, true),
          sponsorTokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .signers([sponsor, testUser])
        .rpc()
    );
  });
});

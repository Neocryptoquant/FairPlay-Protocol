// #![allow(unexpected_cfgs)]
// use anchor_lang::prelude::*;
// use anchor_spl::{
//     associated_token::AssociatedToken,
//     token::{Mint, TokenAccount, Token}
// };

// use crate::{CampaignConfig, ContributorState, Escrow};

// #[derive(Accounts)]
// #[instruction(seed: u64)]
// pub struct InitializeContrib <'info> {
//     pub system_program: Program<'info, System>,
//     pub token_program: Program<'info, Token>,
//     pub associated_token_program: Program<'info, AssociatedToken>,

//     #[account(mut)]
//     pub sponsor: Signer<'info>,
    
//     #[account(mut)]
//     pub user: Signer<'info>,
//     pub usdc_token_mint: Account<'info, Mint>,
    
//     #[account(
//         init,
//         payer = user,
//         space = 8 + ContributorState::INIT_SPACE,
//         seeds = [b"Contributor", user.key().as_ref()],
//         bump
//     )]
//     pub contributor: Account<'info, ContributorState>,

//     #[account(
//         init,
//         payer = sponsor,
//         associated_token::mint = usdc_token_mint,
//         associated_token::authority = escrow,
//     )]
//     pub vault: Account<'info, TokenAccount>,
    
// }

// impl <'info> InitializeContrib <'info> {
   
//     pub fn initialize_contributor_state (
//         &mut self,
//         seed: u64,
//         // git_id: Vec<u64>,
//         created_at: i64,
//         bumps: &InitializeContribBumps
//     ) -> Result<()> {
//         self.contributor.set_inner(ContributorState {
//             seed,
//             campaign_id: self.campaign_config.campaign_id,
//             user: self.user.key(),
//             // git_id,
//             contribution_score: 0,
//             reward_share: 0,
//             claimed: false,
//             //contributions: 0,
//             created_at,
//             // last_updated: 0,
//             bump: bumps.contributor
//         });

//         Ok(())
//     }
// }
// // pub fn handler(ctx: Context<Initialize>) -> Result<()> {
// //     msg!("Greetings from: {:?}", ctx.program_id);
// //     Ok(())
// // }

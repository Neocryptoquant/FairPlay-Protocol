// #![allow(unexpected_cfgs)]
// use anchor_lang::prelude::*;
// use anchor_spl::{
//     associated_token::AssociatedToken,
//     token::{Mint, TokenAccount, Token}
// };

// use crate::{CampaignConfig, ContributorState, Escrow};

// #[derive(Accounts)]
// #[instruction(seed: u64)]
// pub struct InitializeEscrow <'info> {
//     pub system_program: Program<'info, System>,
//     pub token_program: Program<'info, Token>,
//     pub associated_token_program: Program<'info, AssociatedToken>,

//     #[account(mut)]
//     pub sponsor: Signer<'info>,
    
//     #[account(mut)]
//     pub user: Signer<'info>,
//     // pub usdc_token_mint: Account<'info, Mint>,

//     #[account(
//         init,
//         payer = sponsor,
//         space = 8 + Escrow::INIT_SPACE,
//         seeds = [b"escrow", user.key().as_ref(), seed.to_le_bytes().as_ref()],
//         bump
//     )]
//     pub escrow: Account<'info, Escrow>,
// }

// impl <'info> InitializeEscrow <'info> {
    
//     pub fn initialize_escrow (
//         &mut self,
//         seed: u64,
//         campaign_id: u8,
//         bumps: &InitializeEscrowBumps
//     ) -> Result<()> {
//         self.escrow.set_inner( Escrow {
//             seed,
//             owner: self.sponsor.key(),
//             campaign_id,
//             bump: bumps.escrow
//         });
//         Ok(())

//     }
// }
// // pub fn handler(ctx: Context<Initialize>) -> Result<()> {
// //     msg!("Greetings from: {:?}", ctx.program_id);
// //     Ok(())
// // }

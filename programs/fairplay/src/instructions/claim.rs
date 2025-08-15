use anchor_lang::prelude::*;
use anchor_spl::{
    token::{Mint, TokenAccount, Token, Transfer, transfer},
    associated_token::AssociatedToken,
};
use crate::{CampaignConfig, ContributorState, Escrow};

#[derive(Accounts)]
pub struct Claim <'info> {
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,

    #[account(mut)]
    pub sponsor: Signer<'info>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    pub usdc_token_mint: Account<'info, Mint>,

    #[account(
        seeds = [b"escrow",  user.key().as_ref(), escrow.seed.to_le_bytes().as_ref()],
        bump = escrow.bump
    )]
    pub escrow: Account<'info, Escrow>,

    #[account(
        seeds = [b"CampaignConfig", campaign_config.seed.to_le_bytes().as_ref()],
        bump = campaign_config.bump
    )]
    pub campaign_config: Account<'info, CampaignConfig>,

    
    #[account(
        mut,
        seeds = [b"Contributor", user.key().as_ref()],
        bump = contributor.bump
    )]
    pub contributor: Account<'info, ContributorState>,

    #[account(
        mut,
        associated_token::mint = usdc_token_mint,
        associated_token::authority = escrow,
    )]
    pub vault: Account<'info, TokenAccount>,
    
    #[account(
        mut,
        associated_token::mint = usdc_token_mint,
        associated_token::authority = user,
    )]
    pub user_token_account: Account<'info, TokenAccount>,
}

impl <'info> Claim <'info> {
    pub fn claim_reward (
        &mut self,
        reward_share: u64
    ) -> Result<()> {
        // Check if already claimed
        require!(!self.contributor.claimed, crate::error::FairplayError::AlreadyClaimed);
        let cpi_program = self.token_program.to_account_info();
        let cpi_account = Transfer {
            from: self.vault.to_account_info(),
            to: self.user_token_account.to_account_info(),
            authority: self.escrow.to_account_info()
        };

        let seeds = &[
            &b"escrow"[..],
            &self.user.key().to_bytes(),
            &self.escrow.seed.to_le_bytes(),
            &[self.escrow.bump],
        ];
        let signer_seeds = &[&seeds[..]];

        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_account, signer_seeds);
        transfer(cpi_ctx, reward_share)?;

        // Mark contributor as claimed
        self.contributor.claimed = true;

        Ok(())
    }
}
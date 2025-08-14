use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Escrow {
    pub seed: u64,
    pub owner: Pubkey,
    pub campaign_id: u8,
    pub bump: u8
}
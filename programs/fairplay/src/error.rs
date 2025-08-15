use anchor_lang::error_code;

#[error_code]
pub enum FairplayError {
    #[msg("Check the code for the correct scores")]
    IncorrectScores,
    #[msg("there is no summation. Check the code!")]
    NoTotalScore,
    #[msg("Campaign end time must be in the future")]
    InvalidEndTime,
    #[msg("Contributor has already claimed rewards")]
    AlreadyClaimed,
    #[msg("Cannot assign score after campaign deadline")]
    CampaignExpired,
    #[msg("Insufficient funds for deposit")]
    InsufficientFunds,
}
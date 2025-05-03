namespace Survey.API.Models
{
    public class Vote
    {
        public int Id { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }

        public int SurveyOptionId { get; set; }
        public SurveyOption SurveyOption { get; set; }

        public DateTime VotedAt { get; set; } = DateTime.UtcNow;
    }
}

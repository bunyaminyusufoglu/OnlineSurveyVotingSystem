using System;

namespace Survey.API.Models
{
    public class VoteHistoryDto
    {
        public int VoteId { get; set; }
        public DateTime VotedAt { get; set; }
        public string SurveyTitle { get; set; }
        public string SurveyDescription { get; set; }
        public string OptionText { get; set; }
        public string CreatedByUsername { get; set; }
    }
} 
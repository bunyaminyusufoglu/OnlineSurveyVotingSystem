using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Survey.API.Models.Entities
{
    public class Vote
    {
        public int Id { get; set; }
        public int SurveyId { get; set; }
        public int OptionId { get; set; }
        public int UserId { get; set; }
        public DateTime VotedAt { get; set; }

        [JsonIgnore]
        public virtual SurveyEntity Survey { get; set; }
        
        [JsonIgnore]
        public virtual SurveyOption Option { get; set; }
        
        [JsonIgnore]
        public virtual User User { get; set; }
    }
}

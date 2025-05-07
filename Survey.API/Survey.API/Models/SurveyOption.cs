using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Survey.API.Models.Entities
{
    public class SurveyOption
    {
        public int Id { get; set; }

        [Required]
        [StringLength(200)]
        public string Text { get; set; }

        public int SurveyId { get; set; }
        
        [JsonIgnore]
        public virtual SurveyEntity Survey { get; set; }
        
        [JsonIgnore]
        public virtual ICollection<Vote> Votes { get; set; }
    }
}

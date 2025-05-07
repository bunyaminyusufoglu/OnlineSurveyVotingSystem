using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Survey.API.Models.Entities
{
    public class SurveyEntity
    {
        public int Id { get; set; }

        [Required]
        [StringLength(200)]
        public string Title { get; set; }

        [StringLength(1000)]
        public string Description { get; set; }

        public DateTime CreatedAt { get; set; }
        public int CreatedBy { get; set; }

        public virtual ICollection<SurveyOption> Options { get; set; }
        
        [JsonIgnore]
        public virtual ICollection<Vote> Votes { get; set; }
        
        [JsonIgnore]
        public virtual User CreatedByUser { get; set; }
    }
}

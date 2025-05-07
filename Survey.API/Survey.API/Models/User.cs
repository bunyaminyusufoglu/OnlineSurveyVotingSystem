using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Survey.API.Models.Entities
{
    public class User
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Username { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [JsonIgnore]
        public string PasswordHash { get; set; }

        [Required]
        public string Role { get; set; }

        [JsonIgnore]
        public virtual ICollection<SurveyEntity> Surveys { get; set; }
        
        [JsonIgnore]
        public virtual ICollection<Vote> Votes { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}

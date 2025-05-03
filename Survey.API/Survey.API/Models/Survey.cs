namespace Survey.API.Models
{
    public class Survey
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool IsActive { get; set; } = true;

        public ICollection<SurveyOption> Options { get; set; }
    }
}

namespace Survey.API.Models
{
    public class SurveyOption
    {
        public int Id { get; set; }
        public string OptionText { get; set; }

        public int SurveyId { get; set; }
        public Survey Survey { get; set; }

        public ICollection<Vote> Votes { get; set; }
    }
}

using System.ComponentModel.DataAnnotations;

namespace Survey.API.Models
{
    public class SurveyCreateDto
    {
        [Required(ErrorMessage = "Başlık zorunludur.")]
        [StringLength(200, ErrorMessage = "Başlık en fazla 200 karakter olabilir.")]
        public string Title { get; set; }

        [StringLength(1000, ErrorMessage = "Açıklama en fazla 1000 karakter olabilir.")]
        public string Description { get; set; }

        [Required(ErrorMessage = "En az bir seçenek eklemelisiniz.")]
        [MinLength(2, ErrorMessage = "En az 2 seçenek eklemelisiniz.")]
        public List<SurveyOptionCreateDto> Options { get; set; }
    }

    public class SurveyOptionCreateDto
    {
        [Required(ErrorMessage = "Seçenek metni zorunludur.")]
        [StringLength(200, ErrorMessage = "Seçenek metni en fazla 200 karakter olabilir.")]
        public string Text { get; set; }
    }
} 
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Survey.API.Data;
using Survey.API.Models;

namespace Survey.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Tüm işlemler JWT token ile korunur
    public class SurveysController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SurveysController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateSurvey(Survey.API.Models.Survey survey)
        {
            if (survey.Options == null || !survey.Options.Any())
            {
                return BadRequest("En az bir seçenek girilmelidir.");
            }

            _context.Surveys.Add(survey);
            await _context.SaveChangesAsync();

            return Ok(survey);
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var surveys = await _context.Surveys
                .Include(s => s.Options)
                .ToListAsync();

            return Ok(surveys);
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var survey = await _context.Surveys
                .Include(s => s.Options)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (survey == null)
                return NotFound();

            return Ok(survey);
        }

        // POST: api/surveys/vote
        [HttpPost("vote")]
        public async Task<IActionResult> Vote([FromBody] VoteRequest request)
        {
            var userIdClaim = User.FindFirst("id"); // JWT claim'inden user ID alınır
            if (userIdClaim == null)
                return Unauthorized();

            int userId = int.Parse(userIdClaim.Value);

            var option = await _context.SurveyOptions
                .Include(o => o.Survey)
                .FirstOrDefaultAsync(o => o.Id == request.OptionId);

            if (option == null)
                return NotFound("Seçenek bulunamadı.");

            // Aynı kullanıcı, bu ankete daha önce oy vermiş mi?
            bool hasVoted = await _context.Votes
                .AnyAsync(v => v.UserId == userId && v.SurveyOption.SurveyId == option.SurveyId);

            if (hasVoted)
                return BadRequest("Bu ankete daha önce oy verdiniz.");

            var vote = new Vote
            {
                UserId = userId,
                SurveyOptionId = option.Id
            };

            _context.Votes.Add(vote);
            await _context.SaveChangesAsync();

            return Ok("Oyunuz başarıyla kaydedildi.");
        }


    }
}

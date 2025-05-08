using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Survey.API.Data;
using Survey.API.Models;
using Survey.API.Models.Entities;
using Survey.API.Services;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace Survey.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SurveyController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ISurveyService _surveyService;

        public SurveyController(ApplicationDbContext context, ISurveyService surveyService)
        {
            _context = context;
            _surveyService = surveyService;
        }

        // GET: api/Survey
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SurveyEntity>>> GetSurveys()
        {
            var surveys = await _surveyService.GetAllSurveysAsync();
            return Ok(surveys);
        }

        // GET: api/Survey/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SurveyEntity>> GetSurvey(int id)
        {
            var survey = await _surveyService.GetSurveyByIdAsync(id);
            if (survey == null)
                return NotFound();

            return Ok(survey);
        }

        // POST: api/Survey
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<SurveyEntity>> CreateSurvey([FromBody] SurveyCreateDto surveyDto)
        {
            var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value);
            var survey = await _surveyService.CreateSurveyAsync(surveyDto, userId);
            return Ok(survey);
        }

        // PUT: api/Survey/5
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateSurvey(int id, SurveyEntity survey)
        {
            if (id != survey.Id)
            {
                return BadRequest();
            }

            var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value);
            if (survey.CreatedBy != userId)
            {
                return Forbid();
            }

            _context.Entry(survey).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SurveyExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Survey/5
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<ActionResult> DeleteSurvey(int id)
        {
            var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value);
            var success = await _surveyService.DeleteSurveyAsync(id, userId);

            if (!success)
                return NotFound();

            return Ok();
        }

        [HttpGet("user")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<SurveyEntity>>> GetUserSurveys()
        {
            var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value);
            var surveys = await _surveyService.GetUserSurveysAsync(userId);
            return Ok(surveys);
        }

        [HttpPost("{surveyId}/vote")]
        [Authorize]
        public async Task<ActionResult> Vote(int surveyId, [FromBody] VoteRequest voteRequest)
        {
            var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value);
            var success = await _surveyService.VoteAsync(surveyId, voteRequest.OptionId, userId);

            if (!success)
                return BadRequest("Bu ankete daha önce oy verdiniz.");

            return Ok();
        }

        [HttpGet("votes/user")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<VoteHistoryDto>>> GetUserVotes()
        {
            var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value);
            var votes = await _context.Votes
                .Include(v => v.Option)
                    .ThenInclude(o => o.Survey)
                        .ThenInclude(s => s.CreatedByUser)
                .Where(v => v.UserId == userId)
                .OrderByDescending(v => v.VotedAt)
                .ToListAsync();

            var userIds = votes.Select(v => v.Option.Survey.CreatedBy).Distinct().ToList();
            var users = _context.Users.Where(u => userIds.Contains(u.Id)).ToList();

            var voteDtos = votes.Select(v => new VoteHistoryDto
            {
                VoteId = v.Id,
                VotedAt = v.VotedAt,
                SurveyTitle = v.Option?.Survey?.Title ?? "",
                SurveyDescription = v.Option?.Survey?.Description ?? "",
                OptionText = v.Option?.Text ?? "",
                CreatedByUsername = users.FirstOrDefault(u => u.Id == v.Option.Survey.CreatedBy)?.Username ?? "Anonim"
            }).ToList();

            return Ok(voteDtos);
        }

        private bool SurveyExists(int id)
        {
            return _context.Surveys.Any(e => e.Id == id);
        }
    }
} 
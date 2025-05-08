using Microsoft.EntityFrameworkCore;
using Survey.API.Data;
using Survey.API.Models;
using Survey.API.Models.Entities;

namespace Survey.API.Services
{
    public class SurveyService : ISurveyService
    {
        private readonly ApplicationDbContext _context;

        public SurveyService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<SurveyEntity> CreateSurveyAsync(SurveyCreateDto surveyDto, int userId)
        {
            var survey = new SurveyEntity
            {
                Title = surveyDto.Title,
                Description = surveyDto.Description,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = userId,
                Options = surveyDto.Options.Select(o => new SurveyOption
                {
                    Text = o.Text
                }).ToList()
            };

            _context.Surveys.Add(survey);
            await _context.SaveChangesAsync();
            return survey;
        }

        public async Task<SurveyEntity> GetSurveyByIdAsync(int id)
        {
            return await _context.Surveys
                .Include(s => s.Options)
                .ThenInclude(o => o.Votes)
                .Include(s => s.Votes)
                .Include(s => s.CreatedByUser)
                .FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task<IEnumerable<SurveyEntity>> GetAllSurveysAsync()
        {
            return await _context.Surveys
                .Include(s => s.Options)
                .ThenInclude(o => o.Votes)
                .Include(s => s.Votes)
                .Include(s => s.CreatedByUser)
                .OrderByDescending(s => s.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<SurveyEntity>> GetUserSurveysAsync(int userId)
        {
            return await _context.Surveys
                .Include(s => s.Options)
                .ThenInclude(o => o.Votes)
                .Include(s => s.Votes)
                .Include(s => s.CreatedByUser)
                .Where(s => s.CreatedBy == userId)
                .OrderByDescending(s => s.CreatedAt)
                .ToListAsync();
        }

        public async Task<bool> VoteAsync(int surveyId, int optionId, int userId)
        {
            var hasVoted = await IsUserVotedAsync(surveyId, userId);
            if (hasVoted)
                return false;

            var vote = new Vote
            {
                SurveyId = surveyId,
                OptionId = optionId,
                UserId = userId,
                VotedAt = DateTime.UtcNow
            };

            _context.Votes.Add(vote);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteSurveyAsync(int surveyId, int userId)
        {
            var survey = await _context.Surveys
                .FirstOrDefaultAsync(s => s.Id == surveyId && s.CreatedBy == userId);

            if (survey == null)
                return false;

            _context.Surveys.Remove(survey);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> IsUserVotedAsync(int surveyId, int userId)
        {
            return await _context.Votes
                .AnyAsync(v => v.SurveyId == surveyId && v.UserId == userId);
        }
    }
} 
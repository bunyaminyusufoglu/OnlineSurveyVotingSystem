using Survey.API.Models;
using Survey.API.Models.Entities;

namespace Survey.API.Services
{
    public interface ISurveyService
    {
        Task<SurveyEntity> CreateSurveyAsync(SurveyCreateDto surveyDto, int userId);
        Task<SurveyEntity> GetSurveyByIdAsync(int id);
        Task<IEnumerable<SurveyEntity>> GetAllSurveysAsync();
        Task<IEnumerable<SurveyEntity>> GetUserSurveysAsync(int userId);
        Task<bool> VoteAsync(int surveyId, int optionId, int userId);
        Task<bool> DeleteSurveyAsync(int surveyId, int userId);
        Task<bool> IsUserVotedAsync(int surveyId, int userId);
    }
} 
using Survey.API.Models.Entities;

namespace Survey.API.Services
{
    public interface IAuthService
    {
        Task<(bool success, string message)> RegisterAsync(User user, string password);
        Task<(bool success, string token)> LoginAsync(string email, string password);
        Task<User> GetUserByEmailAsync(string email);
        Task<User> GetUserByIdAsync(int id);
    }
} 
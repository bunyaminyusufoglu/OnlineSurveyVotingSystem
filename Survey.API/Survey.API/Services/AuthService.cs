using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Survey.API.Data;
using Survey.API.Models.Entities;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace Survey.API.Services
{
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly TokenService _tokenService;

        public AuthService(ApplicationDbContext context, TokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }

        public async Task<(bool success, string message)> RegisterAsync(User user, string password)
        {
            if (await _context.Users.AnyAsync(u => u.Email == user.Email))
            {
                return (false, "Bu email adresi zaten kullanılıyor.");
            }

            using var hmac = new HMACSHA512();
            user.PasswordHash = Convert.ToBase64String(hmac.ComputeHash(Encoding.UTF8.GetBytes(password)));
            
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return (true, "Kayıt başarılı.");
        }

        public async Task<(bool success, string token)> LoginAsync(string email, string password)
        {
            var user = await _context.Users.SingleOrDefaultAsync(u => u.Email == email);

            if (user == null)
            {
                return (false, "Kullanıcı bulunamadı.");
            }

            using var hmac = new HMACSHA512();
            var computedHash = Convert.ToBase64String(hmac.ComputeHash(Encoding.UTF8.GetBytes(password)));

            if (user.PasswordHash != computedHash)
            {
                return (false, "Hatalı şifre.");
            }

            var token = _tokenService.CreateToken(user);
            return (true, token);
        }

        public async Task<User> GetUserByEmailAsync(string email)
        {
            return await _context.Users.SingleOrDefaultAsync(u => u.Email == email);
        }

        public async Task<User> GetUserByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }
    }
} 
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
        private const int SaltSize = 16;
        private const int HashSize = 20;
        private const int Iterations = 10000;

        public AuthService(ApplicationDbContext context, TokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }

        private string HashPassword(string password, out byte[] salt)
        {
            salt = new byte[SaltSize];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(salt);
            }

            using (var pbkdf2 = new Rfc2898DeriveBytes(password, salt, Iterations))
            {
                byte[] hash = pbkdf2.GetBytes(HashSize);
                return Convert.ToBase64String(hash);
            }
        }

        private bool VerifyPassword(string password, string storedHash, string storedSalt)
        {
            byte[] salt = Convert.FromBase64String(storedSalt);
            using (var pbkdf2 = new Rfc2898DeriveBytes(password, salt, Iterations))
            {
                byte[] hash = pbkdf2.GetBytes(HashSize);
                return Convert.ToBase64String(hash) == storedHash;
            }
        }

        public async Task<(bool success, string message)> RegisterAsync(User user, string password)
        {
            if (await _context.Users.AnyAsync(u => u.Email == user.Email))
            {
                return (false, "Bu email adresi zaten kullanılıyor.");
            }

            byte[] salt;
            string hash = HashPassword(password, out salt);
            
            user.PasswordHash = hash;
            user.PasswordSalt = Convert.ToBase64String(salt);
            
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

            if (!VerifyPassword(password, user.PasswordHash, user.PasswordSalt))
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
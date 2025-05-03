using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Survey.API.Data;
using Survey.API.Models.Auth;
using Survey.API.Models;
using Survey.API.Services;
using System.Text;
using System.Security.Cryptography;

namespace Survey.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly TokenService _tokenService;

        public AuthController(AppDbContext context, TokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequest request)
        {
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
            {
                return BadRequest("Bu email adresi zaten kayıtlı.");
            }

            var user = new User
            {
                FullName = request.FullName,
                Email = request.Email,
                PasswordHash = HashPassword(request.Password),
                Role = "User"
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok("Kayıt başarılı.");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null || user.PasswordHash != HashPassword(request.Password))
            {
                return Unauthorized("Geçersiz email veya şifre.");
            }

            var token = _tokenService.CreateToken(user);

            return Ok(new AuthResponse
            {
                Token = token,
                Email = user.Email,
                Role = user.Role
            });
        }

        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(password);
            var hash = sha256.ComputeHash(bytes);
            return Convert.ToBase64String(hash);
        }
    }
}

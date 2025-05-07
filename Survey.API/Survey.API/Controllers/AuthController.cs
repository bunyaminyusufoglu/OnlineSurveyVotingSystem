using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Survey.API.DTOs;
using Survey.API.Models.Entities;
using Survey.API.Services;

namespace Survey.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new AuthResponse 
                { 
                    Success = false, 
                    Message = "Geçersiz veri girişi." 
                });
            }

            var user = new User
            {
                Username = request.Username,
                Email = request.Email,
                Role = "User"
            };

            var result = await _authService.RegisterAsync(user, request.Password);

            if (!result.success)
            {
                return BadRequest(new AuthResponse 
                { 
                    Success = false, 
                    Message = result.message 
                });
            }

            return Ok(new AuthResponse 
            { 
                Success = true, 
                Message = result.message,
                User = new UserDto
                {
                    Id = user.Id,
                    Username = user.Username,
                    Email = user.Email,
                    Role = user.Role
                }
            });
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new AuthResponse 
                { 
                    Success = false, 
                    Message = "Geçersiz veri girişi." 
                });
            }

            var result = await _authService.LoginAsync(request.Email, request.Password);

            if (!result.success)
            {
                return Unauthorized(new AuthResponse 
                { 
                    Success = false, 
                    Message = result.token 
                });
            }

            var user = await _authService.GetUserByEmailAsync(request.Email);
            if (user == null)
            {
                return NotFound(new AuthResponse
                {
                    Success = false,
                    Message = "Kullanıcı bulunamadı."
                });
            }

            return Ok(new AuthResponse
            {
                Success = true,
                Message = "Giriş başarılı.",
                Token = result.token,
                User = new UserDto
                {
                    Id = user.Id,
                    Username = user.Username,
                    Email = user.Email,
                    Role = user.Role
                }
            });
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
            var user = await _authService.GetUserByIdAsync(userId);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                Role = user.Role
            });
        }
    }
}

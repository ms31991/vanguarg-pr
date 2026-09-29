using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using vanguarg_backhend.Data;
using vanguarg_backhend.DTOs;
using vanguarg_backhend.DTOs.Requests;
using vanguarg_backhend.DTOs.Responses;
using vanguarg_backhend.Services;

namespace vanguarg_backhend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly TokenService _tokenService;

        public AuthController(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            TokenService tokenService)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _tokenService = tokenService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<RegisterResponseDTO>> Register([FromBody] RegisterRequestDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.FullName) ||
                string.IsNullOrWhiteSpace(dto.Email) ||
                string.IsNullOrWhiteSpace(dto.Password))
            {
                return BadRequest(new { code = "auth.missing_fields", message = "Bitte füllen Sie alle Felder aus." });
            }

            var existingUser = await _userManager.FindByEmailAsync(dto.Email);
            if (existingUser != null)
            {
                return BadRequest(new { code = "auth.email_exists", message = "Diese E-Mail-Adresse ist bereits registriert." });
            }

            if (!await _roleManager.RoleExistsAsync(dto.Role))
            {
                return BadRequest(new { code = "auth.role_not_found", message = "Die Rolle existiert nicht." });
            }

            var user = new ApplicationUser
            {
                FullName = dto.FullName,
                Email = dto.Email,
                UserName = dto.Email
            };

            var result = await _userManager.CreateAsync(user, dto.Password);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            await _userManager.AddToRoleAsync(user, dto.Role);

            var roles = await _userManager.GetRolesAsync(user);

            return Ok(new RegisterResponseDTO
            {
                Message = "Benutzer wurde erfolgreich registriert.",
                User = new UserDto
                {
                    Id = user.Id,
                    FullName = user.FullName,
                    Email = user.Email ?? "",
                    Roles = roles
                }
            });
        }

        [HttpPost("login")]
        public async Task<ActionResult<LoginResponseDTO>> Login([FromBody] LoginRequestDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Email) ||
                string.IsNullOrWhiteSpace(dto.Password))
            {
                return BadRequest(new { code = "auth.email_password_required", message = "E-Mail und Passwort sind erforderlich." });
            }

            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null)
            {
                return Unauthorized(new { code = "auth.invalid_credentials", message = "E-Mail oder Passwort ist falsch." });
            }

            var validPassword = await _userManager.CheckPasswordAsync(user, dto.Password);
            if (!validPassword)
            {
                return Unauthorized(new { code = "auth.invalid_credentials", message = "E-Mail oder Passwort ist falsch." });
            }

            var token = await _tokenService.CreateToken(user);
            var roles = await _userManager.GetRolesAsync(user);

            return Ok(new LoginResponseDTO
            {
                Message = "Erfolgreich angemeldet.",
                Token = token,
                User = new UserDto
                {
                    Id = user.Id,
                    FullName = user.FullName,
                    Email = user.Email ?? "",
                    Roles = roles
                }
            });
        }
    }
}
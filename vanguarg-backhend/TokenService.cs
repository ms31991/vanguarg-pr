using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using vanguarg_backhend.Data;

namespace vanguarg_backhend.Services
{
    public class TokenService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private const int ExpirationMinutes = 30;

        public TokenService(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        public async Task<string> CreateToken(ApplicationUser user)
        {
            var expiration = DateTime.UtcNow.AddMinutes(ExpirationMinutes);
            var roles = await _userManager.GetRolesAsync(user);

            var token = CreateJwtToken(
                CreateClaims(user, roles),
                CreateSigningCredentials(),
                expiration
            );

            var tokenHandler = new JwtSecurityTokenHandler();
            return tokenHandler.WriteToken(token);
        }

        private JwtSecurityToken CreateJwtToken(
            List<Claim> claims,
            SigningCredentials credentials,
            DateTime expiration
        ) =>
            new JwtSecurityToken(
                issuer: "MyIssuer",
                audience: "MyAudience",
                expires: expiration,
                claims: claims,
                signingCredentials: credentials
            );

        private List<Claim> CreateClaims(ApplicationUser user, IList<string> roles)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.Name, user.UserName ?? ""),
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Email, user.Email ?? "")
            };

            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            return claims;
        }

        private SigningCredentials CreateSigningCredentials()
        {
            return new SigningCredentials(
                new SymmetricSecurityKey(
                    System.Text.Encoding.UTF8.GetBytes("super_secret_key_123456789_very_long_key")
                ),
                SecurityAlgorithms.HmacSha256
            );
        }
    }
}
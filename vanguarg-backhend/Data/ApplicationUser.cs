using Microsoft.AspNetCore.Identity;

namespace vanguarg_backhend.Data
{
    public class ApplicationUser : IdentityUser
    {
        public string FullName { get; set; } = string.Empty;
    }
}

namespace vanguarg_backhend.DTOs.Responses
{
    public class LoginResponseDTO
    {
        public string Message { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;
        public UserDto User { get; set; }

    }
}

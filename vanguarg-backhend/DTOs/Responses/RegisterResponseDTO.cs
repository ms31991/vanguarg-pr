namespace vanguarg_backhend.DTOs
{
    public class RegisterResponseDTO
    {
        public string Message { get; set; } = string.Empty;
        public UserDto User { get; set; }
    }
}
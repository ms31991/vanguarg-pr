namespace vanguarg_backhend.DTOs
{
    public class LeadRequest
    {
        public int PropertyId { get; set; }
        public string PropertyTitle { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;

        public string ContactMethod { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? Phone { get; set; }

        public string Message { get; set; } = string.Empty;
    }
}
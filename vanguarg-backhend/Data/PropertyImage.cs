namespace vanguarg_backhend.Data
{
    public class PropertyImage
    {
        public int Id { get; set; }

        public string ImageUrl { get; set; } = string.Empty;

        // 🔑 Foreign key
        public int PropertyId { get; set; }

        public Property Property { get; set; }
    }
}
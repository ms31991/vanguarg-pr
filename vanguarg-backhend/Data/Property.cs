namespace vanguarg_backhend.Data
{
    public class Property
    {
        public int Id { get; set; }
        // Default content language: German
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;

        // Optional English translations
        public string? TitleEn { get; set; }
        public string? DescriptionEn { get; set; }
        public decimal Price { get; set; }
        public string City { get; set; } = string.Empty;
        public List<PropertyImage> Images { get; set; } = new();

    }
}

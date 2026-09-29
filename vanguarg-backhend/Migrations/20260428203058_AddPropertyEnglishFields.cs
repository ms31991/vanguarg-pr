using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace vanguarg_backhend.Migrations
{
    /// <inheritdoc />
    public partial class AddPropertyEnglishFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DescriptionEn",
                table: "Properties",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TitleEn",
                table: "Properties",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DescriptionEn",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "TitleEn",
                table: "Properties");
        }
    }
}

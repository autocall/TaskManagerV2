using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TaskManager.Data.Migrations
{
    /// <inheritdoc />
    public partial class AlterTable_Event_Type : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Birthday",
                table: "Event");

            migrationBuilder.DropColumn(
                name: "Holiday",
                table: "Event");

            migrationBuilder.AddColumn<byte>(
                name: "Type",
                table: "Event",
                type: "tinyint",
                nullable: false,
                defaultValue: (byte)0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Type",
                table: "Event");

            migrationBuilder.AddColumn<bool>(
                name: "Birthday",
                table: "Event",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Holiday",
                table: "Event",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}

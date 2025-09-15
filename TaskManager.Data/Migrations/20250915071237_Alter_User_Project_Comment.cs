using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TaskManager.Data.Migrations
{
    /// <inheritdoc />
    public partial class Alter_User_Project_Comment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "GitHubRepo",
                table: "Project",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GitHubOwner",
                table: "IdentityUsers",
                type: "varchar(50)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CommitAdditions",
                table: "Comment",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CommitDeletions",
                table: "Comment",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GitHubRepo",
                table: "Project");

            migrationBuilder.DropColumn(
                name: "GitHubOwner",
                table: "IdentityUsers");

            migrationBuilder.DropColumn(
                name: "CommitAdditions",
                table: "Comment");

            migrationBuilder.DropColumn(
                name: "CommitDeletions",
                table: "Comment");
        }
    }
}

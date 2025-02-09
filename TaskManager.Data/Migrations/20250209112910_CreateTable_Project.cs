using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TaskManager.Data.Migrations
{
    /// <inheritdoc />
    public partial class CreateTable_Project : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Project",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "varchar(64)", nullable: true),
                    CreatedDateTime = table.Column<DateTime>(type: "smalldatetime", nullable: false),
                    CreatedById = table.Column<int>(type: "int", nullable: false),
                    ModifiedDateTime = table.Column<DateTime>(type: "smalldatetime", nullable: false),
                    ModifiedById = table.Column<int>(type: "int", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Project", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Project_IdentityUsers_CreatedById",
                        column: x => x.CreatedById,
                        principalTable: "IdentityUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Project_IdentityUsers_ModifiedById",
                        column: x => x.ModifiedById,
                        principalTable: "IdentityUsers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Project_CreatedById",
                table: "Project",
                column: "CreatedById");

            migrationBuilder.CreateIndex(
                name: "IX_Project_ModifiedById",
                table: "Project",
                column: "ModifiedById");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Project");
        }
    }
}

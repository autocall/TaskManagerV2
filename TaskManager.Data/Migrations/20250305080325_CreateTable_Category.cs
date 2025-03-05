using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TaskManager.Data.Migrations
{
    /// <inheritdoc />
    public partial class CreateTable_Category : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Category",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false),
                    // nvarchar -> varchar
                    Name = table.Column<string>(type: "varchar(64)", nullable: true),
                    Color = table.Column<int>(type: "int", nullable: false),
                    Order = table.Column<byte>(type: "tinyint", nullable: false),
                    CreatedDateTime = table.Column<DateTime>(type: "smalldatetime", nullable: false),
                    CreatedById = table.Column<int>(type: "int", nullable: false),
                    ModifiedDateTime = table.Column<DateTime>(type: "smalldatetime", nullable: false),
                    ModifiedById = table.Column<int>(type: "int", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Category", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Category_IdentityUsers_CreatedById",
                        column: x => x.CreatedById,
                        principalTable: "IdentityUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Category_IdentityUsers_ModifiedById",
                        column: x => x.ModifiedById,
                        principalTable: "IdentityUsers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Category_CreatedById",
                table: "Category",
                column: "CreatedById");

            migrationBuilder.CreateIndex(
                name: "IX_Category_ModifiedById",
                table: "Category",
                column: "ModifiedById");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Category");
        }
    }
}

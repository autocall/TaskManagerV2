using System;
using Microsoft.EntityFrameworkCore.Migrations;
using TaskManager.Data.Entities;

#nullable disable

namespace TaskManager.Data.Migrations
{
    /// <inheritdoc />
    public partial class CreateTable_Company : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CompanyId",
                table: "Project",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "CompanyId",
                table: "IdentityUsers",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "CompanyId",
                table: "Event",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "CompanyId",
                table: "Category",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.Sql("update Project set CompanyId = CreatedById");
            migrationBuilder.Sql("update IdentityUsers set CompanyId = Id");
            migrationBuilder.Sql("update Event set CompanyId = CreatedById");
            migrationBuilder.Sql("update Category set CompanyId = CreatedById");

            migrationBuilder.CreateTable(
                name: "Company",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false),
                    CreatedDateTime = table.Column<DateTime>(type: "smalldatetime", nullable: false),
                    ModifiedDateTime = table.Column<DateTime>(type: "smalldatetime", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Company", x => x.Id);
                });

            migrationBuilder.Sql("insert into Company (Id, CreatedDateTime, ModifiedDateTime, IsDeleted) " +
                $"select distinct Id, getdate(),  getdate(), 0 from IdentityUsers");

            migrationBuilder.CreateIndex(
                name: "IX_Project_CompanyId",
                table: "Project",
                column: "CompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_IdentityUsers_CompanyId",
                table: "IdentityUsers",
                column: "CompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_Event_CompanyId",
                table: "Event",
                column: "CompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_Category_CompanyId",
                table: "Category",
                column: "CompanyId");

            migrationBuilder.AddForeignKey(
                name: "FK_Category_Company_CompanyId",
                table: "Category",
                column: "CompanyId",
                principalTable: "Company",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Event_Company_CompanyId",
                table: "Event",
                column: "CompanyId",
                principalTable: "Company",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_IdentityUsers_Company_CompanyId",
                table: "IdentityUsers",
                column: "CompanyId",
                principalTable: "Company",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Project_Company_CompanyId",
                table: "Project",
                column: "CompanyId",
                principalTable: "Company",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Category_Company_CompanyId",
                table: "Category");

            migrationBuilder.DropForeignKey(
                name: "FK_Event_Company_CompanyId",
                table: "Event");

            migrationBuilder.DropForeignKey(
                name: "FK_IdentityUsers_Company_CompanyId",
                table: "IdentityUsers");

            migrationBuilder.DropForeignKey(
                name: "FK_Project_Company_CompanyId",
                table: "Project");

            migrationBuilder.DropTable(
                name: "Company");

            migrationBuilder.DropIndex(
                name: "IX_Project_CompanyId",
                table: "Project");

            migrationBuilder.DropIndex(
                name: "IX_IdentityUsers_CompanyId",
                table: "IdentityUsers");

            migrationBuilder.DropIndex(
                name: "IX_Event_CompanyId",
                table: "Event");

            migrationBuilder.DropIndex(
                name: "IX_Category_CompanyId",
                table: "Category");

            migrationBuilder.DropColumn(
                name: "CompanyId",
                table: "Project");

            migrationBuilder.DropColumn(
                name: "CompanyId",
                table: "IdentityUsers");

            migrationBuilder.DropColumn(
                name: "CompanyId",
                table: "Event");

            migrationBuilder.DropColumn(
                name: "CompanyId",
                table: "Category");
        }
    }
}

using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TaskManager.Data.Migrations {
    /// <inheritdoc />
    public partial class AlterTable_Task_Collate_UTF8 : Migration {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder) {
            migrationBuilder.Sql("alter table Task alter column Title varchar(256) collate Latin1_General_100_CI_AI_SC_UTF8");
            migrationBuilder.Sql("alter table Task alter column Description varchar(max) collate Latin1_General_100_CI_AI_SC_UTF8");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder) {

        }
    }
}

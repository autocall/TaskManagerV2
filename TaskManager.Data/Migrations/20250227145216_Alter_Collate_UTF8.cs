using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TaskManager.Data.Migrations {
    /// <inheritdoc />
    public partial class Alter_Collate_UTF8 : Migration {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder) {
            migrationBuilder.Sql("alter table Project alter column Name varchar(64) collate Latin1_General_100_CI_AI_SC_UTF8");
            migrationBuilder.Sql("alter table Event alter column Name varchar(64) collate Latin1_General_100_CI_AI_SC_UTF8");
            migrationBuilder.Sql("alter table Event alter column Description varchar(1024) collate Latin1_General_100_CI_AI_SC_UTF8");

            // NOTES: DO NOT CHANGE THE COLUMN TYPE! KEEP 'varchar' TYPE AND USE 'collate Latin1_General_100_CI_AI_SC_UTF' FOR THE RUSSIAN ENCODING

            //migrationBuilder.AlterColumn<string>(
            //    name: "Name",
            //    table: "Project",
            //    type: "nvarchar(64)",
            //    nullable: true,
            //    oldClrType: typeof(string),
            //    oldType: "varchar(64)",
            //    oldNullable: true);

            //migrationBuilder.AlterColumn<string>(
            //    name: "Name",
            //    table: "Event",
            //    type: "nvarchar(64)",
            //    nullable: true,
            //    oldClrType: typeof(string),
            //    oldType: "varchar(64)",
            //    oldNullable: true);

            //migrationBuilder.AlterColumn<string>(
            //    name: "Description",
            //    table: "Event",
            //    type: "nvarchar(1024)",
            //    nullable: true,
            //    oldClrType: typeof(string),
            //    oldType: "varchar(1024)",
            //    oldNullable: true);

        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder) {
            //migrationBuilder.AlterColumn<string>(
            //    name: "Name",
            //    table: "Project",
            //    type: "varchar(64)",
            //    nullable: true,
            //    oldClrType: typeof(string),
            //    oldType: "nvarchar(64)",
            //    oldNullable: true);

            //migrationBuilder.AlterColumn<string>(
            //    name: "Name",
            //    table: "Event",
            //    type: "varchar(64)",
            //    nullable: true,
            //    oldClrType: typeof(string),
            //    oldType: "nvarchar(64)",
            //    oldNullable: true);

            //migrationBuilder.AlterColumn<string>(
            //    name: "Description",
            //    table: "Event",
            //    type: "varchar(1024)",
            //    nullable: true,
            //    oldClrType: typeof(string),
            //    oldType: "nvarchar(1024)",
            //    oldNullable: true);
        }
    }
}

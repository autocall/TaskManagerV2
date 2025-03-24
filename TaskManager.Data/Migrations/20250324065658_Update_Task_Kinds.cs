using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TaskManager.Data.Migrations {
    /// <inheritdoc />
    public partial class Update_Task_Kinds : Migration {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder) {
            migrationBuilder.Sql("update Task set Kind=6 where Kind=4");
            migrationBuilder.Sql("update Task set Kind=4 where Kind=3");
            migrationBuilder.Sql("update Task set Kind=3 where Kind=2");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder) {
            migrationBuilder.Sql("update Task set Kind=2 where Kind=3");
            migrationBuilder.Sql("update Task set Kind=3 where Kind=4");
            migrationBuilder.Sql("update Task set Kind=4 where Kind=6");
        }
    }
}

//public enum TaskKindEnum {
//    Unknown = 0,
//    Task = 1,
//    Bug = 2, -> 3
//    Feature = 3, -> 4
//    Support = 4, -> 6
//}

//public enum TaskKindEnum {
//    Unknown = 0,
//    Task = 1,
//    Fix = 2,
//    Bug = 3,
//    Feature = 4,
//    Improvement = 5,
//    Support = 6,
//}

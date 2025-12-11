using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AttendeeProfile : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ActivityAttendeeActivityId",
                table: "UsersFollows",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ActivityAttendeeActivityId1",
                table: "UsersFollows",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ActivityAttendeeUserId",
                table: "UsersFollows",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ActivityAttendeeUserId1",
                table: "UsersFollows",
                type: "TEXT",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_UsersFollows_ActivityAttendeeActivityId_ActivityAttendeeUserId",
                table: "UsersFollows",
                columns: new[] { "ActivityAttendeeActivityId", "ActivityAttendeeUserId" });

            migrationBuilder.CreateIndex(
                name: "IX_UsersFollows_ActivityAttendeeActivityId1_ActivityAttendeeUserId1",
                table: "UsersFollows",
                columns: new[] { "ActivityAttendeeActivityId1", "ActivityAttendeeUserId1" });

            migrationBuilder.AddForeignKey(
                name: "FK_UsersFollows_ActivitiesAttendees_ActivityAttendeeActivityId1_ActivityAttendeeUserId1",
                table: "UsersFollows",
                columns: new[] { "ActivityAttendeeActivityId1", "ActivityAttendeeUserId1" },
                principalTable: "ActivitiesAttendees",
                principalColumns: new[] { "ActivityId", "UserId" });

            migrationBuilder.AddForeignKey(
                name: "FK_UsersFollows_ActivitiesAttendees_ActivityAttendeeActivityId_ActivityAttendeeUserId",
                table: "UsersFollows",
                columns: new[] { "ActivityAttendeeActivityId", "ActivityAttendeeUserId" },
                principalTable: "ActivitiesAttendees",
                principalColumns: new[] { "ActivityId", "UserId" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UsersFollows_ActivitiesAttendees_ActivityAttendeeActivityId1_ActivityAttendeeUserId1",
                table: "UsersFollows");

            migrationBuilder.DropForeignKey(
                name: "FK_UsersFollows_ActivitiesAttendees_ActivityAttendeeActivityId_ActivityAttendeeUserId",
                table: "UsersFollows");

            migrationBuilder.DropIndex(
                name: "IX_UsersFollows_ActivityAttendeeActivityId_ActivityAttendeeUserId",
                table: "UsersFollows");

            migrationBuilder.DropIndex(
                name: "IX_UsersFollows_ActivityAttendeeActivityId1_ActivityAttendeeUserId1",
                table: "UsersFollows");

            migrationBuilder.DropColumn(
                name: "ActivityAttendeeActivityId",
                table: "UsersFollows");

            migrationBuilder.DropColumn(
                name: "ActivityAttendeeActivityId1",
                table: "UsersFollows");

            migrationBuilder.DropColumn(
                name: "ActivityAttendeeUserId",
                table: "UsersFollows");

            migrationBuilder.DropColumn(
                name: "ActivityAttendeeUserId1",
                table: "UsersFollows");
        }
    }
}

using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AdjustProjectWaitingList : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProjectMmembers_Projects_ProjectId",
                table: "ProjectMmembers");

            migrationBuilder.DropForeignKey(
                name: "FK_ProjectMmembers_Users_UserId",
                table: "ProjectMmembers");

            migrationBuilder.DropTable(
                name: "ProjectWaitingListUser");

            migrationBuilder.DropTable(
                name: "ProjectWaitingList");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ProjectMmembers",
                table: "ProjectMmembers");

            migrationBuilder.RenameTable(
                name: "ProjectMmembers",
                newName: "ProjectMembers");

            migrationBuilder.RenameIndex(
                name: "IX_ProjectMmembers_ProjectId",
                table: "ProjectMembers",
                newName: "IX_ProjectMembers_ProjectId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ProjectMembers",
                table: "ProjectMembers",
                columns: new[] { "UserId", "ProjectId" });

            migrationBuilder.CreateTable(
                name: "ProjectApplication",
                columns: table => new
                {
                    ProjectId = table.Column<int>(type: "integer", nullable: false),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectApplication", x => new { x.ProjectId, x.UserId });
                    table.ForeignKey(
                        name: "FK_ProjectApplication_Projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "Projects",
                        principalColumn: "ProjectId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProjectApplication_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProjectApplication_UserId",
                table: "ProjectApplication",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectMembers_Projects_ProjectId",
                table: "ProjectMembers",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "ProjectId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectMembers_Users_UserId",
                table: "ProjectMembers",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProjectMembers_Projects_ProjectId",
                table: "ProjectMembers");

            migrationBuilder.DropForeignKey(
                name: "FK_ProjectMembers_Users_UserId",
                table: "ProjectMembers");

            migrationBuilder.DropTable(
                name: "ProjectApplication");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ProjectMembers",
                table: "ProjectMembers");

            migrationBuilder.RenameTable(
                name: "ProjectMembers",
                newName: "ProjectMmembers");

            migrationBuilder.RenameIndex(
                name: "IX_ProjectMembers_ProjectId",
                table: "ProjectMmembers",
                newName: "IX_ProjectMmembers_ProjectId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ProjectMmembers",
                table: "ProjectMmembers",
                columns: new[] { "UserId", "ProjectId" });

            migrationBuilder.CreateTable(
                name: "ProjectWaitingList",
                columns: table => new
                {
                    ProjectId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectWaitingList", x => x.ProjectId);
                    table.ForeignKey(
                        name: "FK_ProjectWaitingList_Projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "Projects",
                        principalColumn: "ProjectId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProjectWaitingListUser",
                columns: table => new
                {
                    ProjectId = table.Column<int>(type: "integer", nullable: false),
                    UserId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectWaitingListUser", x => new { x.ProjectId, x.UserId });
                    table.ForeignKey(
                        name: "FK_ProjectWaitingListUser_ProjectWaitingList_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "ProjectWaitingList",
                        principalColumn: "ProjectId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProjectWaitingListUser_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProjectWaitingListUser_UserId",
                table: "ProjectWaitingListUser",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectMmembers_Projects_ProjectId",
                table: "ProjectMmembers",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "ProjectId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectMmembers_Users_UserId",
                table: "ProjectMmembers",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}

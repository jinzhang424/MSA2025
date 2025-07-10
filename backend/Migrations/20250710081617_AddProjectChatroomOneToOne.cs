using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddProjectChatroomOneToOne : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ProjectId",
                table: "Chatrooms",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Chatrooms_ProjectId",
                table: "Chatrooms",
                column: "ProjectId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Chatrooms_Projects_ProjectId",
                table: "Chatrooms",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "ProjectId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Chatrooms_Projects_ProjectId",
                table: "Chatrooms");

            migrationBuilder.DropIndex(
                name: "IX_Chatrooms_ProjectId",
                table: "Chatrooms");

            migrationBuilder.DropColumn(
                name: "ProjectId",
                table: "Chatrooms");
        }
    }
}

using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Authorization;

namespace backend.Service;

[Authorize]
public class ChatHub : Hub
{
    public async Task JoinChatroom(string chatroomId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, chatroomId);
    }

    public async Task LeaveChatroom(string chatroomId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, chatroomId);
    }
}
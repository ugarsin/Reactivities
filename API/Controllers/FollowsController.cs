using Application.Follow.Commands;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class FollowsController : BaseApiController
    {
        [HttpPost("{id}")]
        public async Task<IActionResult> Follow(string id)
        {
            return HandleResult(await Mediator.Send(new FollowToggle.Command { Id = id }));
        }
    }
}

using Application.Follow.Commands;
using Application.Follow.Queries;
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

        [HttpDelete("{id}")]
        public async Task<IActionResult> UnFollow(string id)
        {
            return HandleResult(await Mediator.Send(new FollowToggle.Command { Id = id }));
        }

        [HttpGet("{id}/{predicate}")]
        public async Task<IActionResult> GetFollowings(string id, string predicate)
        {
            return HandleResult(await Mediator.Send(new FollowList.Query { Id = id, Predicate = predicate }));
        }
    }
}

using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Follow.Commands
{
    public class FollowToggle
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string Id { get; set; }
        }

        public class Handler(AppDbContext context, IUserAccessor userAccessor) : IRequestHandler<Command, Result<Unit>>
        {
            private readonly AppDbContext context = context;
            private readonly IUserAccessor userAccessor = userAccessor;

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var follower = await context.Users
                    .FirstOrDefaultAsync(x => x.Id == userAccessor.GetUserId());
                var target = await context.Users
                    .FirstOrDefaultAsync(x => x.Id == request.Id);
                if (target == null) throw new Exception("Target user not found");
                var following = await context.UsersFollows
                    .FindAsync(target.Id, follower?.Id);
                if (following == null)
                {
                    following = new UserFollow
                    {
                        Follower = follower!,
                        FollowerId = follower!.Id,
                        Following = target,
                        FollowingId = target.Id
                    };
                    context.UsersFollows.Add(following);
                }
                else
                {
                    context.UsersFollows.Remove(following);
                }
                var result = await context.SaveChangesAsync(cancellationToken) > 0;
                return result
                    ?
                    Result<Unit>.Success(Unit.Value)
                    :
                    Result<Unit>.Failure("Target or Follower not found", 400);
            }
        }
    }
}

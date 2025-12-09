using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Collections.Generic;
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

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly AppDbContext _context;
            private readonly IUserAccessor _userAccessor;

            public Handler(AppDbContext context, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var follower = await _context.Users
                    .FirstOrDefaultAsync(x => x.Id == _userAccessor.GetUserId());

                var target = await _context.Users
                    .FirstOrDefaultAsync(x => x.Id == request.Id);

                if (target == null) throw new Exception("Target user not found");

                var following = await _context.UsersFollows
                    .FindAsync(follower.Id, target.Id);

                if (following == null)
                {
                    following = new UserFollow
                    {
                        FollowerId = follower.Id,
                        FollowingId = target.Id
                    };

                    _context.UsersFollows.Add(following);
                }
                else
                {
                    _context.UsersFollows.Remove(following);
                }

                var result = await _context.SaveChangesAsync(cancellationToken) > 0;
                return result
                    ?
                    Result<Unit>.Success(Unit.Value)
                    :
                    Result<Unit>.Failure("Target or Follower not found", 400);
            }
        }
    }
}

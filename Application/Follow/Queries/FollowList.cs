using Application.Core;
using Application.Interfaces;
using Application.Profiles.DTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Follow.Queries
{
    public class FollowList
    {
        public class Query : IRequest<Result<List<UserProfile>>>
        {
            public required string Id { get; set; }
            public required string Predicate { get; set; }
        }

        public class Handler(
            AppDbContext context,
            IMapper mapper,
            IUserAccessor userAccessor
        ) : IRequestHandler<Query, Result<List<UserProfile>>>
        {
            public async Task<Result<List<UserProfile>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var profiles = new List<UserProfile>();
                switch (request.Predicate)
                {
                    case "followers":
                        profiles = await context.UsersFollows
                            .Where(x => x.Following.Id == request.Id)
                            .Select(x => x.Follower)
                            .ProjectTo<UserProfile>(mapper.ConfigurationProvider,
                            new { currentUserId = request.Id })
                            .ToListAsync(cancellationToken);
                        break;
                    case "followings":
                        profiles = await context.UsersFollows
                            .Where(x => x.Follower.Id == request.Id)
                            .Select(x => x.Following)
                            .ProjectTo<UserProfile>(mapper.ConfigurationProvider,
                            new { currentUserId = request.Id })
                            .ToListAsync(cancellationToken);
                        break;
                }
                return Result<List<UserProfile>>.Success(profiles);
            }
        }
    }
}

using Application.Core;
using Application.Profiles.DTOs;
using AutoMapper;
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
    public class List
    {
        public class Query : IRequest<Result<List<UserProfile>>>
        {
            public required string Id { get; set; }
            public required string Predicate { get; set; }
        }

        public class Handler(
            AppDbContext context,
            IMapper mapper
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
                            .Select(x => mapper.Map<UserProfile>(x.Follower))
                            .ToListAsync(cancellationToken);
                        break;

                    case "following":
                        profiles = await context.UsersFollows
                            .Where(x => x.Follower.Id == request.Id)
                            .Select(x => mapper.Map<UserProfile>(x.Following))
                            .ToListAsync(cancellationToken);
                        break;
                }

                return Result<List<UserProfile>>.Success(profiles);
            }
        }
    }
}

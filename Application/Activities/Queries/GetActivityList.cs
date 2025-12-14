using Application.Activities.DTOs;
using Application.Activities.Queries;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

public class GetActivityList
{
    public class Query : IRequest<Result<PagedList<ActivityDto, DateTime?>>>
    {
        public required ActivityParams Params { get; set; }
    }

    public class Handler(AppDbContext context, IMapper mapper, IUserAccessor userAccessor)
        : IRequestHandler<Query, Result<PagedList<ActivityDto, DateTime?>>>
    {
        public async Task<Result<PagedList<ActivityDto, DateTime?>>> Handle(Query request, CancellationToken cancellationToken)
        {
            var query = context.Activities
                .OrderBy(x => x.Date)
                .AsQueryable();
            if (request.Params.Cursor.HasValue)
            {
                query = query.Where(x => x.Date >= request.Params.Cursor.Value);
            }
            else if (request.Params.StartDate.HasValue)
            {
                query = query.Where(x => x.Date >= request.Params.StartDate.Value);
            }
            if (!string.IsNullOrEmpty(request.Params.Filter))
            {
                query = request.Params.Filter switch
                {
                    "isGoing" => query.Where(x =>
                        x.Attendees.Any(a =>
                            a.UserId == userAccessor.GetUserId()
                        )
                    ),
                    "isHosting" => query.Where(x =>
                        x.Attendees.Any(a =>
                            a.IsHost &&
                            a.UserId == userAccessor.GetUserId()
                        )
                    ),
                    _ => query
                };
            }
            var projectedQuery = query.ProjectTo<ActivityDto>(
                    mapper.ConfigurationProvider,
                    new { currentUserId = userAccessor.GetUserId() }
                );
            var activities = await projectedQuery
                .Take(request.Params.PageSize + 1)
                .ToListAsync(cancellationToken);
            DateTime? nextCursor = null;
            if (activities.Count > request.Params.PageSize)
            {
                nextCursor = activities.Last().Date;
                activities.RemoveAt(activities.Count - 1);
            }
            return Result<PagedList<ActivityDto, DateTime?>>.Success(
                new PagedList<ActivityDto, DateTime?>
                {
                    Items = activities,
                    NextCursor = nextCursor
                }
            );
        }
    }
}
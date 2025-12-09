using Application.Activities.DTOs;
using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

public class GetActivityList
{
    private const int MaxPageSize = 50;
    private const int DefaultPageSize = 3;

    public class Query : IRequest<Result<PagedList<ActivityDto, DateTime?>>>
    {
        public Query()
        {
            _pageSize = DefaultPageSize;   // 👈 CORRECT DEFAULT
        }

        public DateTime? Cursor { get; set; }

        private int _pageSize;

        public int PageSize
        {
            get => _pageSize;
            set => _pageSize = value > MaxPageSize ? MaxPageSize : value;
        }
    }

    public class Handler(AppDbContext context, IMapper mapper)
        : IRequestHandler<Query, Result<PagedList<ActivityDto, DateTime?>>>
    {
        public async Task<Result<PagedList<ActivityDto, DateTime?>>> Handle(Query request, CancellationToken cancellationToken)
        {
            var query = context.Activities
                .OrderBy(x => x.Date)
                .AsQueryable();

            if (request.Cursor.HasValue)
                query = query.Where(x => x.Date > request.Cursor.Value);

            var activities = await query
                .Take(request.PageSize + 1)
                .ProjectTo<ActivityDto>(mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken);

            DateTime? nextCursor = null;

            if (activities.Count > request.PageSize)
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
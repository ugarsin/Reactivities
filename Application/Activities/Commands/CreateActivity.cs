using MediatR;
using Persistence;

namespace Application.Activities.Commands
{
    public class CreateActivity
    {
        public class Command : IRequest<string>
        {
            public required Domain.Activity Activity { get; set; }
        }

        public class Handler(AppDbContext context) : IRequestHandler<Command, string>
        {
            public async Task<string> Handle(Command request, CancellationToken cancellationToken)
            {
                context.Activities.Add(request.Activity);
                await context.SaveChangesAsync();
                return request.Activity.Id;
            }
        }
    }
}

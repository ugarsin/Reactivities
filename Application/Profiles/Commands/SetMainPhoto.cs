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

namespace Application.Profiles.Commands
{
    public class SetMainPhoto
    {
        public class Command : IRequest<Result<Unit>>
        {
            public required string PhotoId { get; set; }
        }

        public class Handler(
            AppDbContext context,
            IUserAccessor userAccessor
        ) : IRequestHandler<Command, Result<Unit>>
        {
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await userAccessor.GetUserWithPhotosAsync();
                if (user == null)
                    return Result<Unit>.Failure("User not found", 404);

                var photo = user.Photos.FirstOrDefault(x => x.Id == request.PhotoId);
                if (photo == null)
                    return Result<Unit>.Failure("Photo not found", 400);

                // Update user profile picture
                user.ImageUrl = photo.Url;

                // Clear all IsMain flags
                await context.Photos
                    .Where(p => p.UserId == user.Id)
                    .ExecuteUpdateAsync(setters => setters.SetProperty(p => p.IsMain, false));

                // Mark selected as main
                await context.Photos
                    .Where(p => p.Id == request.PhotoId)
                    .ExecuteUpdateAsync(setters => setters.SetProperty(p => p.IsMain, true));

                // Save user.ImageUrl change only
                await context.SaveChangesAsync(cancellationToken);

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}

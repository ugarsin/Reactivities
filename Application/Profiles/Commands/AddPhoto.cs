using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Filters;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Profiles.Commands
{
    public class AddPhoto
    {
        public class Command : IRequest<Result<Photo>>
        {
            public required IFormFile File { get; set; }
        }

        public class Handler(
            IUserAccessor userAccessor,
            AppDbContext appDbContext,
            IPhotoService photoService
        ) : IRequestHandler<Command, Result<Photo>>
        {
            public async Task<Result<Photo>> Handle(Command request, CancellationToken cancellationToken)
            {
                var uploadResult = await photoService.UploadPhoto(request.File);
                if (uploadResult == null) return Result<Photo>.Failure("Failed to upload photo", 400);
                var user = await userAccessor.GetUserAsync();
                var photo = new Photo
                {
                    PublicId = uploadResult.PublicId,
                    Url = uploadResult.Url,
                    UserId = user.Id
                };
                user.ImageUrl ??= photo.Url;
                appDbContext.Photos.Add(photo);
                var result = await appDbContext.SaveChangesAsync(cancellationToken) > 0;
                return result ? Result<Photo>.Success(photo) : Result<Photo>.Failure("Failed to upload photo", 400);
            }
        }
    }
}

using API.Config;
using Microsoft.AspNetCore.Http;

namespace API.Interfaces
{
    public interface ICookieOptions
    {
        CookieOptions BuildCookieOptions(DateTime? expiresAt);
    }
}

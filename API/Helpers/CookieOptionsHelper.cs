using API.Config;
using API.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace API.Helpers
{
    public class CookieOptionsHelper : ICookieOptions
    {
        private readonly JwtCookieOptions _defaults;

        public CookieOptionsHelper(IOptions<JwtCookieOptions> options)
        {
            _defaults = options.Value;
        }

        public CookieOptions BuildCookieOptions(DateTime? expiresAt)
        {
            return new CookieOptions
            {
                HttpOnly = _defaults.HttpOnly,
                Secure = true,
                SameSite = Enum.Parse<SameSiteMode>(_defaults.SameSite, ignoreCase: true),
                Path = _defaults.Path,
                Expires = expiresAt
            };
        }

        public CookieOptions BuildDeleteOptions()
        {
            return new CookieOptions
            {
                HttpOnly = _defaults.HttpOnly,
                Secure = true,
                SameSite = Enum.Parse<SameSiteMode>(_defaults.SameSite, ignoreCase: true),
                Path = _defaults.Path,
                Expires = DateTime.UnixEpoch  // ensures deletion
            };
        }
    }
}

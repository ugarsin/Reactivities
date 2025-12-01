using Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IJwtTokenService
    {
        JwtTokenResultDto GenerateToken(string userId, string userName, IList<string> roles);
        string GenerateRefreshToken();
        Task<bool> ValidateToken(string token);
    }
}

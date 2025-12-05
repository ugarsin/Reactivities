using API.DTOs;
using Application.DTOs;
using Application.Interfaces;
using Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class AccountsController : BaseApiController
    {
        private readonly SignInManager<User> _signInManager;
        private readonly IJwtTokenService _jwtTokenService;
        private readonly UserManager<User> _userManager;

        public AccountsController(
            SignInManager<User> signInManager,
            UserManager<User> userManager,
            IJwtTokenService jwtTokenService
        )
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _jwtTokenService = jwtTokenService;
        }

        [HttpPost("login")]
        public async Task<ActionResult> LoginUser(LoginDto login)
        {
            var user = await _userManager.FindByNameAsync(login.Email);
            if (user == null) return Unauthorized();
            var result = await _userManager.CheckPasswordAsync(user, login.Password);
            if (!result) return Unauthorized("You are not authorized");
            var roles = await _userManager.GetRolesAsync(user);
            var token = _jwtTokenService.GenerateToken(user.Id, user.UserName!, roles);
            user.RefreshToken = token.RefreshToken;
            await _userManager.UpdateAsync(user);
            //return Ok(token);
            // Write Access Token Cookie
            Response.Cookies.Append("access_token", token.AccessToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true, // HTTPS only!
                SameSite = SameSiteMode.Strict,
                Path = "/",
                Expires = token.ExpiresAt
            });
            // Write Refresh Token Cookie
            Response.Cookies.Append("refresh_token", token.RefreshToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Path = "/",
                Expires = DateTime.UtcNow.AddDays(30) // typical refresh window
            });
            return Ok(new { message = "Logged in successfully" });
        }

        [HttpPost("register")]
        public async Task<ActionResult> RegisterUser(RegisterDto registerDto)
        {
            var user = new User
            {
                UserName = registerDto.Email,
                Email = registerDto.Email,
                DisplayName = registerDto.DisplayName
            };
            var result = await _signInManager.UserManager.CreateAsync(user, registerDto.Password);
            if (result.Succeeded) return Ok();
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(error.Code, error.Description);
            }
            return ValidationProblem();
        }

        [HttpGet("user-info")]
        public async Task<ActionResult> GetUserInfo()
        {
            if (User.Identity?.IsAuthenticated == false) return NoContent();
            var user = await _signInManager.UserManager.GetUserAsync(User);
            if (user == null) return Unauthorized();
            return Ok(new
            {
                user.DisplayName,
                user.Email,
                user.Id,
                user.ImageUrl
            });
        }

        //[HttpPost("logout")]
        //public async Task<ActionResult> Logout()
        //{
        //    await _signInManager.SignOutAsync();
        //    return NoContent();
        //}
        [HttpPost("logout")]
        public ActionResult Logout()
        {
            Response.Cookies.Delete("access_token");
            Response.Cookies.Delete("refresh_token");

            return NoContent();
        }

        [HttpGet("debug-user")]
        public IActionResult DebugUser()
        {
            var claims = HttpContext.User.Claims
                .Select(c => new { c.Type, c.Value });

            return Ok(claims);
        }
    }
}

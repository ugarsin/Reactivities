using API.Config;
using API.DTOs;
using API.Interfaces;
using Application.DTOs;
using Application.Interfaces;
using Domain;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace API.Controllers
{
    public class AccountsController : BaseApiController
    {
        private readonly SignInManager<User> _signInManager;
        private readonly IJwtTokenService _jwtTokenService;
        private readonly IOptions<JwtCookieOptions> _options;
        private readonly ICookieOptions _cookieOptions;
        private readonly UserManager<User> _userManager;

        public AccountsController(
            SignInManager<User> signInManager,
            UserManager<User> userManager,
            IJwtTokenService jwtTokenService,
            IOptions<JwtCookieOptions> options,
            ICookieOptions cookieOptions
        )
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _jwtTokenService = jwtTokenService;
            _options = options;
            _cookieOptions = cookieOptions;
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
            var cookieConfig = _cookieOptions.BuildCookieOptions(token.ExpiresAt);
            Response.Cookies.Append("access_token", token.AccessToken, cookieConfig);
            cookieConfig = _cookieOptions.BuildCookieOptions(token.ExpiresAt.AddDays(30));
            Response.Cookies.Append("refresh_token", token.RefreshToken, cookieConfig);
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
            var deleteOptions = _cookieOptions.BuildDeleteOptions();

            Response.Cookies.Delete("access_token", deleteOptions);
            Response.Cookies.Delete("refresh_token", deleteOptions);

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

namespace API.Config
{
    public record JwtCookieOptions
    {
        public string AccessTokenName { get; init; } = "access_token";
        public string RefreshTokenName { get; init; } = "refresh_token";
        public bool HttpOnly { get; init; } = true;
        public string SameSite { get; init; } = "None";
        //public SameSiteMode SameSite { get; init; } = SameSiteMode.None;
        public string Secure { get; init; } = "Always";
        //public CookieSecurePolicy Secure { get; init; } = CookieSecurePolicy.Always;
        public int AccessTokenExpirationMinutes { get; init; } = 60;
        public int RefreshTokenExpirationDays { get; init; } = 30;
        public string Path { get; init; } = "/";
        public DateTime? Expires { get; init; }
    }
}

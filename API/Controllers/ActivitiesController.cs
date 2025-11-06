using System.Diagnostics;
using API.Controllers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers;

public class ActivitiesController : BaseApiController
{
    private readonly AppDbContext context;

    public ActivitiesController(AppDbContext context)
    {
        this.context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<Domain.Activity>>> GetActivities()
    {
        return await context.Activities.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Domain.Activity?>> GetAvtivityById(string id)
    {
        var activity = await context.Activities.FindAsync(id);
        if (activity == null) return NotFound("Activity not found");
        {
            return activity;
        }
    }
}

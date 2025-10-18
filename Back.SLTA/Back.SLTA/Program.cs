using Back.SLTA.Application.Interfaces;
using Back.SLTA.Application.Services;
using Back.SLTA.Domain.Repositories;
using Back.SLTA.Infrastructure.Configurations;
using Back.SLTA.Infrastructure.Persistence;
using Back.SLTA.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy.WithOrigins("http://localhost:8100", "http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var seedPublications = DataSeeder.GetInitialPublications();
builder.Services.AddSingleton(new InMemoryDataContext(seedPublications));
builder.Services.AddScoped<IPublicationRepository, InMemoryPublicationRepository>();
builder.Services.AddScoped<IPublicationService, PublicationService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("Frontend");

app.UseAuthorization();

app.MapControllers();

app.Run();

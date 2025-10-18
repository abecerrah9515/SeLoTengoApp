using System;
using Back.SLTA.Domain.Enums;

namespace Back.SLTA.Application.DTOs;

public sealed record PublicationDto
{
    public Guid Id { get; init; }
    public string Title { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public PublicationType Type { get; init; }
    public string OwnerName { get; init; } = string.Empty;
    public string OwnerProgram { get; init; } = string.Empty;
    public string? ImageUrl { get; init; }
    public string? Price { get; init; }
    public string? ContactPhone { get; init; }
    public string? ProfileImageUrl { get; init; }
}

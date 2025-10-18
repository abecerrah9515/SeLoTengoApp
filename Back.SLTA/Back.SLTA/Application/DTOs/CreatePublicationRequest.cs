using System.ComponentModel.DataAnnotations;
using Back.SLTA.Domain.Enums;

namespace Back.SLTA.Application.DTOs;

public sealed record CreatePublicationRequest
{
    [Required]
    public string Title { get; init; } = string.Empty;

    [Required]
    public string Description { get; init; } = string.Empty;

    [Required]
    public PublicationType Type { get; init; }

    [Required]
    public string OwnerName { get; init; } = string.Empty;

    public string OwnerProgram { get; init; } = string.Empty;

    public decimal? PriceAmount { get; init; }

    public string PriceCurrency { get; init; } = "COP";

    public string? ContactPhone { get; init; }

    public string? ImageUrl { get; init; }

    public string? ProfileImageUrl { get; init; }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Back.SLTA.Application.DTOs;
using Back.SLTA.Application.Interfaces;
using Back.SLTA.Domain.Entities;
using Back.SLTA.Domain.Enums;
using Back.SLTA.Domain.Repositories;
using Back.SLTA.Domain.ValueObjects;

namespace Back.SLTA.Application.Services;

public sealed class PublicationService : IPublicationService
{
    private readonly IPublicationRepository _repository;

    public PublicationService(IPublicationRepository repository)
    {
        _repository = repository;
    }

    public async Task<IReadOnlyCollection<PublicationDto>> GetAllAsync(CancellationToken cancellationToken)
    {
        var publications = await _repository.GetAllAsync(cancellationToken);
        return publications.Select(MapToDto).ToList();
    }

    public async Task<IReadOnlyCollection<PublicationDto>> GetByTypeAsync(PublicationType type, CancellationToken cancellationToken)
    {
        var publications = await _repository.GetByTypeAsync(type, cancellationToken);
        return publications.Select(MapToDto).ToList();
    }

    public async Task<PublicationDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        var publication = await _repository.GetByIdAsync(id, cancellationToken);
        return publication is null ? null : MapToDto(publication);
    }

    public async Task<Guid> CreateAsync(CreatePublicationRequest request, CancellationToken cancellationToken)
    {
        var publication = Publication.Create(
            request.Title,
            request.Description,
            request.Type,
            UserProfile.Create(request.OwnerName, request.OwnerProgram),
            request.ImageUrl,
            request.PriceAmount.HasValue ? Price.Create(request.PriceAmount.Value, request.PriceCurrency) : null,
            request.ContactPhone,
            request.ProfileImageUrl);

        await _repository.AddAsync(publication, cancellationToken);
        return publication.Id;
    }

    public async Task UpdateAsync(UpdatePublicationRequest request, CancellationToken cancellationToken)
    {
        var publication = await _repository.GetByIdAsync(request.Id, cancellationToken)
            ?? throw new KeyNotFoundException($"No se encontró la publicación {request.Id}");

        publication.UpdateDetails(request.Title, request.Description, request.Type, request.ImageUrl);
        publication.UpdateOwner(UserProfile.Create(request.OwnerName, request.OwnerProgram));
        publication.UpdateContact(request.ContactPhone);
        publication.UpdateProfileImage(request.ProfileImageUrl);
        publication.UpdatePrice(request.PriceAmount.HasValue ? Price.Create(request.PriceAmount.Value, request.PriceCurrency) : null);

        await _repository.UpdateAsync(publication, cancellationToken);
    }

    public Task DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        return _repository.DeleteAsync(id, cancellationToken);
    }

    private static PublicationDto MapToDto(Publication publication)
    {
        return new PublicationDto
        {
            Id = publication.Id,
            Title = publication.Title,
            Description = publication.Description,
            Type = publication.Type,
            OwnerName = publication.Owner.FullName,
            OwnerProgram = publication.Owner.Program,
            ImageUrl = publication.ImageUrl,
            ProfileImageUrl = publication.ProfileImageUrl,
            ContactPhone = publication.ContactPhone,
            Price = publication.Price?.ToString()
        };
    }
}

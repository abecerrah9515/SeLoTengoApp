using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Back.SLTA.Application.DTOs;
using Back.SLTA.Domain.Enums;

namespace Back.SLTA.Application.Interfaces;

public interface IPublicationService
{
    Task<IReadOnlyCollection<PublicationDto>> GetAllAsync(CancellationToken cancellationToken);
    Task<IReadOnlyCollection<PublicationDto>> GetByTypeAsync(PublicationType type, CancellationToken cancellationToken);
    Task<PublicationDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<Guid> CreateAsync(CreatePublicationRequest request, CancellationToken cancellationToken);
    Task UpdateAsync(UpdatePublicationRequest request, CancellationToken cancellationToken);
    Task DeleteAsync(Guid id, CancellationToken cancellationToken);
}

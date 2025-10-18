using System;
using System.Threading;
using System.Threading.Tasks;
using Back.SLTA.Domain.Entities;
using Back.SLTA.Domain.Enums;

namespace Back.SLTA.Domain.Repositories;

public interface IPublicationRepository
{
    Task<IReadOnlyCollection<Publication>> GetAllAsync(CancellationToken cancellationToken);
    Task<IReadOnlyCollection<Publication>> GetByTypeAsync(PublicationType type, CancellationToken cancellationToken);
    Task<Publication?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task AddAsync(Publication publication, CancellationToken cancellationToken);
    Task UpdateAsync(Publication publication, CancellationToken cancellationToken);
    Task DeleteAsync(Guid id, CancellationToken cancellationToken);
}

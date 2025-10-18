using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Back.SLTA.Domain.Entities;
using Back.SLTA.Domain.Enums;
using Back.SLTA.Domain.Repositories;
using Back.SLTA.Infrastructure.Persistence;

namespace Back.SLTA.Infrastructure.Repositories;

public sealed class InMemoryPublicationRepository : IPublicationRepository
{
    private readonly InMemoryDataContext _context;

    public InMemoryPublicationRepository(InMemoryDataContext context)
    {
        _context = context;
    }

    public async Task<IReadOnlyCollection<Publication>> GetAllAsync(CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();
        return await _context.GetPublicationsAsync();
    }

    public async Task<IReadOnlyCollection<Publication>> GetByTypeAsync(PublicationType type, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();
        var publications = await _context.GetPublicationsAsync();
        return publications.Where(p => p.Type == type).ToList();
    }

    public Task<Publication?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();
        return _context.GetPublicationByIdAsync(id);
    }

    public async Task AddAsync(Publication publication, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();
        await _context.AddPublicationAsync(publication);
    }

    public async Task UpdateAsync(Publication publication, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();
        await _context.UpdatePublicationAsync(publication);
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();
        await _context.DeletePublicationAsync(id);
    }
}

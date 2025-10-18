using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Back.SLTA.Domain.Entities;

namespace Back.SLTA.Infrastructure.Persistence;

public sealed class InMemoryDataContext
{
    private readonly List<Publication> _publications;
    private readonly SemaphoreSlim _lock = new(1, 1);

    public InMemoryDataContext(IEnumerable<Publication> publications)
    {
        _publications = publications.ToList();
    }

    public async Task<IReadOnlyCollection<Publication>> GetPublicationsAsync()
    {
        await _lock.WaitAsync();
        try
        {
            return _publications.ToList();
        }
        finally
        {
            _lock.Release();
        }
    }

    public async Task<Publication?> GetPublicationByIdAsync(Guid id)
    {
        await _lock.WaitAsync();
        try
        {
            return _publications.FirstOrDefault(p => p.Id == id);
        }
        finally
        {
            _lock.Release();
        }
    }

    public async Task AddPublicationAsync(Publication publication)
    {
        await _lock.WaitAsync();
        try
        {
            _publications.Add(publication);
        }
        finally
        {
            _lock.Release();
        }
    }

    public async Task UpdatePublicationAsync(Publication publication)
    {
        await _lock.WaitAsync();
        try
        {
            var index = _publications.FindIndex(p => p.Id == publication.Id);
            if (index >= 0)
            {
                _publications[index] = publication;
            }
        }
        finally
        {
            _lock.Release();
        }
    }

    public async Task DeletePublicationAsync(Guid id)
    {
        await _lock.WaitAsync();
        try
        {
            _publications.RemoveAll(p => p.Id == id);
        }
        finally
        {
            _lock.Release();
        }
    }
}

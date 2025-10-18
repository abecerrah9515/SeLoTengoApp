using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Back.SLTA.Application.DTOs;
using Back.SLTA.Application.Interfaces;
using Back.SLTA.Domain.Enums;
using Microsoft.AspNetCore.Mvc;

namespace Back.SLTA.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PublicationsController : ControllerBase
{
    private readonly IPublicationService _publicationService;

    public PublicationsController(IPublicationService publicationService)
    {
        _publicationService = publicationService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyCollection<PublicationDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAllAsync([FromQuery] PublicationType? type, CancellationToken cancellationToken)
    {
        if (type.HasValue)
        {
            var publicationsByType = await _publicationService.GetByTypeAsync(type.Value, cancellationToken);
            return Ok(publicationsByType);
        }

        var publications = await _publicationService.GetAllAsync(cancellationToken);
        return Ok(publications);
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(PublicationDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        var publication = await _publicationService.GetByIdAsync(id, cancellationToken);
        return publication is null ? NotFound() : Ok(publication);
    }

    [HttpPost]
    [ProducesResponseType(typeof(Guid), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateAsync([FromBody] CreatePublicationRequest request, CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        var publicationId = await _publicationService.CreateAsync(request, cancellationToken);
        var publication = await _publicationService.GetByIdAsync(publicationId, cancellationToken);
        return CreatedAtAction(nameof(GetByIdAsync), new { id = publicationId }, publication);
    }

    [HttpPut("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateAsync(Guid id, [FromBody] UpdatePublicationRequest request, CancellationToken cancellationToken)
    {
        if (id != request.Id)
        {
            ModelState.AddModelError(nameof(request.Id), "El identificador del cuerpo no coincide con el de la ruta");
        }

        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        try
        {
            await _publicationService.UpdateAsync(request, cancellationToken);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        await _publicationService.DeleteAsync(id, cancellationToken);
        return NoContent();
    }
}

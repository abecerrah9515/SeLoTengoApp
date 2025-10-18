using System;
using Back.SLTA.Domain.Enums;
using Back.SLTA.Domain.ValueObjects;

namespace Back.SLTA.Domain.Entities;

public sealed class Publication
{
    private Publication(Guid id,
        string title,
        string description,
        PublicationType type,
        UserProfile owner,
        string? imageUrl,
        Price? price,
        string? contactPhone,
        string? profileImageUrl)
    {
        Id = id == Guid.Empty ? Guid.NewGuid() : id;
        Title = string.IsNullOrWhiteSpace(title)
            ? throw new ArgumentException("El título es obligatorio", nameof(title))
            : title.Trim();
        Description = description?.Trim() ?? string.Empty;
        Type = type;
        Owner = owner ?? throw new ArgumentNullException(nameof(owner));
        ImageUrl = imageUrl?.Trim();
        Price = price;
        ContactPhone = contactPhone?.Trim();
        ProfileImageUrl = profileImageUrl?.Trim();
    }

    public Guid Id { get; }
    public string Title { get; private set; }
    public string Description { get; private set; }
    public PublicationType Type { get; private set; }
    public UserProfile Owner { get; private set; }
    public string? ImageUrl { get; private set; }
    public Price? Price { get; private set; }
    public string? ContactPhone { get; private set; }
    public string? ProfileImageUrl { get; private set; }

    public static Publication Create(string title,
        string description,
        PublicationType type,
        UserProfile owner,
        string? imageUrl = null,
        Price? price = null,
        string? contactPhone = null,
        string? profileImageUrl = null)
    {
        return new Publication(Guid.NewGuid(), title, description, type, owner, imageUrl, price, contactPhone, profileImageUrl);
    }

    public static Publication Restore(Guid id,
        string title,
        string description,
        PublicationType type,
        UserProfile owner,
        string? imageUrl,
        Price? price,
        string? contactPhone,
        string? profileImageUrl)
    {
        return new Publication(id, title, description, type, owner, imageUrl, price, contactPhone, profileImageUrl);
    }

    public void UpdateDetails(string title, string description, PublicationType type, string? imageUrl)
    {
        Title = string.IsNullOrWhiteSpace(title) ? throw new ArgumentException("El título es obligatorio", nameof(title)) : title.Trim();
        Description = description?.Trim() ?? string.Empty;
        Type = type;
        ImageUrl = imageUrl?.Trim();
    }

    public void UpdatePrice(Price? price)
    {
        Price = price;
    }

    public void UpdateOwner(UserProfile owner)
    {
        Owner = owner ?? throw new ArgumentNullException(nameof(owner));
    }

    public void UpdateContact(string? phone)
    {
        ContactPhone = phone?.Trim();
    }

    public void UpdateProfileImage(string? imageUrl)
    {
        ProfileImageUrl = imageUrl?.Trim();
    }
}

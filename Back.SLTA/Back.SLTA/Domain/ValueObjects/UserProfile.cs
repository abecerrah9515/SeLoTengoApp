using System;
using Back.SLTA.Domain.Abstractions;

namespace Back.SLTA.Domain.ValueObjects;

public sealed class UserProfile : ValueObject
{
    public string FullName { get; }
    public string Program { get; }

    private UserProfile(string fullName, string program)
    {
        if (string.IsNullOrWhiteSpace(fullName))
        {
            throw new ArgumentException("El nombre completo es obligatorio", nameof(fullName));
        }

        FullName = fullName.Trim();
        Program = program?.Trim() ?? string.Empty;
    }

    public static UserProfile Create(string fullName, string program) => new(fullName, program);

    protected override IEnumerable<object?> GetEqualityComponents()
    {
        yield return FullName;
        yield return Program;
    }
}

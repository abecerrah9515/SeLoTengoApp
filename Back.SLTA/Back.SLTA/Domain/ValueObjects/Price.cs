using System;
using Back.SLTA.Domain.Abstractions;

namespace Back.SLTA.Domain.ValueObjects;

public sealed class Price : ValueObject
{
    public decimal Amount { get; }
    public string Currency { get; }

    private Price(decimal amount, string currency)
    {
        if (amount < 0)
        {
            throw new ArgumentException("El monto no puede ser negativo", nameof(amount));
        }

        if (string.IsNullOrWhiteSpace(currency))
        {
            throw new ArgumentException("La moneda es obligatoria", nameof(currency));
        }

        Amount = decimal.Round(amount, 2, MidpointRounding.ToZero);
        Currency = currency.ToUpperInvariant();
    }

    public static Price Create(decimal amount, string currency) => new(amount, currency);

    public override string ToString() => $"{Currency} {Amount:0.##}";

    protected override IEnumerable<object?> GetEqualityComponents()
    {
        yield return Amount;
        yield return Currency;
    }
}

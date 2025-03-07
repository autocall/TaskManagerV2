﻿using Microsoft.EntityFrameworkCore.Query;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace TaskManager.Data.Extensions;
/// <summary>
///     Provides extension methods for executing patch updates on queryable sources. </summary>
public static class EFCoreExecutePatchUpdateExtensions {
    /// <summary>
    ///     Executes a patch update asynchronously on the given queryable source. </summary>
    public static Task<int> ExecutePatchUpdateAsync<TSource>(
        this IQueryable<TSource> source,
        Action<EFCoreSetPropertyBuilder<TSource>> setPropertyBuilder,
        CancellationToken ct = default) {
        var builder = new EFCoreSetPropertyBuilder<TSource>();
        setPropertyBuilder.Invoke(builder);
        return source.ExecuteUpdateAsync(builder.SetPropertyCalls, ct);
    }
}

/// <summary>
///     Helps in defining property updates for patch operations. </summary>
public class EFCoreSetPropertyBuilder<TSource> {
    /// <summary>
    ///     Holds the expressions defining the properties to be updated. </summary>
    public Expression<Func<SetPropertyCalls<TSource>, SetPropertyCalls<TSource>>> SetPropertyCalls { get; private set; } = b => b;

    public EFCoreSetPropertyBuilder<TSource> SetProperty<TProperty>(
        Expression<Func<TSource, TProperty>> propertyExpression, TProperty value) => setProperty(propertyExpression, _ => value);

    private EFCoreSetPropertyBuilder<TSource> setProperty<TProperty>(
        Expression<Func<TSource, TProperty>> propertyExpression,
        Expression<Func<TSource, TProperty>> valueExpression) {
        SetPropertyCalls = SetPropertyCalls.Update(
            body: Expression.Call(
                instance: SetPropertyCalls.Body,
                methodName: nameof(SetPropertyCalls<TSource>.SetProperty),
                typeArguments: new[] { typeof(TProperty) },
                arguments: new Expression[] {
                        propertyExpression,
                        valueExpression
                }
            ),
            parameters: SetPropertyCalls.Parameters
        );

        return this;
    }
}
using System.Linq.Expressions;
using LinqToDB.Linq;
using LinqToDB;
using System.Reflection;

namespace TaskManager.Data.Extensions;

public static class LinqToDbSetPropertyBuilder {
    public static IUpdatable<T> Set<T>(this IUpdatable<T> query, T source, PropertyInfo prop) {
        var value = prop.GetValue(source);

        var parameter = Expression.Parameter(typeof(T), "e");
        var property = Expression.Property(parameter, prop);
        var lambda = Expression.Lambda(property, parameter);

        var method = typeof(LinqExtensions).GetMethods()
            .Where(m => m.Name == "Set" && m.IsGenericMethod)
            .FirstOrDefault(m => {
                var parameters = m.GetParameters();
                return parameters.Length == 3 &&
                       parameters[0].ParameterType.GetGenericTypeDefinition() == typeof(IUpdatable<>) &&
                       parameters[1].ParameterType.GetGenericTypeDefinition() == typeof(Expression<>) &&
                       parameters[2].ParameterType.IsGenericParameter;
            });

        method = method.MakeGenericMethod(typeof(T), prop.PropertyType);
        return (IUpdatable<T>)method.Invoke(null, [query, lambda, value]);
    }
}
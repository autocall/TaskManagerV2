﻿using System.ComponentModel.DataAnnotations;

namespace TaskManager.Server.Infrastructure;
public class NotDefaultAttribute : ValidationAttribute {
    public override bool IsValid(object value) {
        if (value == null) return false;

        var type = value.GetType();
        var defaultValue = type.IsValueType ? Activator.CreateInstance(type) : null;

        return !value.Equals(defaultValue);
    }

    public override string FormatErrorMessage(string name) {
        return $"{name} must not be the default value.";
    }
}

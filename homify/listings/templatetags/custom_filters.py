from django import template

register = template.Library()

@register.filter
def underscore_to_space(value):
    if not isinstance(value, str):
        return value
    return value.replace("_", " ")

@register.filter
def display_value(value):
    """Return -- if value is None, 'null', or 'undefined'."""
    if value is None:
        return "--"
    if isinstance(value, str):
        if value.strip().lower() in ["null", "undefined", "none", ""]:
            return "--"
    return value
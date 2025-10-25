from django import template

try:
    from allauth.socialaccount.models import SocialApp
except Exception:
    SocialApp = None

register = template.Library()

@register.simple_tag
def has_social_app(provider: str) -> bool:
    """Return True if a SocialApp is configured for the given provider."""
    if SocialApp is None:
        return False
    return SocialApp.objects.filter(provider=provider).exists()

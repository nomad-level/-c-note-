from django.db import models
from django.conf import settings


class Note(models.Model):
    """Note model for storing code snippets and notes with optional image attachments."""
    
    # Suggested categories for dropdown
    SUGGESTED_CATEGORIES = [
        'Python', 'JavaScript', 'HTML', 'CSS', 'React', 
        'Django', 'Node.js', 'SQL', 'Git', 'General', 'Other'
    ]
    
    title = models.CharField(max_length=200)
    body = models.TextField(help_text="Your code snippet or note content")
    category = models.CharField(
        max_length=50, 
        default='General',
        help_text="Enter any category (e.g., Python, JavaScript, etc.)"
    )
    image = models.ImageField(
        upload_to='note_images/', 
        blank=True, 
        null=True, 
        help_text="Optional: attach an image or screenshot"
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notes',
        null=True,
        blank=True,
        help_text="Owner of this note (nullable for legacy records)"
    )
    date_created = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-date_created']
    
    def __str__(self):
        return self.title

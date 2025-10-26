from django.db import models
from django.conf import settings


class Note(models.Model):
    """
    Note model for storing code snippets and notes.
    Keeps the simple structure from the original but adds image support.
    """
    CATEGORY_CHOICES = [
        ('python', 'Python'),
        ('javascript', 'JavaScript'),
        ('html', 'HTML'),
        ('css', 'CSS'),
        ('react', 'React'),
        ('django', 'Django'),
        ('nodejs', 'Node.js'),
        ('sql', 'SQL'),
        ('git', 'Git'),
        ('general', 'General'),
        ('other', 'Other'),
    ]
    
    title = models.CharField(max_length=200)
    body = models.TextField(help_text="Your code snippet or note content")
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='general')
    image = models.ImageField(upload_to='note_images/', blank=True, null=True, 
                             help_text="Optional: attach an image or screenshot")
    # New ownership model: real FK to authenticated user
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notes',
        null=True,
        blank=True,
        help_text="Owner of this note; nullable during migration"
    )
    # Legacy field kept temporarily for backward compatibility during migration
    session_id = models.CharField(max_length=100, blank=True, null=True,
                                  help_text="[Legacy] Pre-migration cookie-based ownership")
    date_created = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-date_created']
    
    def __str__(self):
        return self.title

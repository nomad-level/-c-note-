from django.contrib import admin
from .models import Note


@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'date_created', 'session_id']
    list_filter = ['category', 'date_created']
    search_fields = ['title', 'body']
    date_hierarchy = 'date_created'

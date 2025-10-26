from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from .models import Note
from .forms import NoteForm
import uuid


def home(request):
    """Landing page that redirects authenticated users to notes."""
    if request.user.is_authenticated:
        return redirect('note_list')
    return render(request, 'notes/home.html')


@login_required
def note_list(request):
    """Display list of current user's notes with optional category filtering. Requires authentication."""
    # Scope notes to the authenticated user
    notes = Note.objects.filter(user=request.user)
    
    # Apply category filter
    category = request.GET.get('category')
    if category:
        notes = notes.filter(category=category)

    # Apply title search filter
    q = request.GET.get('q', '').strip()
    if q:
        notes = notes.filter(Q(title__icontains=q) | Q(body__icontains=q))
    
    # "My Notes" checkbox is now redundant since notes are already user-scoped
    my_notes = request.GET.get('my_notes')
    
    context = {
        'notes': notes,
        'categories': Note.CATEGORY_CHOICES,
        'selected_category': category,
        'show_my_notes': my_notes,
        'session_id': None,
        'q': q,
    }
    
    return render(request, 'notes/note_list.html', context)


@login_required
def note_detail(request, pk):
    """Display a single note with edit/delete controls for owner. Requires authentication."""
    note = get_object_or_404(Note, pk=pk, user=request.user)
    
    # Owner check now uses user relationship
    is_owner = (note.user_id == request.user.id)
    
    context = {
        'note': note,
        'is_owner': is_owner,
    }
    
    return render(request, 'notes/note_detail.html', context)


@login_required
def note_create(request):
    """Create a new note. Requires authentication."""
    if request.method == 'POST':
        form = NoteForm(request.POST, request.FILES)
        if form.is_valid():
            note = form.save(commit=False)
            
            # Associate note with the authenticated user
            note.user = request.user
            note.save()
            
            messages.success(request, 'Your note has been created successfully!')
            return redirect('note_detail', pk=note.pk)
    else:
        form = NoteForm()
    
    return render(request, 'notes/note_create.html', {'form': form})


@login_required
def note_edit(request, pk):
    """Edit an existing note. Requires authentication."""
    note = get_object_or_404(Note, pk=pk, user=request.user)
    
    if request.method == 'POST':
        form = NoteForm(request.POST, request.FILES, instance=note)
        if form.is_valid():
            form.save()
            messages.success(request, 'Your note has been updated successfully!')
            return redirect('note_detail', pk=note.pk)
    else:
        form = NoteForm(instance=note)

    return render(request, 'notes/note_edit.html', {'form': form, 'note': note})


@login_required
def note_delete(request, pk):
    """Delete a note. Requires authentication."""
    note = get_object_or_404(Note, pk=pk, user=request.user)
    
    if request.method == 'POST':
        note.delete()
        messages.success(request, 'Note has been deleted successfully!')
        return redirect('note_list')
    
    return redirect('note_detail', pk=pk)

from django import forms
from .models import Note


class NoteForm(forms.ModelForm):
    # Add a separate field for custom category input
    custom_category = forms.CharField(
        required=False,
        widget=forms.TextInput(attrs={
            'class': 'form-control mt-2',
            'placeholder': 'Enter custom category...',
            'id': 'id_custom_category'
        })
    )
    
    class Meta:
        model = Note
        fields = ['title', 'category', 'body', 'image']
        widgets = {
            'title': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Enter note title'
            }),
            'category': forms.Select(attrs={
                'class': 'form-select',
                'id': 'id_category',
                'onchange': 'toggleCustomCategory()'
            }),
            'body': forms.Textarea(attrs={
                'class': 'form-control',
                'rows': 10,
                'placeholder': 'Paste your code snippet or notes here...',
                'style': 'font-family: monospace;'
            }),
            'image': forms.FileInput(attrs={
                'class': 'form-control',
                'accept': 'image/*'
            }),
        }
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Build choices dynamically from SUGGESTED_CATEGORIES + "Other"
        choices = [('', 'Select a category...')] + [(cat, cat) for cat in Note.SUGGESTED_CATEGORIES] + [('__custom__', 'Other (Custom)')]
        self.fields['category'].widget.choices = choices
        
        # If editing and category is not in suggestions, pre-select "Other" and populate custom field
        if self.instance.pk and self.instance.category not in Note.SUGGESTED_CATEGORIES:
            self.fields['category'].initial = '__custom__'
            self.fields['custom_category'].initial = self.instance.category
    
    def clean(self):
        cleaned_data = super().clean()
        category = cleaned_data.get('category')
        custom_category = cleaned_data.get('custom_category', '').strip()
        
        # If "Other (Custom)" is selected, use the custom_category value
        if category == '__custom__':
            if not custom_category:
                raise forms.ValidationError('Please enter a custom category or select from the list.')
            cleaned_data['category'] = custom_category
        
        return cleaned_data

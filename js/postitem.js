// JavaScript for postitem.html
// Handles item posting functionality

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initializePostItem();
    setupFormValidation();
});

// Initialize post item page
function initializePostItem() {
    console.log('Post Item page initialized');
    
    // Focus on first input
    const firstInput = document.getElementById('item-name');
    if (firstInput) {
        firstInput.focus();
    }
}

// Setup form validation and submission
function setupFormValidation() {
    const form = document.getElementById('post-item-form');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        handleFormSubmission();
    });
    
    // Real-time validation
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

// Handle form submission
function handleFormSubmission() {
    const form = document.getElementById('post-item-form');
    const formData = new FormData(form);
    
    // Validate all fields
    if (!validateForm()) {
        showNotification('Please fix the errors in the form', 'error');
        return;
    }
    
    // Create item object
    const itemData = {
        name: formData.get('name').trim(),
        description: formData.get('description').trim(),
        price: parseFloat(formData.get('price')),
        category: formData.get('category'),
        condition: formData.get('condition'),
        imageUrl: formData.get('imageUrl').trim() || null,
        contact: formData.get('contact').trim()
    };
    
    // Add item to storage
    try {
        const newItem = addItem(itemData);
        showSuccessModal();
        
        // Reset form
        form.reset();
        
        console.log('Item posted successfully:', newItem);
    } catch (error) {
        console.error('Error posting item:', error);
        showNotification('Error posting item. Please try again.', 'error');
    }
}

// Validate entire form
function validateForm() {
    const form = document.getElementById('post-item-form');
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Clear previous errors
    clearFieldError(field);
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        errorMessage = 'This field is required';
        isValid = false;
    }
    
    // Specific field validations
    switch (field.name) {
        case 'name':
            if (value && value.length < 3) {
                errorMessage = 'Item name must be at least 3 characters';
                isValid = false;
            } else if (value && value.length > 100) {
                errorMessage = 'Item name must be less than 100 characters';
                isValid = false;
            }
            break;
            
        case 'price':
            const price = parseFloat(value);
            if (value && (isNaN(price) || price < 0)) {
                errorMessage = 'Please enter a valid price';
                isValid = false;
            } else if (price > 10000) {
                errorMessage = 'Price seems too high. Please verify.';
                isValid = false;
            }
            break;
            
        case 'description':
            if (value && value.length < 10) {
                errorMessage = 'Description must be at least 10 characters';
                isValid = false;
            } else if (value && value.length > 1000) {
                errorMessage = 'Description must be less than 1000 characters';
                isValid = false;
            }
            break;
            
        case 'imageUrl':
            if (value && !isValidUrl(value)) {
                errorMessage = 'Please enter a valid URL';
                isValid = false;
            }
            break;
            
        case 'contact':
            if (value && !isValidContact(value)) {
                errorMessage = 'Please enter a valid email or phone number';
                isValid = false;
            }
            break;
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

// Show field error
function showFieldError(field, message) {
    field.classList.add('error');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #ef4444;
        font-size: 0.8rem;
        margin-top: 0.25rem;
    `;
    
    field.parentNode.appendChild(errorDiv);
    
    // Add error styles to field
    field.style.borderColor = '#ef4444';
}

// Clear field error
function clearFieldError(field) {
    field.classList.remove('error');
    field.style.borderColor = '';
    
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

// Validate URL
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// Validate contact information
function isValidContact(contact) {
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(contact)) {
        return true;
    }
    
    // Phone validation (basic)
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = contact.replace(/[\s\-\(\)]/g, '');
    if (phoneRegex.test(cleanPhone)) {
        return true;
    }
    
    // Allow other contact methods (username, etc.)
    if (contact.length >= 3) {
        return true;
    }
    
    return false;
}

// Reset form
function resetForm() {
    const form = document.getElementById('post-item-form');
    if (form) {
        form.reset();
        
        // Clear all errors
        const errorMessages = form.querySelectorAll('.error-message');
        errorMessages.forEach(error => error.remove());
        
        const errorFields = form.querySelectorAll('.error');
        errorFields.forEach(field => {
            field.classList.remove('error');
            field.style.borderColor = '';
        });
        
        // Focus on first input
        const firstInput = document.getElementById('item-name');
        if (firstInput) {
            firstInput.focus();
        }
        
        showNotification('Form reset successfully');
    }
}

// Show success modal
function showSuccessModal() {
    const modal = document.getElementById('success-modal');
    if (modal) {
        modal.style.display = 'block';
    }
}

// Close success modal
function closeSuccessModal() {
    const modal = document.getElementById('success-modal');
    if (modal) {
        modal.style.display = 'none';
    }
    
    // Redirect to view items
    window.location.href = 'viewitems.html';
}

// Post another item
function postAnother() {
    const modal = document.getElementById('success-modal');
    if (modal) {
        modal.style.display = 'none';
    }
    
    // Reset form for new item
    resetForm();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Auto-resize textarea
document.addEventListener('input', function(e) {
    if (e.target.tagName === 'TEXTAREA') {
        e.target.style.height = 'auto';
        e.target.style.height = e.target.scrollHeight + 'px';
    }
});

// Preview image URL
document.addEventListener('input', function(e) {
    if (e.target.id === 'item-image') {
        const url = e.target.value.trim();
        const preview = document.getElementById('image-preview');
        
        if (!preview) {
            // Create preview element
            const previewDiv = document.createElement('div');
            previewDiv.id = 'image-preview';
            previewDiv.style.cssText = `
                margin-top: 0.5rem;
                border-radius: 8px;
                overflow: hidden;
                max-width: 200px;
                display: none;
            `;
            e.target.parentNode.appendChild(previewDiv);
        }
        
        if (url && isValidUrl(url)) {
            const img = document.createElement('img');
            img.src = url;
            img.style.cssText = `
                width: 100%;
                height: auto;
                max-height: 150px;
                object-fit: cover;
            `;
            img.onload = function() {
                const preview = document.getElementById('image-preview');
                preview.innerHTML = '';
                preview.appendChild(img);
                preview.style.display = 'block';
            };
            img.onerror = function() {
                const preview = document.getElementById('image-preview');
                preview.style.display = 'none';
            };
        } else {
            const preview = document.getElementById('image-preview');
            if (preview) {
                preview.style.display = 'none';
            }
        }
    }
});

// Character counter for description
document.addEventListener('input', function(e) {
    if (e.target.id === 'item-description') {
        const maxLength = 1000;
        const currentLength = e.target.value.length;
        
        let counter = document.getElementById('description-counter');
        if (!counter) {
            counter = document.createElement('div');
            counter.id = 'description-counter';
            counter.style.cssText = `
                font-size: 0.8rem;
                color: #666;
                text-align: right;
                margin-top: 0.25rem;
            `;
            e.target.parentNode.appendChild(counter);
        }
        
        counter.textContent = `${currentLength}/${maxLength}`;
        
        if (currentLength > maxLength * 0.9) {
            counter.style.color = '#ef4444';
        } else {
            counter.style.color = '#666';
        }
    }
});
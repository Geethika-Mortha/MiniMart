// JavaScript for viewitems.html
// Handles item browsing, filtering, and searching functionality

let filteredItems = [];
let currentFilter = {
    category: '',
    search: '',
    sort: 'newest'
};

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initializeViewItems();
    setupEventListeners();
    loadAndDisplayItems();
    
    // Check for URL parameters
    const categoryParam = getUrlParameter('category');
    const itemParam = getUrlParameter('item');
    
    if (categoryParam) {
        document.getElementById('category-filter').value = categoryParam;
        currentFilter.category = categoryParam;
    }
    
    if (itemParam) {
        showItemModal(itemParam);
    }
    
    filterItems();
});

// Initialize view items page
function initializeViewItems() {
    console.log('View Items page initialized');
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchItems();
            }
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('item-modal');
        if (e.target === modal) {
            closeModal();
        }
    });
}

// Load and display items
function loadAndDisplayItems() {
    const items = loadItems();
    filteredItems = items.filter(item => item.status === 'active');
    displayItems(filteredItems);
    updateItemsCount(filteredItems.length);
}

// Search items
function searchItems() {
    const searchInput = document.getElementById('search-input');
    const searchTerm = searchInput.value.toLowerCase().trim();
    currentFilter.search = searchTerm;
    filterItems();
}

// Filter items
function filterItems() {
    const allItems = loadItems().filter(item => item.status === 'active');
    
    filteredItems = allItems.filter(item => {
        // Category filter
        if (currentFilter.category && item.category !== currentFilter.category) {
            return false;
        }
        
        // Search filter
        if (currentFilter.search) {
            const searchTerm = currentFilter.search.toLowerCase();
            return (
                item.name.toLowerCase().includes(searchTerm) ||
                item.description.toLowerCase().includes(searchTerm) ||
                item.category.toLowerCase().includes(searchTerm)
            );
        }
        
        return true;
    });
    
    sortItems();
}

// Sort items
function sortItems() {
    const sortFilter = document.getElementById('sort-filter');
    if (sortFilter) {
        currentFilter.sort = sortFilter.value;
    }
    
    switch (currentFilter.sort) {
        case 'newest':
            filteredItems.sort((a, b) => new Date(b.datePosted) - new Date(a.datePosted));
            break;
        case 'oldest':
            filteredItems.sort((a, b) => new Date(a.datePosted) - new Date(b.datePosted));
            break;
        case 'price-low':
            filteredItems.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredItems.sort((a, b) => b.price - a.price);
            break;
    }
    
    displayItems(filteredItems);
    updateItemsCount(filteredItems.length);
}

// Clear filters
function clearFilters() {
    document.getElementById('search-input').value = '';
    document.getElementById('category-filter').value = '';
    document.getElementById('sort-filter').value = 'newest';
    
    currentFilter = {
        category: '',
        search: '',
        sort: 'newest'
    };
    
    loadAndDisplayItems();
}

// Display items
function displayItems(items) {
    const itemsContainer = document.getElementById('items-container');
    const noItemsDiv = document.getElementById('no-items');
    
    if (!itemsContainer) return;
    
    if (items.length === 0) {
        itemsContainer.innerHTML = '';
        if (noItemsDiv) {
            noItemsDiv.style.display = 'block';
        }
        return;
    }
    
    if (noItemsDiv) {
        noItemsDiv.style.display = 'none';
    }
    
    itemsContainer.innerHTML = items.map(item => createItemCard(item)).join('');
}

// Update items count
function updateItemsCount(count) {
    const itemsCountElement = document.getElementById('items-count');
    if (itemsCountElement) {
        itemsCountElement.textContent = count;
    }
}

// Show item modal
function showItemModal(itemId) {
    const item = getItemById(itemId);
    if (!item) {
        showNotification('Item not found', 'error');
        return;
    }
    
    const modal = document.getElementById('item-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    
    if (!modal || !modalTitle || !modalBody) return;
    
    modalTitle.textContent = item.name;
    modalBody.innerHTML = createItemModalContent(item);
    modal.style.display = 'block';
    
    // Update URL without page reload
    const newUrl = new URL(window.location);
    newUrl.searchParams.set('item', itemId);
    window.history.pushState({}, '', newUrl);
}

// Create item modal content
function createItemModalContent(item) {
    return `
        <div class="modal-item-details">
            <div class="modal-item-image">
                ${item.imageUrl ? 
                    `<img src="${item.imageUrl}" alt="${item.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                     <div class="placeholder" style="display: none;">
                         <i class="fas fa-image"></i>
                         <p>No image available</p>
                     </div>` :
                    `<div class="placeholder">
                         <i class="fas fa-image"></i>
                         <p>No image available</p>
                     </div>`
                }
            </div>
            <div class="modal-item-info">
                <div class="item-price-large">${formatPrice(item.price)}</div>
                <div class="item-category-badge">${item.category}</div>
                <div class="item-condition-badge">${item.condition}</div>
                
                <div class="item-description-full">
                    <h4>Description</h4>
                    <p>${item.description}</p>
                </div>
                
                <div class="item-details-grid">
                    <div class="detail-item">
                        <i class="fas fa-calendar"></i>
                        <span>Posted ${formatDate(item.datePosted)}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-tag"></i>
                        <span>${item.category}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-star"></i>
                        <span>${item.condition}</span>
                    </div>
                </div>
                
                <div class="contact-section">
                    <h4>Contact Seller</h4>
                    <div class="contact-info">
                        <i class="fas fa-envelope"></i>
                        <span>${item.contact}</span>
                    </div>
                    <button class="btn btn-primary" onclick="contactSeller('${item.contact}', '${item.name}')">
                        <i class="fas fa-envelope"></i>
                        Contact Seller
                    </button>
                </div>
            </div>
        </div>
        
        <style>
            .modal-item-details {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 2rem;
                align-items: start;
            }
            
            .modal-item-image {
                width: 100%;
                height: 300px;
                border-radius: 10px;
                overflow: hidden;
                background: #f8f9ff;
            }
            
            .modal-item-image img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            
            .modal-item-image .placeholder {
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                color: #999;
            }
            
            .modal-item-image .placeholder i {
                font-size: 3rem;
                margin-bottom: 1rem;
            }
            
            .item-price-large {
                font-size: 2rem;
                font-weight: 700;
                color: #667eea;
                margin-bottom: 1rem;
            }
            
            .item-category-badge,
            .item-condition-badge {
                display: inline-block;
                padding: 0.25rem 0.75rem;
                border-radius: 15px;
                font-size: 0.8rem;
                font-weight: 500;
                margin-right: 0.5rem;
                margin-bottom: 1rem;
            }
            
            .item-category-badge {
                background: rgba(102, 126, 234, 0.1);
                color: #667eea;
            }
            
            .item-condition-badge {
                background: rgba(34, 197, 94, 0.1);
                color: #22c55e;
            }
            
            .item-description-full {
                margin-bottom: 1.5rem;
            }
            
            .item-description-full h4 {
                font-size: 1.1rem;
                font-weight: 600;
                color: #333;
                margin-bottom: 0.5rem;
            }
            
            .item-description-full p {
                color: #666;
                line-height: 1.6;
            }
            
            .item-details-grid {
                display: grid;
                gap: 0.75rem;
                margin-bottom: 1.5rem;
            }
            
            .detail-item {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                color: #666;
                font-size: 0.9rem;
            }
            
            .detail-item i {
                color: #667eea;
                width: 16px;
            }
            
            .contact-section {
                border-top: 1px solid #e5e7eb;
                padding-top: 1.5rem;
            }
            
            .contact-section h4 {
                font-size: 1.1rem;
                font-weight: 600;
                color: #333;
                margin-bottom: 1rem;
            }
            
            .contact-info {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                margin-bottom: 1rem;
                padding: 0.75rem;
                background: #f8f9ff;
                border-radius: 8px;
                color: #666;
            }
            
            .contact-info i {
                color: #667eea;
            }
            
            @media (max-width: 768px) {
                .modal-item-details {
                    grid-template-columns: 1fr;
                    gap: 1rem;
                }
                
                .modal-item-image {
                    height: 250px;
                }
            }
        </style>
    `;
}

// Contact seller
function contactSeller(contact, itemName) {
    const subject = encodeURIComponent(`Interested in: ${itemName}`);
    const body = encodeURIComponent(`Hi! I'm interested in your item "${itemName}" that you posted on MiniMart. Is it still available?`);
    
    if (contact.includes('@')) {
        // Email contact
        window.open(`mailto:${contact}?subject=${subject}&body=${body}`);
    } else {
        // Copy contact info to clipboard
        navigator.clipboard.writeText(contact).then(() => {
            showNotification('Contact information copied to clipboard!');
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = contact;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showNotification('Contact information copied to clipboard!');
        });
    }
}

// Close modal
function closeModal() {
    const modal = document.getElementById('item-modal');
    if (modal) {
        modal.style.display = 'none';
        
        // Remove item parameter from URL
        const newUrl = new URL(window.location);
        newUrl.searchParams.delete('item');
        window.history.pushState({}, '', newUrl);
    }
}

// Override the global viewItemDetails function for this page
window.viewItemDetails = function(itemId) {
    showItemModal(itemId);
};

// Handle category filter change
document.addEventListener('change', function(e) {
    if (e.target.id === 'category-filter') {
        currentFilter.category = e.target.value;
        filterItems();
    }
});
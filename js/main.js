// Main JavaScript file for MiniMart
// This file contains common functionality used across all pages

// Global variables
let items = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadItems();
    setupNavigation();
});

// Initialize application
function initializeApp() {
    console.log('MiniMart initialized successfully!');
    
    // Add some sample data if localStorage is empty
    if (!localStorage.getItem('minimart_items')) {
        initializeSampleData();
    }
}

// Setup navigation functionality
function setupNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }
}

// Load items from localStorage
function loadItems() {
    const storedItems = localStorage.getItem('minimart_items');
    if (storedItems) {
        items = JSON.parse(storedItems);
    }
    return items;
}

// Save items to localStorage
function saveItems() {
    localStorage.setItem('minimart_items', JSON.stringify(items));
}

// Add a new item
function addItem(itemData) {
    const newItem = {
        id: generateId(),
        ...itemData,
        datePosted: new Date().toISOString(),
        status: 'active'
    };
    
    items.unshift(newItem); // Add to beginning of array
    saveItems();
    return newItem;
}

// Update item status
function updateItemStatus(itemId, status) {
    const itemIndex = items.findIndex(item => item.id === itemId);
    if (itemIndex !== -1) {
        items[itemIndex].status = status;
        saveItems();
        return true;
    }
    return false;
}

// Delete an item
function deleteItem(itemId) {
    const itemIndex = items.findIndex(item => item.id === itemId);
    if (itemIndex !== -1) {
        items.splice(itemIndex, 1);
        saveItems();
        return true;
    }
    return false;
}

// Get item by ID
function getItemById(itemId) {
    return items.find(item => item.id === itemId);
}

// Filter items by category
function filterByCategory(category) {
    window.location.href = `viewitems.html?category=${encodeURIComponent(category)}`;
}

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
        return 'Yesterday';
    } else if (diffDays < 7) {
        return `${diffDays} days ago`;
    } else {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
}

// Format price for display
function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
}

// Truncate text
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Show notification
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS for notifications
const notificationStyles = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
`;

// Add styles to head
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// Initialize sample data
function initializeSampleData() {
    const sampleItems = [
        {
            id: 'sample1',
            name: 'iPhone 12 Pro',
            description: 'Excellent condition iPhone 12 Pro, 128GB, Space Gray. Includes original box, charger, and screen protector. Battery health at 89%. Perfect for students!',
            price: 650,
            category: 'Electronics',
            condition: 'Like New',
            imageUrl: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg',
            contact: 'john.doe@email.com',
            datePosted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'active'
        },
        {
            id: 'sample2',
            name: 'Calculus Textbook - Stewart 8th Edition',
            description: 'Essential Calculus textbook by James Stewart, 8th edition. Used for one semester, minimal highlighting. Great condition with all pages intact. Perfect for Calc I and II.',
            price: 120,
            category: 'Books',
            condition: 'Good',
            imageUrl: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg',
            contact: 'sarah.student@email.com',
            datePosted: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'active'
        },
        {
            id: 'sample3',
            name: 'MacBook Air M1',
            description: 'MacBook Air with M1 chip, 8GB RAM, 256GB SSD. Purchased last year, barely used. Comes with original charger and box. Perfect for coding and design work.',
            price: 850,
            category: 'Electronics',
            condition: 'Like New',
            imageUrl: 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg',
            contact: 'mike.tech@email.com',
            datePosted: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'active'
        },
        {
            id: 'sample4',
            name: 'Nike Air Force 1 - Size 10',
            description: 'Classic white Nike Air Force 1 sneakers, size 10. Worn a few times, still in great condition. Perfect for everyday wear or sports activities.',
            price: 75,
            category: 'Accessories',
            condition: 'Good',
            imageUrl: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg',
            contact: 'alex.shoes@email.com',
            datePosted: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'active'
        },
        {
            id: 'sample5',
            name: 'Gaming Chair - Ergonomic',
            description: 'Comfortable gaming chair with lumbar support and adjustable height. Black and red design. Used for 6 months, still in excellent condition. Great for long study sessions.',
            price: 180,
            category: 'Others',
            condition: 'Good',
            imageUrl: 'https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg',
            contact: 'gamer.student@email.com',
            datePosted: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'active'
        },
        {
            id: 'sample6',
            name: 'Chemistry Lab Manual',
            description: 'General Chemistry Lab Manual, 3rd edition. Required for Chem 101 lab. All experiments completed, but book is still in good condition with clear instructions.',
            price: 45,
            category: 'Books',
            condition: 'Fair',
            imageUrl: 'https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg',
            contact: 'chem.student@email.com',
            datePosted: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'sold'
        }
    ];
    
    items = sampleItems;
    saveItems();
}

// Load recent items for homepage
function loadRecentItems() {
    const recentItemsContainer = document.getElementById('recent-items-container');
    if (!recentItemsContainer) return;
    
    const recentItems = items
        .filter(item => item.status === 'active')
        .sort((a, b) => new Date(b.datePosted) - new Date(a.datePosted))
        .slice(0, 3);
    
    if (recentItems.length === 0) {
        recentItemsContainer.innerHTML = `
            <div class="no-items">
                <i class="fas fa-box-open"></i>
                <h3>No items available</h3>
                <p>Be the first to post an item!</p>
                <a href="postitem.html" class="btn btn-primary">
                    <i class="fas fa-plus"></i>
                    Post First Item
                </a>
            </div>
        `;
        return;
    }
    
    recentItemsContainer.innerHTML = recentItems.map(item => createItemCard(item)).join('');
}

// Create item card HTML
function createItemCard(item) {
    return `
        <div class="item-card" onclick="viewItemDetails('${item.id}')">
            <div class="item-image">
                ${item.imageUrl ? 
                    `<img src="${item.imageUrl}" alt="${item.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                     <div class="placeholder" style="display: none;">
                         <i class="fas fa-image"></i>
                     </div>` :
                    `<div class="placeholder">
                         <i class="fas fa-image"></i>
                     </div>`
                }
                <div class="item-status status-${item.status}">
                    ${item.status === 'active' ? 'Available' : 'Sold'}
                </div>
            </div>
            <div class="item-content">
                <h3 class="item-title">${item.name}</h3>
                <div class="item-price">${formatPrice(item.price)}</div>
                <div class="item-category">${item.category}</div>
                <p class="item-description">${truncateText(item.description, 100)}</p>
                <div class="item-meta">
                    <span class="item-condition">${item.condition}</span>
                    <span class="item-date">${formatDate(item.datePosted)}</span>
                </div>
            </div>
        </div>
    `;
}

// View item details
function viewItemDetails(itemId) {
    window.location.href = `viewitems.html?item=${itemId}`;
}

// Export data (for admin)
function exportData() {
    const dataStr = JSON.stringify(items, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `minimart-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showNotification('Data exported successfully!');
}

// Clear all data (for admin)
function clearAllData() {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
        items = [];
        saveItems();
        showNotification('All data cleared successfully!');
        
        // Refresh current page
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }
}

// Get URL parameters
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Initialize page-specific functionality
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        // Load recent items on homepage
        if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
            loadRecentItems();
        }
    });
} else {
    // Load recent items on homepage
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        loadRecentItems();
    }
}
// JavaScript for admin.html
// Handles admin panel functionality

let currentAction = null;
let currentItemId = null;

// Initialize admin page
document.addEventListener('DOMContentLoaded', function() {
    initializeAdmin();
    loadAdminData();
    setupAdminEventListeners();
});

// Initialize admin panel
function initializeAdmin() {
    console.log('Admin panel initialized');
    updateAdminStats();
}

// Setup event listeners
function setupAdminEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('admin-search');
    if (searchInput) {
        searchInput.addEventListener('keyup', function() {
            searchAdminItems();
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('confirm-modal');
        if (e.target === modal) {
            closeConfirmModal();
        }
    });
}

// Load admin data
function loadAdminData() {
    loadAdminItems();
    updateAdminStats();
}

// Update admin statistics
function updateAdminStats() {
    const items = loadItems();
    const activeItems = items.filter(item => item.status === 'active');
    const soldItems = items.filter(item => item.status === 'sold');
    const totalValue = items.reduce((sum, item) => sum + item.price, 0);
    
    // Update stat cards
    document.getElementById('total-items').textContent = items.length;
    document.getElementById('active-items').textContent = activeItems.length;
    document.getElementById('sold-items').textContent = soldItems.length;
    document.getElementById('total-value').textContent = formatPrice(totalValue);
}

// Load admin items table
function loadAdminItems() {
    const items = loadItems();
    displayAdminItems(items);
}

// Filter admin items
function filterAdminItems() {
    const filterValue = document.getElementById('admin-filter').value;
    const items = loadItems();
    
    let filteredItems = items;
    
    if (filterValue === 'active') {
        filteredItems = items.filter(item => item.status === 'active');
    } else if (filterValue === 'sold') {
        filteredItems = items.filter(item => item.status === 'sold');
    }
    
    displayAdminItems(filteredItems);
}

// Search admin items
function searchAdminItems() {
    const searchTerm = document.getElementById('admin-search').value.toLowerCase();
    const filterValue = document.getElementById('admin-filter').value;
    const items = loadItems();
    
    let filteredItems = items;
    
    // Apply status filter
    if (filterValue === 'active') {
        filteredItems = items.filter(item => item.status === 'active');
    } else if (filterValue === 'sold') {
        filteredItems = items.filter(item => item.status === 'sold');
    }
    
    // Apply search filter
    if (searchTerm) {
        filteredItems = filteredItems.filter(item =>
            item.name.toLowerCase().includes(searchTerm) ||
            item.description.toLowerCase().includes(searchTerm) ||
            item.category.toLowerCase().includes(searchTerm) ||
            item.contact.toLowerCase().includes(searchTerm)
        );
    }
    
    displayAdminItems(filteredItems);
}

// Display admin items
function displayAdminItems(items) {
    const tableBody = document.getElementById('admin-items-table');
    const noItemsDiv = document.getElementById('admin-no-items');
    
    if (!tableBody) return;
    
    if (items.length === 0) {
        tableBody.innerHTML = '';
        if (noItemsDiv) {
            noItemsDiv.style.display = 'block';
        }
        return;
    }
    
    if (noItemsDiv) {
        noItemsDiv.style.display = 'none';
    }
    
    tableBody.innerHTML = items.map(item => createAdminItemRow(item)).join('');
}

// Create admin item row
function createAdminItemRow(item) {
    const statusClass = item.status === 'active' ? 'status-active' : 'status-sold';
    const statusText = item.status === 'active' ? 'Active' : 'Sold';
    
    return `
        <tr>
            <td>
                <div class="item-info">
                    <div class="item-name">${item.name}</div>
                    <div class="item-description-short">${truncateText(item.description, 50)}</div>
                </div>
            </td>
            <td>
                <span class="category-badge">${item.category}</span>
            </td>
            <td class="item-price">${formatPrice(item.price)}</td>
            <td>
                <span class="status-badge ${statusClass}">${statusText}</span>
            </td>
            <td class="item-date">${formatDate(item.datePosted)}</td>
            <td>
                <div class="item-actions">
                    ${item.status === 'active' ? 
                        `<button class="action-btn sold" onclick="markAsSold('${item.id}')" title="Mark as Sold">
                            <i class="fas fa-check"></i>
                        </button>` : ''
                    }
                    <button class="action-btn delete" onclick="confirmDeleteItem('${item.id}')" title="Delete Item">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `;
}

// Mark item as sold
function markAsSold(itemId) {
    if (updateItemStatus(itemId, 'sold')) {
        showNotification('Item marked as sold successfully!');
        loadAdminData();
    } else {
        showNotification('Error updating item status', 'error');
    }
}

// Confirm delete item
function confirmDeleteItem(itemId) {
    const item = getItemById(itemId);
    if (!item) return;
    
    currentAction = 'delete';
    currentItemId = itemId;
    
    const modal = document.getElementById('confirm-modal');
    const title = document.getElementById('confirm-title');
    const message = document.getElementById('confirm-message');
    const button = document.getElementById('confirm-button');
    
    title.textContent = 'Delete Item';
    message.textContent = `Are you sure you want to delete "${item.name}"? This action cannot be undone.`;
    button.textContent = 'Delete';
    button.className = 'btn btn-danger';
    
    modal.style.display = 'block';
}

// Refresh data
function refreshData() {
    loadAdminData();
    showNotification('Data refreshed successfully!');
}

// Clear sold items
function clearSoldItems() {
    currentAction = 'clearSold';
    currentItemId = null;
    
    const soldItems = loadItems().filter(item => item.status === 'sold');
    
    if (soldItems.length === 0) {
        showNotification('No sold items to clear', 'error');
        return;
    }
    
    const modal = document.getElementById('confirm-modal');
    const title = document.getElementById('confirm-title');
    const message = document.getElementById('confirm-message');
    const button = document.getElementById('confirm-button');
    
    title.textContent = 'Clear Sold Items';
    message.textContent = `Are you sure you want to remove all ${soldItems.length} sold items? This action cannot be undone.`;
    button.textContent = 'Clear All';
    button.className = 'btn btn-danger';
    
    modal.style.display = 'block';
}

// Clear all data
function clearAllData() {
    currentAction = 'clearAll';
    currentItemId = null;
    
    const modal = document.getElementById('confirm-modal');
    const title = document.getElementById('confirm-title');
    const message = document.getElementById('confirm-message');
    const button = document.getElementById('confirm-button');
    
    title.textContent = 'Clear All Data';
    message.textContent = 'Are you sure you want to delete ALL items? This will permanently remove everything and cannot be undone.';
    button.textContent = 'Delete All';
    button.className = 'btn btn-danger';
    
    modal.style.display = 'block';
}

// Confirm action
function confirmAction() {
    switch (currentAction) {
        case 'delete':
            if (currentItemId && deleteItem(currentItemId)) {
                showNotification('Item deleted successfully!');
                loadAdminData();
            } else {
                showNotification('Error deleting item', 'error');
            }
            break;
            
        case 'clearSold':
            const items = loadItems();
            const activeItems = items.filter(item => item.status === 'active');
            localStorage.setItem('minimart_items', JSON.stringify(activeItems));
            showNotification('Sold items cleared successfully!');
            loadAdminData();
            break;
            
        case 'clearAll':
            localStorage.removeItem('minimart_items');
            showNotification('All data cleared successfully!');
            loadAdminData();
            break;
    }
    
    closeConfirmModal();
}

// Close confirm modal
function closeConfirmModal() {
    const modal = document.getElementById('confirm-modal');
    if (modal) {
        modal.style.display = 'none';
    }
    currentAction = null;
    currentItemId = null;
}

// Add custom styles for admin table
const adminStyles = `
    .item-info {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }
    
    .item-name {
        font-weight: 600;
        color: #333;
    }
    
    .item-description-short {
        font-size: 0.8rem;
        color: #666;
    }
    
    .category-badge {
        display: inline-block;
        padding: 0.25rem 0.5rem;
        background: rgba(102, 126, 234, 0.1);
        color: #667eea;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 500;
    }
    
    .status-badge {
        display: inline-block;
        padding: 0.25rem 0.5rem;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 500;
        text-transform: uppercase;
    }
    
    .status-active {
        background: rgba(34, 197, 94, 0.1);
        color: #22c55e;
    }
    
    .status-sold {
        background: rgba(251, 191, 36, 0.1);
        color: #f59e0b;
    }
    
    .item-price {
        font-weight: 600;
        color: #667eea;
    }
    
    .item-date {
        color: #666;
        font-size: 0.9rem;
    }
    
    .item-actions {
        display: flex;
        gap: 0.25rem;
    }
    
    .action-btn {
        width: 32px;
        height: 32px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.8rem;
        transition: all 0.2s ease;
    }
    
    .action-btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }
    
    }
    
    .action-btn.delete {
        background: #ef4444;
        color: white;
    }
    
    .action-btn.sold {
        background: #10b981;
        color: white;
    }
    
    @media (max-width: 768px) {
        .admin-table-container {
            overflow-x: auto;
        }
        
        .admin-table {
            min-width: 600px;
        }
        
        .item-actions {
            flex-direction: column;
            gap: 0.125rem;
        }
        
        .action-btn {
            width: 28px;
            height: 28px;
            font-size: 0.7rem;
        }
    }
`;

// Add admin styles to head
const adminStyleSheet = document.createElement('style');
adminStyleSheet.textContent = adminStyles;
document.head.appendChild(adminStyleSheet);
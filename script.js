// Default Products Data
const defaultProducts = [
    {
        id: 1,
        name: "Shop System",
        description: "Complete in-game shop system with currency support, customizable UI, and secure transactions.",
        price: 500,
        icon: "fas fa-shopping-cart"
    },
    {
        id: 2,
        name: "Anti Cheat",
        description: "Advanced anti-cheat protection to keep your game fair and secure from exploiters.",
        price: 800,
        icon: "fas fa-shield-alt"
    },
    {
        id: 3,
        name: "Inventory System",
        description: "Robust inventory management with item stacking, rarity system, and save functionality.",
        price: 600,
        icon: "fas fa-boxes"
    },
    {
        id: 4,
        name: "Coin System",
        description: "Easy-to-integrate currency system with leaderboards, rewards, and purchase options.",
        price: 400,
        icon: "fas fa-coins"
    },
    {
        id: 5,
        name: "Admin Panel",
        description: "Professional admin tools with moderation commands, player management, and logging.",
        price: 700,
        icon: "fas fa-user-cog"
    },
    {
        id: 6,
        name: "Leaderboard System",
        description: "Dynamic leaderboards with multiple categories, real-time updates, and beautiful UI.",
        price: 350,
        icon: "fas fa-trophy"
    }
];

// Initialize products from localStorage or use defaults
let products = JSON.parse(localStorage.getItem('xerionx_products')) || defaultProducts;

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const adminBtn = document.getElementById('adminBtn');
const adminModal = document.getElementById('adminModal');
const closeModal = document.querySelector('.close-modal');
const addProductForm = document.getElementById('addProductForm');
const adminProductsList = document.getElementById('adminProductsList');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

// Create Particles
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particlesContainer.appendChild(particle);
    }
}

// Render Products
function renderProducts() {
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
            <i class="${product.icon} product-icon"></i>
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-price">${product.price} <span>R$</span></div>
            <button class="btn btn-primary" onclick="buyProduct('${product.name}')">
                <i class="fas fa-cart-plus"></i> Buy
            </button>
        `;
        productsGrid.appendChild(productCard);
    });

    renderAdminProducts();
}

// Render Admin Products List
function renderAdminProducts() {
    adminProductsList.innerHTML = '';
    
    products.forEach(product => {
        const adminProductItem = document.createElement('div');
        adminProductItem.classList.add('admin-product-item');
        adminProductItem.innerHTML = `
            <div>
                <strong>${product.name}</strong> - ${product.price} R$
            </div>
            <button class="delete-btn" onclick="deleteProduct(${product.id})">
                <i class="fas fa-trash"></i> Delete
            </button>
        `;
        adminProductsList.appendChild(adminProductItem);
    });
}

// Save Products to localStorage
function saveProducts() {
    localStorage.setItem('xerionx_products', JSON.stringify(products));
}

// Add Product
addProductForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newProduct = {
        id: Date.now(),
        name: document.getElementById('productName').value,
        description: document.getElementById('productDescription').value,
        price: parseInt(document.getElementById('productPrice').value),
        icon: document.getElementById('productIcon').value || 'fas fa-box'
    };
    
    products.push(newProduct);
    saveProducts();
    renderProducts();
    
    // Reset form
    addProductForm.reset();
    
    // Show success message
    alert('Product added successfully!');
});

// Delete Product
window.deleteProduct = function(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        products = products.filter(product => product.id !== id);
        saveProducts();
        renderProducts();
    }
};

// Buy Product (placeholder)
window.buyProduct = function(productName) {
    alert(`Thank you for your interest in ${productName}!\n\nIn a real implementation, this would redirect to a purchase page or Roblox game pass.`);
};

// Modal Controls
adminBtn.addEventListener('click', () => {
    adminModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
});

closeModal.addEventListener('click', () => {
    adminModal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

window.addEventListener('click', (e) => {
    if (e.target === adminModal) {
        adminModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Mobile Navigation
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Sticky Navbar Effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(10, 10, 10, 0.98)';
        navbar.style.boxShadow = '0 5px 20px rgba(255, 107, 0, 0.2)';
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.9)';
        navbar.style.boxShadow = 'none';
    }
});

// Smooth Scroll for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Animation on Scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards and sections
document.querySelectorAll('.product-card, .about-card, .contact-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    renderProducts();
});

// Keyboard accessibility for modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && adminModal.style.display === 'block') {
        adminModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Global Variables
let tasks = [];
let networkConnections = [];
let notes = [];
let currentStreak = 15;
let completedTasks = 8;
let totalTasks = 12;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadData();
    updateDashboard();
});

// Initialize app functionality
function initializeApp() {
    // Tab navigation
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // Filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => filterTasks(btn.dataset.filter));
    });

    // Search functionality
    const searchInput = document.getElementById('notes-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => searchNotes(e.target.value));
    }

    // Category filter
    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', (e) => filterNotesByCategory(e.target.value));
    }

    // Form submissions
    setupFormSubmissions();
}

// Tab switching functionality
function switchTab(tabName) {
    // Update navigation buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabName).classList.add('active');

    // Load specific tab data
    if (tabName === 'tasks') loadTasks();
    if (tabName === 'network') loadNetwork();
    if (tabName === 'notes') loadNotes();
}

// Load sample data
function loadData() {
    // Sample tasks
    tasks = [
        {
            id: 1,
            title: "Complete React Tutorial",
            description: "Finish the advanced React hooks tutorial and practice examples",
            priority: "high",
            completed: false,
            date: "2024-01-15",
            category: "learning"
        },
        {
            id: 2,
            title: "Review JavaScript Fundamentals",
            description: "Go through ES6+ features and practice coding challenges",
            priority: "medium",
            completed: true,
            date: "2024-01-14",
            category: "practice"
        },
        {
            id: 3,
            title: "Build Portfolio Project",
            description: "Create a full-stack project for portfolio",
            priority: "high",
            completed: false,
            date: "2024-01-20",
            category: "project"
        },
        {
            id: 4,
            title: "Algorithm Practice",
            description: "Solve 5 coding problems on LeetCode",
            priority: "medium",
            completed: true,
            date: "2024-01-14",
            category: "practice"
        }
    ];

    // Sample network connections
    networkConnections = [
        {
            id: 1,
            name: "Sarah Johnson",
            role: "Senior Developer",
            company: "Tech Corp",
            type: "mentor",
            notes: "Great mentor for React development"
        },
        {
            id: 2,
            name: "Mike Chen",
            role: "Full Stack Developer",
            company: "StartupXYZ",
            type: "peer",
            notes: "Fellow developer learning Node.js"
        },
        {
            id: 3,
            name: "Emily Davis",
            role: "Junior Developer",
            company: "WebSolutions",
            type: "mentee",
            notes: "Helping with JavaScript fundamentals"
        }
    ];

    // Sample notes
    notes = [
        {
            id: 1,
            title: "Binary Search Implementation",
            category: "algorithms",
            content: "Remember to handle edge cases: empty array, single element. Time complexity O(log n).",
            solved: true,
            date: "2024-01-10"
        },
        {
            id: 2,
            title: "React useEffect Hook",
            category: "web-dev",
            content: "useEffect with empty dependency array runs only once. Don't forget cleanup function for subscriptions.",
            solved: true,
            date: "2024-01-12"
        },
        {
            id: 3,
            title: "CSS Grid vs Flexbox",
            category: "web-dev",
            content: "When to use Grid vs Flexbox? Grid for 2D layouts, Flexbox for 1D layouts.",
            solved: false,
            date: "2024-01-13"
        }
    ];
}

// Update dashboard statistics
function updateDashboard() {
    document.getElementById('streak-count').textContent = currentStreak;
    document.getElementById('completed-tasks').textContent = `${completedTasks}/${totalTasks}`;
    document.getElementById('network-connections').textContent = networkConnections.length;
    document.getElementById('solved-questions').textContent = notes.filter(note => note.solved).length;
    
    // Update progress bar
    const progressPercent = Math.round((completedTasks / totalTasks) * 100);
    document.getElementById('daily-progress').style.width = `${progressPercent}%`;
    document.querySelector('.progress-text').textContent = `${progressPercent}% Complete`;
}

// Generate motivational quotes
function generateMotivation() {
    const quotes = [
        "The only way to do great work is to love what you do. - Steve Jobs",
        "Code never lies, comments sometimes do. - Ron Jeffries",
        "First, solve the problem. Then, write the code. - John Johnson",
        "Programming isn't about what you know; it's about what you can figure out. - Chris Pine",
        "The best error message is the one that never shows up. - Thomas Fuchs",
        "Simplicity is the soul of efficiency. - Austin Freeman",
        "Make it work, make it right, make it fast. - Kent Beck"
    ];
    
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    document.getElementById('daily-quote').textContent = randomQuote;
}

// Task Management Functions
function loadTasks() {
    const container = document.getElementById('tasks-container');
    container.innerHTML = '';
    
    tasks.forEach(task => {
        const taskElement = createTaskElement(task);
        container.appendChild(taskElement);
    });
}

function createTaskElement(task) {
    const taskDiv = document.createElement('div');
    taskDiv.className = `task-card ${task.completed ? 'completed' : ''}`;
    taskDiv.innerHTML = `
        <div class="task-header">
            <div>
                <div class="task-title">${task.title}</div>
                <div class="task-description">${task.description}</div>
            </div>
            <span class="task-priority ${task.priority}">${task.priority}</span>
        </div>
        <div class="task-actions">
            <button class="task-btn complete-btn" onclick="toggleTask(${task.id})">
                <i class="fas fa-${task.completed ? 'undo' : 'check'}"></i>
                ${task.completed ? 'Undo' : 'Complete'}
            </button>
            <button class="task-btn edit-btn" onclick="editTask(${task.id})">
                <i class="fas fa-edit"></i>
                Edit
            </button>
            <button class="task-btn delete-btn" onclick="deleteTask(${task.id})">
                <i class="fas fa-trash"></i>
                Delete
            </button>
        </div>
    `;
    return taskDiv;
}

function filterTasks(filter) {
    // Update filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
    
    // Filter tasks
    let filteredTasks = tasks;
    if (filter === 'pending') filteredTasks = tasks.filter(task => !task.completed);
    if (filter === 'completed') filteredTasks = tasks.filter(task => task.completed);
    if (filter === 'high') filteredTasks = tasks.filter(task => task.priority === 'high');
    
    // Display filtered tasks
    const container = document.getElementById('tasks-container');
    container.innerHTML = '';
    filteredTasks.forEach(task => {
        const taskElement = createTaskElement(task);
        container.appendChild(taskElement);
    });
}

function toggleTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        updateTaskCounts();
        loadTasks();
        updateDashboard();
    }
}

function deleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks = tasks.filter(t => t.id !== taskId);
        updateTaskCounts();
        loadTasks();
        updateDashboard();
    }
}

function updateTaskCounts() {
    totalTasks = tasks.length;
    completedTasks = tasks.filter(task => task.completed).length;
}

// Network Management Functions
function loadNetwork() {
    const container = document.getElementById('network-grid');
    container.innerHTML = '';
    
    networkConnections.forEach(connection => {
        const connectionElement = createNetworkElement(connection);
        container.appendChild(connectionElement);
    });
}

function createNetworkElement(connection) {
    const connectionDiv = document.createElement('div');
    connectionDiv.className = 'network-card';
    connectionDiv.innerHTML = `
        <div class="contact-info">
            <div class="contact-avatar">
                ${connection.name.charAt(0).toUpperCase()}
            </div>
            <div class="contact-details">
                <h3>${connection.name}</h3>
                <p>${connection.role} at ${connection.company}</p>
            </div>
        </div>
        <div class="contact-type">${connection.type}</div>
        <p style="margin-top: 1rem; color: #666; font-size: 0.9rem;">${connection.notes}</p>
        <div class="note-actions" style="margin-top: 1rem;">
            <button class="note-btn" onclick="editConnection(${connection.id})">
                <i class="fas fa-edit"></i>
            </button>
            <button class="note-btn" onclick="deleteConnection(${connection.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    return connectionDiv;
}

function deleteConnection(connectionId) {
    if (confirm('Are you sure you want to delete this connection?')) {
        networkConnections = networkConnections.filter(c => c.id !== connectionId);
        loadNetwork();
        updateDashboard();
    }
}

// Notes Management Functions
function loadNotes() {
    const container = document.getElementById('notes-container');
    container.innerHTML = '';
    
    notes.forEach(note => {
        const noteElement = createNoteElement(note);
        container.appendChild(noteElement);
    });
}

function createNoteElement(note) {
    const noteDiv = document.createElement('div');
    noteDiv.className = 'note-card';
    noteDiv.innerHTML = `
        <div class="note-header">
            <div>
                <div class="note-title">${note.title}</div>
            </div>
            <span class="note-category">${note.category}</span>
        </div>
        <div class="note-content">${note.content}</div>
        <div class="note-footer">
            <div class="note-status ${note.solved ? 'solved' : 'unsolved'}">
                <i class="fas fa-${note.solved ? 'check-circle' : 'question-circle'}"></i>
                ${note.solved ? 'Solved' : 'Unsolved'}
            </div>
            <div class="note-actions">
                <button class="note-btn" onclick="toggleNoteSolved(${note.id})">
                    <i class="fas fa-${note.solved ? 'undo' : 'check'}"></i>
                </button>
                <button class="note-btn" onclick="editNote(${note.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="note-btn" onclick="deleteNote(${note.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
    return noteDiv;
}

function searchNotes(query) {
    const filteredNotes = notes.filter(note => 
        note.title.toLowerCase().includes(query.toLowerCase()) ||
        note.content.toLowerCase().includes(query.toLowerCase())
    );
    
    const container = document.getElementById('notes-container');
    container.innerHTML = '';
    filteredNotes.forEach(note => {
        const noteElement = createNoteElement(note);
        container.appendChild(noteElement);
    });
}

function filterNotesByCategory(category) {
    const filteredNotes = category === 'all' ? notes : notes.filter(note => note.category === category);
    
    const container = document.getElementById('notes-container');
    container.innerHTML = '';
    filteredNotes.forEach(note => {
        const noteElement = createNoteElement(note);
        container.appendChild(noteElement);
    });
}

function toggleNoteSolved(noteId) {
    const note = notes.find(n => n.id === noteId);
    if (note) {
        note.solved = !note.solved;
        loadNotes();
        updateDashboard();
    }
}

function deleteNote(noteId) {
    if (confirm('Are you sure you want to delete this note?')) {
        notes = notes.filter(n => n.id !== noteId);
        loadNotes();
        updateDashboard();
    }
}

// Modal Functions
function openTaskModal() {
    document.getElementById('task-modal').classList.add('active');
}

function closeTaskModal() {
    document.getElementById('task-modal').classList.remove('active');
    document.getElementById('task-form').reset();
}

function openNetworkModal() {
    document.getElementById('network-modal').classList.add('active');
}

function closeNetworkModal() {
    document.getElementById('network-modal').classList.remove('active');
    document.getElementById('network-form').reset();
}

function openNoteModal() {
    document.getElementById('note-modal').classList.add('active');
}

function closeNoteModal() {
    document.getElementById('note-modal').classList.remove('active');
    document.getElementById('note-form').reset();
}

// Form Submissions
function setupFormSubmissions() {
    // Task form
    document.getElementById('task-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newTask = {
            id: Date.now(),
            title: document.getElementById('task-title').value,
            description: document.getElementById('task-description').value,
            priority: document.getElementById('task-priority').value,
            date: document.getElementById('task-date').value,
            completed: false
        };
        
        tasks.push(newTask);
        updateTaskCounts();
        loadTasks();
        updateDashboard();
        closeTaskModal();
    });

    // Network form
    document.getElementById('network-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const newConnection = {
            id: Date.now(),
            name: document.getElementById('contact-name').value,
            role: document.getElementById('contact-role').value,
            company: document.getElementById('contact-company').value,
            type: document.getElementById('contact-type').value,
            notes: document.getElementById('contact-notes').value
        };
        
        networkConnections.push(newConnection);
        loadNetwork();
        updateDashboard();
        closeNetworkModal();
    });

    // Note form
    document.getElementById('note-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const newNote = {
            id: Date.now(),
            title: document.getElementById('note-title').value,
            category: document.getElementById('note-category').value,
            content: document.getElementById('note-content').value,
            solved: document.getElementById('note-solved').checked,
            date: new Date().toISOString().split('T')[0]
        };
        
        notes.push(newNote);
        loadNotes();
        updateDashboard();
        closeNoteModal();
    });
}

// Close modals when clicking outside
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
    }
});

// Auto-save functionality (simulated)
setInterval(function() {
    // In a real app, this would save to localStorage or send to server
    console.log('Auto-saving data...');
}, 30000);

// Initialize streak tracking
function updateStreak() {
    const lastActive = localStorage.getItem('lastActive');
    const today = new Date().toDateString();
    
    if (lastActive !== today) {
        if (completedTasks > 0) {
            currentStreak++;
        } else if (lastActive) {
            currentStreak = 0;
        }
        localStorage.setItem('lastActive', today);
        localStorage.setItem('currentStreak', currentStreak);
    }
}

// Load streak from localStorage
function loadStreak() {
    const savedStreak = localStorage.getItem('currentStreak');
    if (savedStreak) {
        currentStreak = parseInt(savedStreak);
    }
}

// Initialize streak on load
loadStreak();
updateStreak();



  document.querySelectorAll(".faqbox").forEach(faq => {
    faq.addEventListener("click", () => {
      faq.classList.toggle("active");
    });
  });


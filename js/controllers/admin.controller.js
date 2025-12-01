import { StorageService } from '../services/storage.service.js';
import { CSVService } from '../services/csv.service.js';

export class AdminController {
    constructor() {
        this.panel = document.getElementById('adminPanel');
        this.downloadBtn = document.getElementById('downloadCsvBtn');
        this.clearBtn = document.getElementById('clearStorageBtn');
        this.closeBtn = document.getElementById('closeAdminPanel');
        this.isAuthenticated = false;
        
        this.init();
    }

    init() {
        // Secret Shortcut: Ctrl + Shift + X
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && (e.key === 'X' || e.key === 'x')) {
                this.handleAuthAndOpen();
            }
        });

        // Close button logic
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.close());
        }

        // CSV Download Logic
        if (this.downloadBtn) {
            this.downloadBtn.addEventListener('click', () => {
                const data = StorageService.getRegistrations();
                
                if (data.length === 0) {
                    alert('No registrations found to download.');
                    return;
                }

                // Generate and download
                const csv = CSVService.generateCSV(data);
                const date = new Date().toISOString().split('T')[0];
                CSVService.downloadCSV(csv, `registrations_backup_${date}.csv`);
                
                console.log(`✓ Downloaded ${data.length} records.`);
            });
        }

        // Clear Storage Logic
        if (this.clearBtn) {
            this.clearBtn.addEventListener('click', () => {
                const count = StorageService.getCount();
                const confirmed = confirm(`⚠️ DANGER ZONE ⚠️\n\nThis will permanently delete ALL ${count} registrations.\n\nAre you sure?`);
                
                if (confirmed) {
                    const doubleCheck = prompt("Type 'DELETE' to confirm wiping the database:");
                    if (doubleCheck === 'DELETE') {
                        StorageService.clearAll();
                        alert('System storage has been wiped.');
                        location.reload();
                    }
                }
            });
        }
    }

    handleAuthAndOpen() {
        if (this.isAuthenticated) {
            this.togglePanel();
            return;
        }

        const password = prompt("🔒 ADMIN PROTOCOL\nEnter Access Code:");
        const ACCESS_CODE = "ZeroDayEniac2025LinuxEvent"; 

        if (password === ACCESS_CODE) {
            this.isAuthenticated = true;
            this.togglePanel();
            console.log("%c✓ Admin Access Granted", "color: #10b981; font-weight: bold;");
        } else {
            alert("❌ ACCESS DENIED: Invalid Credentials");
        }
    }

    togglePanel() {
        if (this.panel) this.panel.classList.toggle('hidden');
    }

    close() {
        if (this.panel) this.panel.classList.add('hidden');
    }
}
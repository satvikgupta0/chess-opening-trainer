import { PracticeController } from './practice.js';
import { getAllOpenings, getOpeningById } from './opening-data.js';
import { getAllTraps, getTrapById } from './traps-data.js';
import { storage } from './storage.js';
import { sound } from './sound.js';
import { renderDashboardOverview, renderProgressView } from './progress.js';
import { ChessEngine } from './chess-engine.js';
import { ChessboardUI } from './board.js';

class ChessTrainerApp {
  constructor() {
    this.currentView = 'dashboard';
    this.practiceController = null;
    this.trapViewer = null;

    this.init();
  }

  init() {
    // 1. Initialize sound and settings
    const settings = storage.getSettings();
    sound.setEnabled(settings.sound);
    this.applyTheme(settings.boardTheme);

    // 2. Initialize Practice Controller
    this.practiceController = new PracticeController(document.getElementById('practice-board-container'));

    // 3. Navigation Setup
    this.initNavigation();

    // 4. Render initial view
    this.renderDashboard();

    // 5. Setup Modals & Settings
    this.initSettingsModal();
    this.initResetModal();
    this.initMobileNav();
  }

  applyTheme(theme) {
    document.documentElement.dataset.theme = theme || 'classic';
  }

  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-fade-out');
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  initNavigation() {
    const navLinks = document.querySelectorAll('[data-view-target]');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetView = link.dataset.viewTarget;
        this.switchView(targetView);

        // Close mobile drawer if open
        const mobileDrawer = document.getElementById('mobile-drawer');
        if (mobileDrawer) mobileDrawer.classList.remove('open');
      });
    });
  }

  switchView(viewName, params = {}) {
    this.currentView = viewName;

    // Update active nav links
    document.querySelectorAll('[data-view-target]').forEach(link => {
      link.classList.toggle('active', link.dataset.viewTarget === viewName);
    });

    // Hide all view sections
    document.querySelectorAll('.view-section').forEach(sec => {
      sec.classList.remove('active');
    });

    // Show target section
    const targetSection = document.getElementById(`view-${viewName}`);
    if (targetSection) {
      targetSection.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Trigger view-specific renderers
    if (viewName === 'dashboard') {
      this.renderDashboard();
    } else if (viewName === 'practice') {
      if (params.openingId) {
        this.practiceController.startSession(params.openingId);
      } else if (!this.practiceController.opening) {
        const lastId = storage.getLastOpeningId();
        this.practiceController.startSession(lastId);
      }
    } else if (viewName === 'library') {
      this.renderLibrary();
    } else if (viewName === 'traps') {
      this.renderTraps();
    } else if (viewName === 'repertoire') {
      this.renderRepertoire();
    } else if (viewName === 'progress') {
      this.renderProgress();
    }
  }

  renderDashboard() {
    renderDashboardOverview((openingId) => {
      this.switchView('practice', { openingId });
    });
  }

  renderProgress() {
    renderProgressView((openingId) => {
      this.switchView('practice', { openingId });
    });
  }

  // --- Opening Library Rendering ---
  renderLibrary() {
    const container = document.getElementById('library-list');
    const searchInput = document.getElementById('library-search');
    const sideFilter = document.getElementById('library-filter-side');
    const diffFilter = document.getElementById('library-filter-diff');

    if (!container) return;

    const render = () => {
      const query = (searchInput ? searchInput.value : '').toLowerCase().trim();
      const side = sideFilter ? sideFilter.value : 'all';
      const diff = diffFilter ? diffFilter.value : 'all';

      const openings = getAllOpenings().filter(op => {
        const matchesQuery = !query ||
          op.name.toLowerCase().includes(query) ||
          op.subtitle.toLowerCase().includes(query) ||
          op.eco.toLowerCase().includes(query) ||
          op.description.toLowerCase().includes(query);
        const matchesSide = side === 'all' || op.side === side;
        const matchesDiff = diff === 'all' || op.difficulty.toLowerCase() === diff.toLowerCase();
        return matchesQuery && matchesSide && matchesDiff;
      });

      if (openings.length === 0) {
        container.innerHTML = `
          <div class="empty-state-card">
            <p class="empty-state-title">No matching openings found</p>
            <p class="empty-state-subtitle">Try adjusting your search criteria or resetting filters.</p>
          </div>
        `;
        return;
      }

      container.innerHTML = openings.map(op => {
        const inRepertoire = storage.isInRepertoire(op.id);
        const movesSanList = op.moves.map(m => m.san).join(' ');

        return `
          <article class="opening-library-card" data-opening-id="${op.id}">
            <div class="op-lib-header">
              <div class="op-lib-meta-tags">
                <span class="badge badge-eco">${op.eco}</span>
                <span class="badge ${op.side === 'w' ? 'badge-white' : 'badge-black'}">${op.side === 'w' ? 'White' : 'Black'}</span>
                <span class="badge badge-diff">${op.difficulty}</span>
              </div>
              <h3 class="op-lib-title">${op.name}</h3>
              <p class="op-lib-subtitle">${op.subtitle}</p>
            </div>

            <p class="op-lib-desc">${op.description}</p>

            <div class="op-lib-moves-preview">
              <span class="op-moves-label">Sample line:</span>
              <code class="op-moves-code">${movesSanList}</code>
            </div>

            <div class="op-lib-ideas">
              <h4 class="op-ideas-title">Core Strategic Principles:</h4>
              <ul class="op-ideas-list">
                ${op.mainIdeas.map(idea => `<li>${idea}</li>`).join('')}
              </ul>
            </div>

            <div class="op-lib-mistakes">
              <details class="op-mistakes-details">
                <summary>Common Beginner Mistakes (${op.commonMistakes.length})</summary>
                <div class="op-mistakes-content">
                  ${op.commonMistakes.map(m => `
                    <div class="mistake-item">
                      <strong>⚠️ ${m.mistake}</strong>
                      <p>${m.explanation}</p>
                    </div>
                  `).join('')}
                </div>
              </details>
            </div>

            <div class="op-lib-actions">
              <button class="btn btn-primary lib-practise-btn" data-opening-id="${op.id}">
                Practise in Trainer
              </button>
              <button class="btn btn-outline lib-rep-toggle-btn ${inRepertoire ? 'btn-saved' : ''}" data-opening-id="${op.id}">
                ${inRepertoire ? '✓ In Repertoire' : '+ Add to Repertoire'}
              </button>
            </div>
          </article>
        `;
      }).join('');

      // Attach actions
      container.querySelectorAll('.lib-practise-btn').forEach(btn => {
        btn.onclick = (e) => {
          const id = e.currentTarget.dataset.openingId;
          this.switchView('practice', { openingId: id });
        };
      });

      container.querySelectorAll('.lib-rep-toggle-btn').forEach(btn => {
        btn.onclick = (e) => {
          const id = e.currentTarget.dataset.openingId;
          const isSaved = storage.isInRepertoire(id);
          const op = getOpeningById(id);

          if (isSaved) {
            storage.removeFromRepertoire(id);
            this.showToast(`Removed ${op.name} from Repertoire`, 'info');
          } else {
            storage.addToRepertoire(id);
            this.showToast(`Saved ${op.name} to Repertoire!`, 'success');
          }
          render();
        };
      });
    };

    if (searchInput) searchInput.oninput = () => render();
    if (sideFilter) sideFilter.onchange = () => render();
    if (diffFilter) diffFilter.onchange = () => render();

    render();
  }

  // --- Common Traps & Mistakes Rendering ---
  renderTraps() {
    const container = document.getElementById('traps-list');
    if (!container) return;

    const traps = getAllTraps();
    container.innerHTML = traps.map(trap => {
      const fullLine = [...trap.setupMoves, trap.blunderMove, ...trap.refutationMoves].join(' ');

      return `
        <article class="trap-card" data-trap-id="${trap.id}">
          <div class="trap-card-header">
            <div class="trap-tags">
              <span class="badge badge-eco">${trap.eco}</span>
              <span class="badge badge-opening">${trap.opening}</span>
            </div>
            <h3 class="trap-title">${trap.name}</h3>
            <span class="trap-theme-badge">${trap.theme}</span>
          </div>

          <p class="trap-summary">${trap.summary}</p>

          <div class="trap-move-flow">
            <div class="flow-item">
              <span class="flow-label">Setup moves:</span>
              <code>${trap.setupMoves.join(' ')}</code>
            </div>
            <div class="flow-item blunder-box">
              <span class="flow-label">The Blunder:</span>
              <code class="blunder-san">${trap.blunderMove}</code>
              <p class="blunder-desc">${trap.blunderExplanation}</p>
            </div>
            <div class="flow-item refutation-box">
              <span class="flow-label">The Tactical Refutation:</span>
              <code class="refutation-san">${trap.refutationMoves.join(' ')}</code>
            </div>
          </div>

          <div class="trap-explanation">
            <h4>Tactical Mechanics:</h4>
            <p>${trap.tacticalExplanation}</p>
          </div>

          <div class="trap-takeaway">
            <strong>Key Lesson:</strong> ${trap.keyTakeaway}
          </div>

          <div class="trap-card-actions">
            <button class="btn btn-primary trap-replay-btn" data-trap-id="${trap.id}">
              Replay Trap on Board
            </button>
          </div>
        </article>
      `;
    }).join('');

    container.querySelectorAll('.trap-replay-btn').forEach(btn => {
      btn.onclick = (e) => {
        const trapId = e.currentTarget.dataset.trapId;
        this.openTrapModal(trapId);
      };
    });
  }

  // --- Modal for Interactive Trap Board Replay ---
  openTrapModal(trapId) {
    const trap = getTrapById(trapId);
    if (!trap) return;

    const modal = document.getElementById('trap-modal');
    const modalTitle = document.getElementById('trap-modal-title');
    const modalDesc = document.getElementById('trap-modal-desc');
    const boardEl = document.getElementById('trap-board-container');
    const prevBtn = document.getElementById('trap-prev-btn');
    const nextBtn = document.getElementById('trap-next-btn');
    const resetBtn = document.getElementById('trap-reset-btn');
    const moveTextEl = document.getElementById('trap-move-text');

    if (!modal || !boardEl) return;

    modalTitle.textContent = trap.name;
    modalDesc.textContent = trap.summary;

    const allMoves = [...trap.setupMoves, trap.blunderMove.replace(/[?!]/g, ''), ...trap.refutationMoves.map(m => m.replace(/[#!]/g, ''))];
    let currentStep = 0;

    const engine = new ChessEngine();
    const board = new ChessboardUI(boardEl, {
      orientation: 'white',
      interactive: false,
      showCoordinates: true
    });
    board.setPosition(engine);

    const updateStep = () => {
      engine.reset();
      for (let i = 0; i < currentStep; i++) {
        engine.move(allMoves[i]);
      }
      board.setPosition(engine);

      const isBlunder = currentStep === trap.setupMoves.length + 1;
      const currentMoveSan = currentStep > 0 ? allMoves[currentStep - 1] : 'Start';

      if (moveTextEl) {
        if (currentStep === 0) {
          moveTextEl.innerHTML = `Starting position. Click "Next Move" to follow the trap sequence.`;
        } else if (isBlunder) {
          moveTextEl.innerHTML = `<span class="blunder-alert">⚠️ Move ${currentStep}: <strong>${currentMoveSan}</strong> (The Mistake!)</span> — ${trap.blunderExplanation}`;
        } else if (currentStep > trap.setupMoves.length + 1) {
          moveTextEl.innerHTML = `Move ${currentStep}: <strong>${currentMoveSan}</strong> (Refutation) — ${trap.tacticalExplanation}`;
        } else {
          moveTextEl.innerHTML = `Move ${currentStep}: <strong>${currentMoveSan}</strong> (Setup)`;
        }
      }

      if (prevBtn) prevBtn.disabled = currentStep === 0;
      if (nextBtn) nextBtn.disabled = currentStep >= allMoves.length;
    };

    updateStep();

    if (prevBtn) {
      prevBtn.onclick = () => {
        if (currentStep > 0) {
          currentStep--;
          sound.playMove();
          updateStep();
        }
      };
    }

    if (nextBtn) {
      nextBtn.onclick = () => {
        if (currentStep < allMoves.length) {
          currentStep++;
          sound.playMove();
          updateStep();
        }
      };
    }

    if (resetBtn) {
      resetBtn.onclick = () => {
        currentStep = 0;
        updateStep();
      };
    }

    modal.classList.add('open');
  }

  // --- My Repertoire Rendering ---
  renderRepertoire() {
    const container = document.getElementById('repertoire-list');
    const filterSide = document.getElementById('repertoire-filter-side');
    if (!container) return;

    const render = () => {
      const side = filterSide ? filterSide.value : 'all';
      const repertoireIds = storage.getRepertoire();
      const stats = storage.getStats();

      let openings = repertoireIds.map(id => getOpeningById(id)).filter(Boolean);
      if (side !== 'all') {
        openings = openings.filter(op => op.side === side);
      }

      if (openings.length === 0) {
        container.innerHTML = `
          <div class="empty-state-card">
            <p class="empty-state-title">No openings in your repertoire yet</p>
            <p class="empty-state-subtitle">Add openings from the Opening Library to build your personal training syllabus.</p>
            <button class="btn btn-primary" id="btn-rep-go-library">Browse Opening Library</button>
          </div>
        `;
        const goLib = container.querySelector('#btn-rep-go-library');
        if (goLib) {
          goLib.onclick = () => this.switchView('library');
        }
        return;
      }

      container.innerHTML = openings.map(op => {
        const opStat = stats.openings[op.id] || { attempts: 0, correct: 0 };
        const hasAttempts = opStat.attempts > 0;
        const acc = hasAttempts ? Math.round((opStat.correct / opStat.attempts) * 100) : 0;

        return `
          <article class="repertoire-card" data-opening-id="${op.id}">
            <div class="rep-card-header">
              <div>
                <div class="rep-card-tags">
                  <span class="badge badge-eco">${op.eco}</span>
                  <span class="badge ${op.side === 'w' ? 'badge-white' : 'badge-black'}">${op.side === 'w' ? 'White' : 'Black'}</span>
                  <span class="badge badge-diff">${op.difficulty}</span>
                </div>
                <h3 class="rep-card-title">${op.name}</h3>
                <p class="rep-card-sub">${op.subtitle}</p>
              </div>
              <div class="rep-card-acc">
                <span class="acc-badge ${acc >= 80 ? 'acc-high' : acc >= 50 ? 'acc-mid' : 'acc-low'}">
                  ${hasAttempts ? `${acc}% Accuracy` : 'Not tested yet'}
                </span>
              </div>
            </div>

            <p class="rep-card-desc">${op.description}</p>

            <div class="rep-card-sequence">
              <span class="seq-label">Line:</span>
              <code class="seq-code">${op.moves.map(m => m.san).join(' ')}</code>
            </div>

            <div class="rep-card-actions">
              <button class="btn btn-primary rep-practise-btn" data-opening-id="${op.id}">
                Practise Repertoire Move
              </button>
              <button class="btn btn-outline rep-remove-btn" data-opening-id="${op.id}">
                Remove
              </button>
            </div>
          </article>
        `;
      }).join('');

      container.querySelectorAll('.rep-practise-btn').forEach(btn => {
        btn.onclick = (e) => {
          const id = e.currentTarget.dataset.openingId;
          this.switchView('practice', { openingId: id });
        };
      });

      container.querySelectorAll('.rep-remove-btn').forEach(btn => {
        btn.onclick = (e) => {
          const id = e.currentTarget.dataset.openingId;
          const op = getOpeningById(id);
          storage.removeFromRepertoire(id);
          this.showToast(`Removed ${op ? op.name : 'opening'} from Repertoire`, 'info');
          render();
        };
      });
    };

    if (filterSide) filterSide.onchange = () => render();
    render();
  }

  // --- Settings Modal Handling ---
  initSettingsModal() {
    const modal = document.getElementById('settings-modal');
    const openBtn = document.getElementById('nav-settings-btn');
    const closeBtn = document.getElementById('settings-modal-close');
    const soundToggle = document.getElementById('setting-sound');
    const autoAdvanceToggle = document.getElementById('setting-auto-advance');
    const legalDotsToggle = document.getElementById('setting-legal-dots');
    const themeSelect = document.getElementById('setting-board-theme');

    const loadSettingsIntoForm = () => {
      const s = storage.getSettings();
      if (soundToggle) soundToggle.checked = s.sound;
      if (autoAdvanceToggle) autoAdvanceToggle.checked = s.autoAdvance;
      if (legalDotsToggle) legalDotsToggle.checked = s.showLegalDots;
      if (themeSelect) themeSelect.value = s.boardTheme || 'classic';
    };

    if (openBtn) {
      openBtn.onclick = () => {
        loadSettingsIntoForm();
        if (modal) modal.classList.add('open');
      };
    }

    if (closeBtn && modal) {
      closeBtn.onclick = () => modal.classList.remove('open');
    }

    if (soundToggle) {
      soundToggle.onchange = (e) => {
        const val = e.target.checked;
        storage.saveSettings({ sound: val });
        sound.setEnabled(val);
        if (val) sound.playMove();
      };
    }

    if (autoAdvanceToggle) {
      autoAdvanceToggle.onchange = (e) => {
        storage.saveSettings({ autoAdvance: e.target.checked });
      };
    }

    if (legalDotsToggle) {
      legalDotsToggle.onchange = (e) => {
        const val = e.target.checked;
        storage.saveSettings({ showLegalDots: val });
        if (this.practiceController && this.practiceController.board) {
          this.practiceController.board.setShowLegalDots(val);
        }
      };
    }

    if (themeSelect) {
      themeSelect.onchange = (e) => {
        const theme = e.target.value;
        storage.saveSettings({ boardTheme: theme });
        this.applyTheme(theme);
      };
    }

    // Modal background close
    if (modal) {
      modal.onclick = (e) => {
        if (e.target === modal) modal.classList.remove('open');
      };
    }

    // Close trap modal on click
    const trapModal = document.getElementById('trap-modal');
    const trapModalClose = document.getElementById('trap-modal-close');
    if (trapModalClose && trapModal) {
      trapModalClose.onclick = () => trapModal.classList.remove('open');
    }
    if (trapModal) {
      trapModal.onclick = (e) => {
        if (e.target === trapModal) trapModal.classList.remove('open');
      };
    }
  }

  // --- Reset Progress Modal Handling ---
  initResetModal() {
    const modal = document.getElementById('reset-modal');
    const openBtn = document.getElementById('open-reset-modal-btn');
    const closeBtn = document.getElementById('reset-modal-cancel');
    const confirmBtn = document.getElementById('reset-modal-confirm');
    const clearRepCheckbox = document.getElementById('reset-clear-repertoire');

    if (openBtn) {
      openBtn.onclick = () => {
        if (clearRepCheckbox) clearRepCheckbox.checked = false;
        if (modal) modal.classList.add('open');
      };
    }

    if (closeBtn && modal) {
      closeBtn.onclick = () => modal.classList.remove('open');
    }

    if (confirmBtn && modal) {
      confirmBtn.onclick = () => {
        const alsoClearRepertoire = clearRepCheckbox ? clearRepCheckbox.checked : false;

        if (alsoClearRepertoire) {
          storage.resetEverything();
          this.showToast('All practice statistics and repertoire reset', 'info');
        } else {
          storage.resetPracticeStats();
          this.showToast('Practice statistics reset. Repertoire preserved.', 'info');
        }

        modal.classList.remove('open');

        // Re-render current view
        if (this.currentView === 'dashboard') this.renderDashboard();
        if (this.currentView === 'progress') this.renderProgress();
        if (this.currentView === 'repertoire') this.renderRepertoire();
      };
    }
  }

  // --- Mobile Drawer Toggle ---
  initMobileNav() {
    const toggleBtn = document.getElementById('mobile-nav-toggle');
    const drawer = document.getElementById('mobile-drawer');
    const overlay = document.getElementById('mobile-drawer-overlay');

    if (toggleBtn && drawer) {
      toggleBtn.onclick = () => {
        drawer.classList.toggle('open');
      };
    }

    if (overlay && drawer) {
      overlay.onclick = () => {
        drawer.classList.remove('open');
      };
    }
  }
}

// Instantiate application once DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
  window.__chessApp = new ChessTrainerApp();
});

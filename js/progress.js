import { storage } from './storage.js';
import { getAllOpenings, getOpeningById } from './opening-data.js';

/**
 * Calculates overall and granular practice progress, formats percentages safely,
 * and renders Dashboard metrics and the dedicated Progress view.
 */

export function calculateAccuracy(correct, total) {
  if (!total || total <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((correct / total) * 100)));
}

/**
 * Updates the Dashboard overview with real calculated stats.
 */
export function renderDashboardOverview(onContinuePractice) {
  const stats = storage.getStats();
  const sessions = storage.getSessions();
  const repertoire = storage.getRepertoire();
  const lastOpeningId = storage.getLastOpeningId();
  const lastOpening = getOpeningById(lastOpeningId) || getAllOpenings()[0];

  // 1. Next practice banner
  const nextOpeningNameEl = document.getElementById('dash-next-opening-name');
  const nextOpeningDescEl = document.getElementById('dash-next-opening-desc');
  const continueBtn = document.getElementById('dash-continue-btn');

  if (nextOpeningNameEl && lastOpening) {
    nextOpeningNameEl.textContent = `${lastOpening.name} (${lastOpening.subtitle})`;
  }
  if (nextOpeningDescEl && lastOpening) {
    const sideText = lastOpening.side === 'w' ? 'White' : 'Black';
    nextOpeningDescEl.textContent = `Practise as ${sideText}. ${lastOpening.moves.filter(m => m.side === lastOpening.side).length} repertoire moves to recall.`;
  }
  if (continueBtn && onContinuePractice) {
    continueBtn.onclick = () => onContinuePractice(lastOpening.id);
  }

  // 2. Summary stats
  const totalAttempts = stats.totalAttempts || 0;
  const overallAcc = calculateAccuracy(stats.correctAttempts, totalAttempts);
  const practisedCount = Object.keys(stats.openings).filter(id => stats.openings[id].attempts > 0).length;
  const sessionsCount = sessions.length;

  const statAttemptsEl = document.getElementById('dash-stat-attempts');
  const statAccuracyEl = document.getElementById('dash-stat-accuracy');
  const statOpeningsEl = document.getElementById('dash-stat-openings');
  const statSessionsEl = document.getElementById('dash-stat-sessions');

  if (statAttemptsEl) statAttemptsEl.textContent = totalAttempts.toLocaleString();
  if (statAccuracyEl) statAccuracyEl.textContent = totalAttempts > 0 ? `${overallAcc}%` : '—';
  if (statOpeningsEl) statOpeningsEl.textContent = `${practisedCount} / ${getAllOpenings().length}`;
  if (statSessionsEl) statSessionsEl.textContent = sessionsCount.toLocaleString();

  // 3. Recently practised openings list
  const recentListEl = document.getElementById('dash-recent-list');
  if (recentListEl) {
    const recentOpeningIds = Object.keys(stats.openings)
      .filter(id => stats.openings[id].attempts > 0)
      .sort((a, b) => new Date(stats.openings[b].lastPractised) - new Date(stats.openings[a].lastPractised))
      .slice(0, 4);

    if (recentOpeningIds.length === 0) {
      recentListEl.innerHTML = `
        <div class="empty-state-card">
          <p class="empty-state-title">No practice sessions logged yet</p>
          <p class="empty-state-subtitle">Select an opening from the library or click "Continue Practice" above to begin your first interactive session.</p>
        </div>
      `;
    } else {
      recentListEl.innerHTML = recentOpeningIds.map(opId => {
        const op = getOpeningById(opId);
        if (!op) return '';
        const opStat = stats.openings[opId];
        const acc = calculateAccuracy(opStat.correct, opStat.attempts);
        const lastDate = opStat.lastPractised
          ? new Date(opStat.lastPractised).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
          : 'Recently';

        return `
          <div class="recent-opening-row">
            <div class="recent-opening-info">
              <span class="recent-opening-name">${op.name}</span>
              <span class="recent-opening-meta">${op.eco} • ${op.side === 'w' ? 'White' : 'Black'} • Last active ${lastDate}</span>
            </div>
            <div class="recent-opening-acc">
              <span class="acc-badge ${acc >= 80 ? 'acc-high' : acc >= 50 ? 'acc-mid' : 'acc-low'}">${acc}% accuracy</span>
              <button class="btn btn-sm btn-outline recent-practice-btn" data-opening-id="${op.id}">Practise</button>
            </div>
          </div>
        `;
      }).join('');

      recentListEl.querySelectorAll('.recent-practice-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.currentTarget.dataset.openingId;
          if (onContinuePractice) onContinuePractice(id);
        });
      });
    }
  }
}

/**
 * Renders the dedicated Progress tab with full breakdown and session history.
 */
export function renderProgressView(onStartPractice) {
  const stats = storage.getStats();
  const sessions = storage.getSessions();
  const openings = getAllOpenings();

  const totalAttempts = stats.totalAttempts || 0;
  const correctAttempts = stats.correctAttempts || 0;
  const incorrectAttempts = stats.incorrectAttempts || 0;
  const overallAcc = calculateAccuracy(correctAttempts, totalAttempts);

  // Top metric numbers
  const totalAttemptsEl = document.getElementById('prog-total-attempts');
  const correctMovesEl = document.getElementById('prog-correct-moves');
  const mistakesEl = document.getElementById('prog-mistakes');
  const overallAccuracyEl = document.getElementById('prog-overall-accuracy');

  if (totalAttemptsEl) totalAttemptsEl.textContent = totalAttempts.toLocaleString();
  if (correctMovesEl) correctMovesEl.textContent = correctAttempts.toLocaleString();
  if (mistakesEl) mistakesEl.textContent = incorrectAttempts.toLocaleString();
  if (overallAccuracyEl) overallAccuracyEl.textContent = totalAttempts > 0 ? `${overallAcc}%` : '—';

  // Per-opening accuracy breakdown table
  const breakdownContainer = document.getElementById('prog-openings-breakdown');
  if (breakdownContainer) {
    breakdownContainer.innerHTML = openings.map(op => {
      const opStat = stats.openings[op.id] || { attempts: 0, correct: 0, lastPractised: null };
      const hasAttempts = opStat.attempts > 0;
      const acc = calculateAccuracy(opStat.correct, opStat.attempts);
      const lastDate = opStat.lastPractised
        ? new Date(opStat.lastPractised).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
        : 'Never';

      return `
        <div class="opening-progress-card">
          <div class="op-card-header">
            <div>
              <h4 class="op-card-title">${op.name}</h4>
              <span class="op-card-meta">${op.eco} • Playing as ${op.side === 'w' ? 'White' : 'Black'} • ${op.difficulty}</span>
            </div>
            <button class="btn btn-sm btn-outline prog-launch-btn" data-opening-id="${op.id}">Practise</button>
          </div>
          <div class="progress-bar-wrapper">
            <div class="progress-bar-track">
              <div class="progress-bar-fill ${acc >= 80 ? 'fill-high' : acc >= 50 ? 'fill-mid' : 'fill-low'}" style="width: ${hasAttempts ? acc : 0}%;"></div>
            </div>
            <div class="progress-bar-labels">
              <span>${hasAttempts ? `${acc}% accuracy (${opStat.correct}/${opStat.attempts} moves)` : 'No attempts yet'}</span>
              <span>Last: ${lastDate}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');

    breakdownContainer.querySelectorAll('.prog-launch-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.openingId;
        if (onStartPractice) onStartPractice(id);
      });
    });
  }

  // Session History List
  const sessionsTableBody = document.getElementById('prog-sessions-list');
  if (sessionsTableBody) {
    if (sessions.length === 0) {
      sessionsTableBody.innerHTML = `
        <div class="empty-state-card">
          <p class="empty-state-title">No completed practice sessions yet</p>
          <p class="empty-state-subtitle">Complete your first full opening recall drill to start building your training history.</p>
        </div>
      `;
    } else {
      sessionsTableBody.innerHTML = `
        <div class="session-history-table">
          <div class="table-header-row">
            <span>Date</span>
            <span>Opening</span>
            <span>Moves</span>
            <span>Accuracy</span>
          </div>
          ${sessions.map(s => {
            const acc = s.accuracy || 0;
            return `
              <div class="table-data-row">
                <span class="sess-date">${s.date}</span>
                <span class="sess-name"><strong>${s.openingName}</strong></span>
                <span class="sess-moves">${s.correctMoves}/${s.totalMoves} correct</span>
                <span class="sess-acc">
                  <span class="acc-badge ${acc >= 80 ? 'acc-high' : acc >= 50 ? 'acc-mid' : 'acc-low'}">${acc}%</span>
                </span>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }
  }
}

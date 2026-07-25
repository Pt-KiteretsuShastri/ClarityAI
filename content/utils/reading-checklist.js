/* Reading Checklist — Floating interactive checklist overlay */

(function () {
  'use strict';

  const CHECKLIST_CONTAINER_ID = 'clarity-checklist-container';

  window.ClarityChecklist = {
    visible: false,
    items: [],
    container: null,

    /**
     * Show the reading checklist panel
     * @param {Array} items - Array of {text: string} items
     * @param {string} title - Title for the checklist
     */
    show(items, title = 'Key Takeaways') {
      this.items = items || [];
      this._createUI(title);
      this.visible = true;
    },

    /**
     * Hide and remove the checklist panel
     */
    hide() {
      if (this.container?.parentNode) {
        this.container.parentNode.removeChild(this.container);
      }
      this.container = null;
      this.visible = false;
    },

    /**
     * Toggle visibility
     */
    toggle(items, title) {
      if (this.visible) {
        this.hide();
      } else {
        this.show(items, title);
      }
    },

    /**
     * Create the floating UI
     */
    _createUI(title) {
      // Remove existing if any
      this.hide();

      const container = document.createElement('div');
      container.id = CHECKLIST_CONTAINER_ID;

      // Inject styles
      const styles = `
        #${CHECKLIST_CONTAINER_ID} {
          position: fixed;
          top: 80px;
          right: 20px;
          width: 300px;
          max-height: 70vh;
          background: white;
          border: 1px solid #E5E7EB;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1), 0 4px 10px rgba(0,0,0,0.05);
          z-index: 2147483647;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 14px;
          line-height: 1.5;
          color: #1F2937;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        #${CHECKLIST_CONTAINER_ID} .clarity-checklist-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          background: #4F46E5;
          color: white;
          font-weight: 600;
          font-size: 14px;
          cursor: move;
          user-select: none;
        }

        #${CHECKLIST_CONTAINER_ID} .clarity-checklist-title {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        #${CHECKLIST_CONTAINER_ID} .clarity-checklist-close {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          font-size: 18px;
          padding: 0 4px;
          opacity: 0.8;
        }

        #${CHECKLIST_CONTAINER_ID} .clarity-checklist-close:hover {
          opacity: 1;
        }

        #${CHECKLIST_CONTAINER_ID} .clarity-checklist-body {
          padding: 12px 16px;
          overflow-y: auto;
          max-height: calc(70vh - 48px);
        }

        #${CHECKLIST_CONTAINER_ID} .clarity-checklist-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 8px 0;
          border-bottom: 1px solid #F3F4F6;
          cursor: pointer;
        }

        #${CHECKLIST_CONTAINER_ID} .clarity-checklist-item:last-child {
          border-bottom: none;
        }

        #${CHECKLIST_CONTAINER_ID} .clarity-checklist-checkbox {
          width: 18px;
          height: 18px;
          border: 2px solid #D1D5DB;
          border-radius: 4px;
          flex-shrink: 0;
          margin-top: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        #${CHECKLIST_CONTAINER_ID} .clarity-checklist-item.checked .clarity-checklist-checkbox {
          background: #4F46E5;
          border-color: #4F46E5;
        }

        #${CHECKLIST_CONTAINER_ID} .clarity-checklist-item.checked .clarity-checklist-checkbox::after {
          content: '✓';
          color: white;
          font-size: 12px;
          font-weight: bold;
        }

        #${CHECKLIST_CONTAINER_ID} .clarity-checklist-item.checked .clarity-checklist-text {
          text-decoration: line-through;
          color: #9CA3AF;
        }

        #${CHECKLIST_CONTAINER_ID} .clarity-checklist-text {
          flex: 1;
          font-size: 13px;
          line-height: 1.5;
          transition: all 0.2s;
        }

        #${CHECKLIST_CONTAINER_ID} .clarity-checklist-empty {
          padding: 20px;
          text-align: center;
          color: #9CA3AF;
          font-style: italic;
        }

        #${CHECKLIST_CONTAINER_ID} .clarity-checklist-progress {
          padding: 8px 16px;
          background: #F9FAFB;
          border-top: 1px solid #E5E7EB;
          font-size: 12px;
          color: #6B7280;
          text-align: center;
        }

        #${CHECKLIST_CONTAINER_ID} .clarity-checklist-loading {
          padding: 20px;
          text-align: center;
          color: #6B7280;
        }
      `;

      const styleEl = document.createElement('style');
      styleEl.textContent = styles;
      document.head.appendChild(styleEl);
      this._styleEl = styleEl;

      // Build header
      const header = document.createElement('div');
      header.className = 'clarity-checklist-header';
      header.innerHTML = `
        <div class="clarity-checklist-title">
          <span>📋</span>
          <span>${this._escapeHtml(title)}</span>
        </div>
        <button class="clarity-checklist-close" id="clarity-checklist-close">×</button>
      `;

      // Build body with items
      const body = document.createElement('div');
      body.className = 'clarity-checklist-body';
      body.id = 'clarity-checklist-body';

      if (this.items.length === 0) {
        body.innerHTML = '<div class="clarity-checklist-empty">No items to show</div>';
      } else {
        this.items.forEach((item, index) => {
          const itemEl = document.createElement('div');
          itemEl.className = 'clarity-checklist-item';
          itemEl.dataset.index = index;
          itemEl.innerHTML = `
            <div class="clarity-checklist-checkbox"></div>
            <div class="clarity-checklist-text">${this._escapeHtml(item.text)}</div>
          `;
          itemEl.addEventListener('click', () => {
            itemEl.classList.toggle('checked');
            this._updateProgress();
          });
          body.appendChild(itemEl);
        });
      }

      // Build progress bar
      const progress = document.createElement('div');
      progress.className = 'clarity-checklist-progress';
      progress.id = 'clarity-checklist-progress';
      progress.textContent = `0 / ${this.items.length} complete`;

      // Assemble
      container.appendChild(header);
      container.appendChild(body);
      container.appendChild(progress);
      document.body.appendChild(container);

      this.container = container;

      // Close button
      document.getElementById('clarity-checklist-close').addEventListener('click', () => this.hide());

      // Make draggable
      this._makeDraggable(header, container);
    },

    _updateProgress() {
      const total = this.items.length;
      const checked = this.container.querySelectorAll('.clarity-checklist-item.checked').length;
      const progressEl = document.getElementById('clarity-checklist-progress');
      if (progressEl) {
        progressEl.textContent = `${checked} / ${total} complete`;
      }
    },

    _makeDraggable(handle, el) {
      let isDragging = false;
      let startX, startY, origX, origY;

      handle.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        const rect = el.getBoundingClientRect();
        origX = rect.left;
        origY = rect.top;
        el.style.position = 'fixed';
        el.style.left = origX + 'px';
        el.style.top = origY + 'px';
        el.style.right = 'auto';
        el.style.bottom = 'auto';
      });

      document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        el.style.left = (origX + dx) + 'px';
        el.style.top = (origY + dy) + 'px';
      });

      document.addEventListener('mouseup', () => {
        isDragging = false;
      });
    },

    _escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }
  };

})();

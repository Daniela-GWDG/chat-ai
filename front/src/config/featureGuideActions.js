const find = (selector) => document.querySelector(selector);
const click = (selector) => {
  const element = find(selector);
  if (!element) return false;
  element.click();
  return true;
};

function retry(check, attempts = 30, delay = 80) {
  let remaining = attempts;
  const tick = () => {
    let done = false;
    try {
      done = check();
    } catch {
      done = false;
    }
    if (done) return;
    remaining -= 1;
    if (remaining <= 0) return;
    window.setTimeout(tick, delay);
  };
  tick();
}

// The tools popover has collapsible sections; a tour opens a closed one again.
function expandToolSections() {
  retry(() => {
    if (!find('[data-guide^="tools-section-"]')) return false;
    document
      .querySelectorAll('[data-guide^="tools-section-"][aria-expanded="false"]')
      .forEach((toggle) => toggle.click());
    return true;
  });
}

export function openTools() {
  if (!find('[data-guide="tools-flyout"]')) {
    click('[data-guide="tools"]');
  }
  expandToolSections();
}

export function ensureToolsEnabled() {
  openTools();
  retry(() => {
    const toggle = find('[data-guide="tools-enable"]');
    if (!toggle) return false;
    const input = toggle.querySelector('input[type="checkbox"]');
    if (!input) return false;
    if (input.checked) return true;
    toggle.click();
    return true;
  });
}

// `details` also opens the tool's second level (e.g. the Arcana id or MCP input).
export function ensureTool(toolKey, { details = false } = {}) {
  openTools();
  retry(() => {
    // Already on the detail level (it has the same toggle): nothing left to open.
    if (details && find('[data-guide="tool-details"]')) {
      const toggle = find(`[data-guide="tool-${toolKey}"]`);
      if (toggle && !toggle.checked) toggle.click();
      return true;
    }
    const toggle = find('[data-guide="tools-enable"]');
    if (!toggle) return false;
    const input = toggle.querySelector('input[type="checkbox"]');
    if (!input) return false;
    if (!input.checked) {
      toggle.click();
      return false;
    }
    const tool = find(`[data-guide="tool-${toolKey}"]`);
    if (!tool) return false;
    if (!tool.checked) {
      tool.click();
      return false;
    }
    if (details && !find('[data-guide="tool-details"]')) {
      click(`[data-guide="tool-row-${toolKey}"] button`);
      return false;
    }
    return true;
  });
}

export function openLocalTools() {
  if (!find('[data-guide="tools-flyout"]')) {
    click('[data-guide="tools"]');
  }
  expandToolSections();
}

export function openUserSettings() {
  if (find('[data-guide="settings-tab-chat"]')) return;
  if (click('[data-guide="user-settings"]')) return;
  if (click(".user-profile-button")) return;
  click(".user-profile-block");
}

export function selectSettingsTab(tabId) {
  openUserSettings();
  retry(() => {
    const tab = find(`[data-guide="settings-tab-${tabId}"]`);
    if (!tab) return false;
    if (tab.getAttribute("aria-pressed") !== "true") {
      tab.click();
    }
    return true;
  });
}

export function openConversationSettings() {
  if (!find('[data-guide="conversation-settings-panel"]')) {
    click(".settings-toggle");
  }
}

export function openConversationMenu() {
  if (
    !find('[data-guide="export-chat"]') &&
    !find('[data-guide="summarize-chat"]')
  ) {
    click('[data-guide="conversation-menu"]');
  }
}

export function openTopicMenu() {
  if (!find('[data-guide="pin-topic-menu-item"]')) {
    click('[data-guide="topic-menu"]');
  }
}

export function openSearch() {
  if (!find('[data-guide="search-input"]')) {
    click('[data-guide="search-chats"]');
  }
}

export function openSortMenu() {
  if (!find('[data-guide="sort-menu"]')) {
    click('[data-guide="sort-chats"]');
  }
}

export function openTopicCreate() {
  if (!find('[data-guide="topic-create-input"]')) {
    click('[data-guide="create-topic"]');
  }
}

export function isOutsideMetaChat() {
  return typeof window !== "undefined" && window.location.pathname !== "/meta";
}

export function hasAttachmentCard() {
  return !!find('[data-guide="attachment-card"]');
}

export function attachmentProcessed() {
  return hasAttachmentCard() && !find('[data-guide="process-file"]');
}

export function toolsPanelOpen() {
  return !!find('[data-guide="tools-enable"]');
}

export function toolsAreEnabled() {
  const toggle = find('[data-guide="tools-enable"]');
  const input = toggle?.querySelector('input[type="checkbox"]');
  return !!input?.checked;
}

export function isToolActive(toolKey) {
  const tool = find(`[data-guide="tool-${toolKey}"]`);
  return !!tool?.checked;
}

export function arcanaIdEntered() {
  const input = find('[data-guide="arcana-id"]');
  return !!input?.value?.trim();
}

export function mcpConfigured() {
  const input = find('[data-guide="mcp-input"]');
  return !!input?.value?.trim();
}

export function userSettingsOpen() {
  return !!find('[data-guide="settings-tab-chat"]');
}

export function settingsTabActive(tabId) {
  const tab = find(`[data-guide="settings-tab-${tabId}"]`);
  return tab?.getAttribute("aria-pressed") === "true";
}

export function searchHasQuery() {
  const input = find('[data-guide="search-input"]');
  return !!input?.value?.trim();
}

export function topicNameEntered() {
  const input = find('[data-guide="topic-create-input"]');
  return !!input?.value?.trim();
}

export function conversationMenuOpen() {
  return !!find('[data-guide="export-chat"]') || !!find('[data-guide="summarize-chat"]');
}

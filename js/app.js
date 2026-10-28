(() => {
  "use strict";

  const elements = Array.isArray(window.PERIODIC_ELEMENTS) ? window.PERIODIC_ELEMENTS : [];
  const editorial = window.ELEMENT_EDITORIAL || {};

  const categories = [
    {
      id: "alkali", label: "Metales alcalinos", singular: "Metal alcalino", css: "--alkali",
      description: "Grupo 1, sin contar el hidrógeno. Son metales blandos y muy reactivos: tienen un solo electrón en su última capa y reaccionan con el agua formando hidróxidos.",
    },
    {
      id: "alkaline", label: "Alcalinotérreos", singular: "Metal alcalinotérreo", css: "--alkaline",
      description: "Grupo 2. Metales reactivos, aunque menos que los alcalinos, con dos electrones en su última capa. El calcio y el magnesio son los más conocidos.",
    },
    {
      id: "transition", label: "Metales de transición", singular: "Metal de transición", css: "--transition",
      description: "Ocupan los grupos 3 al 12. Suelen ser metales duros, brillantes y buenos conductores del calor y la electricidad, como el hierro, el cobre y el oro.",
    },
    {
      id: "post-transition", label: "Metales postransición", singular: "Metal postransición", css: "--post-transition",
      description: "Metales situados entre los de transición y los metaloides, como el aluminio, el estaño y el plomo. Son más blandos y se funden a temperaturas más bajas.",
    },
    {
      id: "metalloid", label: "Metaloides", singular: "Metaloide", css: "--metalloid",
      description: "Tienen propiedades intermedias entre los metales y los no metales. Algunos, como el silicio y el germanio, son semiconductores y se usan en la electrónica.",
    },
    {
      id: "nonmetal", label: "No metales", singular: "No metal", css: "--nonmetal",
      description: "Conducen mal el calor y la electricidad y tienden a ganar o compartir electrones. Incluyen el hidrógeno, el carbono, el nitrógeno y el oxígeno, esenciales para la vida.",
    },
    {
      id: "halogen", label: "Halógenos", singular: "Halógeno", css: "--halogen",
      description: "Grupo 17. Muy reactivos, con siete electrones en su última capa. Su nombre significa «formadores de sales»: al unirse con metales forman sales como la sal común.",
    },
    {
      id: "noble", label: "Gases nobles", singular: "Gas noble", css: "--noble",
      description: "Grupo 18. Tienen su última capa de electrones completa, por eso casi no reaccionan. Son gases incoloros, como el helio, el neón y el argón.",
    },
    {
      id: "lanthanide", label: "Lantánidos", singular: "Lantánido", css: "--lanthanide",
      description: "Van del lantano (57) al lutecio (71) y se muestran en una fila aparte. Son metales que se usan en imanes potentes, láseres y pantallas.",
    },
    {
      id: "actinide", label: "Actínidos", singular: "Actínido", css: "--actinide",
      description: "Van del actinio (89) al laurencio (103) y se muestran en la última fila. Todos son radiactivos; el uranio y el plutonio se usan como combustible nuclear.",
    },
  ];

  const categoryById = new Map(categories.map((category) => [category.id, category]));
  const elementByNumber = new Map(elements.map((element) => [element.atomicNumber, element]));
  const elementBySymbol = new Map(elements.map((element) => [element.symbol, element]));
  const gridCards = new Map();

  const state = {
    query: "",
    categories: new Set(),
    view: "table",
    activeSuggestion: -1,
    suggestions: [],
    focusedAtomicNumber: 1,
    lastDialogTrigger: null,
    closeTimer: null,
    popoverCategory: null,
  };

  const refs = {
    header: document.querySelector(".app-header"),
    themeToggle: document.querySelector("#theme-toggle"),
    themeMeta: document.querySelector('meta[name="theme-color"]'),
    search: document.querySelector("#element-search"),
    searchWrap: document.querySelector(".search-wrap"),
    searchClear: document.querySelector("#search-clear"),
    suggestions: document.querySelector("#search-suggestions"),
    filters: document.querySelector("#category-filters"),
    familyNote: document.querySelector("#family-note"),
    explorer: document.querySelector("#explorar"),
    legendSection: document.querySelector(".legend-section"),
    legend: document.querySelector("#category-legend"),
    familyPopover: document.querySelector("#family-popover"),
    familyPopoverTitle: document.querySelector("#family-popover-title"),
    familyPopoverCount: document.querySelector("#family-popover-count"),
    familyPopoverText: document.querySelector("#family-popover-text"),
    familyPopoverClose: document.querySelector("#family-popover-close"),
    familyPopoverShow: document.querySelector("#family-popover-show"),
    reset: document.querySelector("#reset-filters"),
    emptyReset: document.querySelector("#empty-reset"),
    results: document.querySelector("#results-status"),
    grid: document.querySelector("#periodic-grid"),
    periodicScroll: document.querySelector("#periodic-scroll"),
    empty: document.querySelector("#empty-result"),
    tableView: document.querySelector("#table-view"),
    listView: document.querySelector("#list-view"),
    list: document.querySelector("#element-list"),
    viewOptions: [...document.querySelectorAll(".view-option")],
    cardTemplate: document.querySelector("#element-card-template"),
    random: document.querySelector("#random-element"),
    featured: document.querySelector("#featured-element"),
    featuredNumber: document.querySelector("#featured-number"),
    featuredSymbol: document.querySelector("#featured-symbol"),
    featuredName: document.querySelector("#featured-name"),
    featuredMass: document.querySelector("#featured-mass"),
    dialog: document.querySelector("#element-dialog"),
    dialogShell: document.querySelector(".dialog-shell"),
    dialogClose: document.querySelector("#dialog-close"),
    detailContextDot: document.querySelector("#detail-context-dot"),
    detailSymbolCard: document.querySelector("#detail-symbol-card"),
    detailNumber: document.querySelector("#detail-number"),
    detailSymbol: document.querySelector("#detail-symbol"),
    detailMass: document.querySelector("#detail-mass"),
    detailCategory: document.querySelector("#detail-category"),
    detailName: document.querySelector("#detail-name"),
    detailSubtitle: document.querySelector("#detail-subtitle"),
    detailDescription: document.querySelector("#detail-description"),
    identityProperties: document.querySelector("#identity-properties"),
    detailConfiguration: document.querySelector("#detail-configuration"),
    detailShells: document.querySelector("#detail-shells"),
    shellVisual: document.querySelector("#shell-visual"),
    atomicProperties: document.querySelector("#atomic-properties"),
    physicalProperties: document.querySelector("#physical-properties"),
    historyProperties: document.querySelector("#history-properties"),
    detailUses: document.querySelector("#detail-uses"),
    detailFacts: document.querySelector("#detail-facts"),
    detailSource: document.querySelector("#detail-source"),
  };

  const normalize = (value) =>
    String(value ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase("es")
      .trim();

  const formatNumber = (value, maximumFractionDigits = 4) =>
    new Intl.NumberFormat("es-ES", {
      maximumFractionDigits,
      minimumFractionDigits: 0,
    }).format(value);

  function validateDataset() {
    const numbers = new Set(elements.map((element) => element.atomicNumber));
    const symbols = new Set(elements.map((element) => element.symbol));
    const validCategories = new Set(categories.map((category) => category.id));
    const errors = [];

    if (elements.length !== 118) errors.push(`Se recibieron ${elements.length} elementos, no 118.`);
    if (numbers.size !== 118 || symbols.size !== 118) errors.push("Hay números atómicos o símbolos duplicados.");

    elements.forEach((element, index) => {
      if (element.atomicNumber !== index + 1) errors.push(`Orden incorrecto en Z=${element.atomicNumber}.`);
      if (!validCategories.has(element.category)) errors.push(`Categoría inválida en ${element.symbol}.`);
      if (!Array.isArray(element.shells) || element.shells.reduce((sum, value) => sum + value, 0) !== element.atomicNumber) {
        errors.push(`Capas electrónicas inconsistentes en ${element.symbol}.`);
      }
      if (!editorial[element.symbol]) errors.push(`Falta contenido editorial para ${element.symbol}.`);
    });

    if (errors.length) {
      console.error("Elementa: el dataset no superó la validación", errors);
      refs.results.textContent = "No fue posible validar todos los datos.";
      return false;
    }

    console.info("Elementa: dataset validado — 118 elementos únicos.");
    return true;
  }

  function categoryColor(categoryId) {
    return `var(${categoryById.get(categoryId)?.css || "--primary"})`;
  }

  function createCard(element) {
    const card = refs.cardTemplate.content.firstElementChild.cloneNode(true);
    card.classList.add(`category--${element.category}`);
    card.dataset.atomicNumber = String(element.atomicNumber);
    card.dataset.row = String(element.gridRow);
    card.dataset.column = String(element.gridColumn);
    card.style.gridColumn = String(element.gridColumn + 1);
    card.style.gridRow = String(element.gridRow + 1);
    card.style.setProperty("--category-color", categoryColor(element.category));
    card.setAttribute(
      "aria-label",
      `${element.name}, símbolo ${element.symbol}, número atómico ${element.atomicNumber}, masa ${element.atomicMass}`,
    );
    card.title = `${element.name} · ${categoryById.get(element.category).singular}`;
    card.querySelector(".element-number").textContent = element.atomicNumber;
    card.querySelector(".element-symbol").textContent = element.symbol;
    card.querySelector(".element-name").textContent = element.name;
    card.querySelector(".element-mass").textContent = `${element.atomicMass} u`;
    card.tabIndex = element.atomicNumber === state.focusedAtomicNumber ? 0 : -1;
    return card;
  }

  function addGridLabels() {
    const fragment = document.createDocumentFragment();

    for (let group = 1; group <= 18; group += 1) {
      const label = document.createElement("span");
      label.className = "group-label";
      label.textContent = group;
      label.style.gridColumn = String(group + 1);
      label.style.gridRow = "1";
      label.setAttribute("aria-hidden", "true");
      fragment.append(label);
    }

    for (let period = 1; period <= 7; period += 1) {
      const label = document.createElement("span");
      label.className = "period-label";
      label.textContent = period;
      label.style.gridColumn = "1";
      label.style.gridRow = String(period + 1);
      label.setAttribute("aria-hidden", "true");
      fragment.append(label);
    }

    [
      { text: "Ln", row: 10, category: "lanthanide" },
      { text: "Ac", row: 11, category: "actinide" },
    ].forEach((series) => {
      const label = document.createElement("span");
      label.className = `series-label category--${series.category}`;
      label.textContent = series.text;
      label.style.gridColumn = "1";
      label.style.gridRow = String(series.row);
      label.style.setProperty("--category-color", categoryColor(series.category));
      label.setAttribute("aria-hidden", "true");
      fragment.append(label);
    });

    [
      { range: "57–71", text: "Lantánidos", row: 7, category: "lanthanide" },
      { range: "89–103", text: "Actínidos", row: 8, category: "actinide" },
    ].forEach((series) => {
      const placeholder = document.createElement("span");
      placeholder.className = `series-placeholder category--${series.category}`;
      placeholder.style.gridColumn = "4";
      placeholder.style.gridRow = String(series.row);
      placeholder.style.setProperty("--category-color", categoryColor(series.category));
      placeholder.innerHTML = `<strong>${series.range}</strong><span>${series.text}</span>`;
      placeholder.setAttribute("aria-hidden", "true");
      fragment.append(placeholder);
    });

    // Hueco libre de los períodos 1 a 3 entre los grupos 3 y 12.
    const crest = document.createElement("div");
    crest.className = "table-crest";
    crest.style.gridColumn = "4 / 14";
    crest.style.gridRow = "2 / 5";
    crest.setAttribute("aria-hidden", "true");
    crest.innerHTML = `
      <img src="img/logo-jfk.png" alt="" width="150" height="150" />
      <span class="table-crest-copy">
        <small>Institución Educativa</small>
        <strong>John F. Kennedy</strong>
        <span>Puerto Boyacá · Tabla periódica de los elementos</span>
      </span>
    `;
    fragment.append(crest);

    refs.grid.append(fragment);
  }

  function renderGrid() {
    refs.grid.replaceChildren();
    addGridLabels();
    const fragment = document.createDocumentFragment();

    elements.forEach((element) => {
      const card = createCard(element);
      gridCards.set(element.atomicNumber, card);
      fragment.append(card);
    });

    refs.grid.append(fragment);
  }

  function renderFiltersAndLegend() {
    const filterFragment = document.createDocumentFragment();
    const allButton = document.createElement("button");
    allButton.type = "button";
    allButton.className = "filter-chip is-active";
    allButton.dataset.category = "all";
    allButton.setAttribute("aria-pressed", "true");
    allButton.innerHTML = "<i></i> Todas";
    filterFragment.append(allButton);

    categories.forEach((category) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "filter-chip";
      button.dataset.category = category.id;
      button.setAttribute("aria-pressed", "false");
      button.style.setProperty("--category-color", `var(${category.css})`);
      button.innerHTML = `<i></i>${category.label}`;
      filterFragment.append(button);
    });

    refs.filters.append(filterFragment);

    const legendFragment = document.createDocumentFragment();
    categories.forEach((category) => {
      const item = document.createElement("button");
      item.type = "button";
      item.className = "legend-item";
      item.dataset.category = category.id;
      item.style.setProperty("--category-color", `var(${category.css})`);
      item.setAttribute("aria-expanded", "false");
      item.setAttribute("aria-controls", "family-popover");
      item.innerHTML = `
        <i></i><span>${category.label}</span>
        <svg class="legend-info" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="7.2"></circle><path d="M10 9v4.6M10 6.4v.1"></path></svg>
      `;
      legendFragment.append(item);
    });
    refs.legend.append(legendFragment);
  }

  function categoryCount(categoryId) {
    const count = elements.filter((element) => element.category === categoryId).length;
    return `${count} ${count === 1 ? "elemento" : "elementos"}`;
  }

  function renderFamilyNote() {
    const category = categoryById.get([...state.categories].at(-1));
    refs.familyNote.hidden = !category;
    if (!category) return;
    refs.familyNote.style.setProperty("--category-color", `var(${category.css})`);
    refs.familyNote.innerHTML = `
      <i aria-hidden="true"></i>
      <span><strong>${category.label}</strong> · ${categoryCount(category.id)}. ${category.description}</span>
    `;
  }

  function positionFamilyPopover(trigger) {
    const sectionRect = refs.legendSection.getBoundingClientRect();
    const triggerRect = trigger.getBoundingClientRect();
    const width = refs.familyPopover.offsetWidth;
    const triggerLeft = triggerRect.left - sectionRect.left;
    const left = Math.max(12, Math.min(triggerLeft, sectionRect.width - width - 12));
    refs.familyPopover.style.left = `${left}px`;
    refs.familyPopover.style.top = `${triggerRect.bottom - sectionRect.top + 10}px`;
    const arrowLeft = Math.max(12, Math.min(triggerLeft - left + 7, width - 24));
    refs.familyPopover.style.setProperty("--arrow-left", `${arrowLeft}px`);
  }

  function openFamilyPopover(trigger) {
    const category = categoryById.get(trigger.dataset.category);
    if (!category) return;
    state.popoverCategory = category.id;
    refs.familyPopover.style.setProperty("--category-color", `var(${category.css})`);
    refs.familyPopoverTitle.textContent = category.label;
    refs.familyPopoverCount.textContent = categoryCount(category.id);
    refs.familyPopoverText.textContent = category.description;
    refs.legend.querySelectorAll(".legend-item").forEach((item) => {
      const active = item === trigger;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-expanded", String(active));
    });
    refs.familyPopover.hidden = false;
    positionFamilyPopover(trigger);
  }

  function closeFamilyPopover({ restoreFocus = false } = {}) {
    if (refs.familyPopover.hidden) return;
    const trigger = refs.legend.querySelector(`[data-category="${state.popoverCategory}"]`);
    refs.familyPopover.hidden = true;
    state.popoverCategory = null;
    refs.legend.querySelectorAll(".legend-item").forEach((item) => {
      item.classList.remove("is-active");
      item.setAttribute("aria-expanded", "false");
    });
    if (restoreFocus) trigger?.focus();
  }

  function showCategoryInTable(categoryId) {
    state.query = "";
    refs.search.value = "";
    state.categories.clear();
    state.categories.add(categoryId);
    closeFamilyPopover();
    updateResults();
    refs.explorer.scrollIntoView({ block: "start" });
  }

  function searchableText(element) {
    return normalize(
      [element.name, element.symbol, element.atomicNumber, ...(element.aliases || [])].join(" "),
    );
  }

  function getSearchMatches(query = state.query) {
    const normalizedQuery = normalize(query);
    const categoryPool = elements.filter(
      (element) => state.categories.size === 0 || state.categories.has(element.category),
    );

    if (!normalizedQuery) return categoryPool;

    if (/^\d+$/.test(normalizedQuery)) {
      return categoryPool.filter((element) => String(element.atomicNumber) === normalizedQuery);
    }

    const exactSymbol = categoryPool.find(
      (element) => normalize(element.symbol) === normalizedQuery,
    );
    if (exactSymbol && normalizedQuery.length <= 3) return [exactSymbol];

    return categoryPool.filter((element) => searchableText(element).includes(normalizedQuery));
  }

  function searchScore(element, query) {
    const q = normalize(query);
    const name = normalize(element.name);
    const symbol = normalize(element.symbol);
    const aliases = (element.aliases || []).map(normalize);
    if (String(element.atomicNumber) === q || symbol === q) return 0;
    if (name === q || aliases.includes(q)) return 1;
    if (symbol.startsWith(q)) return 2;
    if (name.startsWith(q) || aliases.some((alias) => alias.startsWith(q))) return 3;
    return 4;
  }

  function getSuggestions() {
    if (!state.query.trim()) return [];
    const q = normalize(state.query);
    const categoryPool = elements.filter(
      (element) => state.categories.size === 0 || state.categories.has(element.category),
    );

    return categoryPool
      .filter((element) => searchableText(element).includes(q))
      .sort((a, b) => searchScore(a, q) - searchScore(b, q) || a.atomicNumber - b.atomicNumber)
      .slice(0, 6);
  }

  function renderSuggestions() {
    state.suggestions = getSuggestions();
    state.activeSuggestion = -1;
    refs.suggestions.replaceChildren();

    if (!state.suggestions.length || !document.activeElement?.isSameNode(refs.search)) {
      closeSuggestions();
      return;
    }

    const fragment = document.createDocumentFragment();
    state.suggestions.forEach((element, index) => {
      const item = document.createElement("li");
      item.role = "option";
      item.id = `suggestion-${element.atomicNumber}`;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "suggestion-button";
      button.dataset.atomicNumber = String(element.atomicNumber);
      button.style.setProperty("--category-color", categoryColor(element.category));
      button.innerHTML = `
        <span class="suggestion-symbol">${element.symbol}</span>
        <span class="suggestion-copy"><strong>${element.name}</strong><span>${categoryById.get(element.category).singular}</span></span>
        <span class="suggestion-number">Z = ${element.atomicNumber}</span>
      `;
      button.setAttribute("aria-label", `Abrir ${element.name}`);
      item.append(button);
      fragment.append(item);
      if (index === state.activeSuggestion) button.classList.add("is-active");
    });

    refs.suggestions.append(fragment);
    refs.suggestions.hidden = false;
    refs.search.setAttribute("aria-expanded", "true");
  }

  function closeSuggestions() {
    refs.suggestions.hidden = true;
    refs.search.setAttribute("aria-expanded", "false");
    refs.search.removeAttribute("aria-activedescendant");
    state.activeSuggestion = -1;
  }

  function moveSuggestion(direction) {
    if (!state.suggestions.length) return;
    state.activeSuggestion =
      (state.activeSuggestion + direction + state.suggestions.length) % state.suggestions.length;
    const buttons = [...refs.suggestions.querySelectorAll(".suggestion-button")];
    buttons.forEach((button, index) => button.classList.toggle("is-active", index === state.activeSuggestion));
    const active = state.suggestions[state.activeSuggestion];
    refs.search.setAttribute("aria-activedescendant", `suggestion-${active.atomicNumber}`);
  }

  function matchesCurrentFilters(element) {
    const matchesCategory = state.categories.size === 0 || state.categories.has(element.category);
    if (!matchesCategory) return false;
    if (!state.query.trim()) return true;
    return getSearchMatches().some((match) => match.atomicNumber === element.atomicNumber);
  }

  function updateGrid(matches) {
    const matchedNumbers = new Set(matches.map((element) => element.atomicNumber));
    gridCards.forEach((card, atomicNumber) => {
      const isMatch = matchedNumbers.has(atomicNumber);
      card.classList.toggle("is-muted", !isMatch);
      card.classList.toggle("is-focus-match", Boolean(state.query) && isMatch && matches.length === 1);
      card.setAttribute("aria-disabled", String(!isMatch));
      card.tabIndex = isMatch && atomicNumber === state.focusedAtomicNumber ? 0 : -1;
    });

    if (!matchedNumbers.has(state.focusedAtomicNumber) && matches.length) {
      state.focusedAtomicNumber = matches[0].atomicNumber;
      gridCards.get(state.focusedAtomicNumber).tabIndex = 0;
    }
  }

  function renderList(matches) {
    refs.list.replaceChildren();
    if (!matches.length) {
      const empty = document.createElement("p");
      empty.className = "list-empty";
      empty.textContent = "No encontramos elementos con esos criterios.";
      refs.list.append(empty);
      return;
    }

    const fragment = document.createDocumentFragment();
    matches.forEach((element) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `list-element category--${element.category}`;
      button.dataset.atomicNumber = String(element.atomicNumber);
      button.style.setProperty("--category-color", categoryColor(element.category));
      button.setAttribute("aria-label", `Abrir ficha de ${element.name}`);
      button.innerHTML = `
        <strong class="list-element-symbol">${element.symbol}</strong>
        <span class="list-element-name">${element.name}</span>
        <span class="list-element-meta">Z = ${element.atomicNumber} · ${categoryById.get(element.category).singular}</span>
        <span class="list-element-mass">${element.atomicMass} u</span>
      `;
      fragment.append(button);
    });
    refs.list.append(fragment);
  }

  function updateFilterButtons() {
    refs.filters.querySelectorAll(".filter-chip").forEach((button) => {
      const id = button.dataset.category;
      const active = id === "all" ? state.categories.size === 0 : state.categories.has(id);
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }

  function updateResults() {
    const matches = getSearchMatches();
    const count = matches.length;
    const hasCriteria = Boolean(state.query.trim()) || state.categories.size > 0;

    updateGrid(matches);
    renderList(matches);
    refs.empty.hidden = count !== 0 || state.view !== "table";
    refs.reset.hidden = !hasCriteria;
    refs.searchClear.hidden = !state.query;
    refs.searchWrap.classList.toggle("has-value", Boolean(state.query));

    if (!hasCriteria) {
      refs.results.textContent = "Mostrando los 118 elementos";
    } else if (count === 0) {
      refs.results.textContent = "Sin elementos encontrados";
    } else {
      refs.results.textContent = `${count} ${count === 1 ? "elemento encontrado" : "elementos encontrados"}`;
    }

    updateFilterButtons();
    renderFamilyNote();
    renderSuggestions();
  }

  function resetFilters({ focusSearch = false } = {}) {
    state.query = "";
    state.categories.clear();
    refs.search.value = "";
    closeSuggestions();
    updateResults();
    if (focusSearch) refs.search.focus();
  }

  function setView(view) {
    state.view = view === "list" ? "list" : "table";
    refs.tableView.hidden = state.view !== "table";
    refs.listView.hidden = state.view !== "list";
    refs.viewOptions.forEach((button) => {
      const active = button.dataset.view === state.view;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    refs.empty.hidden = getSearchMatches().length !== 0 || state.view !== "table";
  }

  function setRovingFocus(card) {
    gridCards.forEach((item) => { item.tabIndex = -1; });
    card.tabIndex = 0;
    state.focusedAtomicNumber = Number(card.dataset.atomicNumber);
    card.focus({ preventScroll: true });
    card.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
  }

  function navigateGrid(currentCard, key) {
    const row = Number(currentCard.dataset.row);
    const column = Number(currentCard.dataset.column);
    const available = [...gridCards.values()].filter((card) => !card.classList.contains("is-muted"));
    let candidates = [];

    if (key === "ArrowLeft" || key === "ArrowRight") {
      const direction = key === "ArrowLeft" ? -1 : 1;
      candidates = available
        .filter(
          (card) => Number(card.dataset.row) === row &&
            Math.sign(Number(card.dataset.column) - column) === direction,
        )
        .sort((a, b) =>
          Math.abs(Number(a.dataset.column) - column) - Math.abs(Number(b.dataset.column) - column),
        );
    } else {
      const direction = key === "ArrowUp" ? -1 : 1;
      candidates = available
        .filter((card) => Math.sign(Number(card.dataset.row) - row) === direction)
        .sort((a, b) => {
          const aRow = Math.abs(Number(a.dataset.row) - row);
          const bRow = Math.abs(Number(b.dataset.row) - row);
          const aColumn = Math.abs(Number(a.dataset.column) - column);
          const bColumn = Math.abs(Number(b.dataset.column) - column);
          return aRow * 30 + aColumn - (bRow * 30 + bColumn);
        });
    }

    if (candidates[0]) setRovingFocus(candidates[0]);
  }

  function superscriptConfiguration(configuration) {
    const superscripts = { 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹" };
    return String(configuration || "No determinada").replace(/([spdfg])(\d+)/gi, (_, orbital, count) =>
      orbital + [...count].map((digit) => superscripts[digit]).join(""),
    );
  }

  function stateLabel(element) {
    if (!element.state) return "No determinado";
    const labels = { solid: "Sólido", liquid: "Líquido", gas: "Gas" };
    const suffix = element.stateStatus === "estimated" ? " (estimado)" : "";
    return `${labels[element.state]}${suffix}`;
  }

  function groupLabel(element) {
    return element.group == null ? "Serie f · sin grupo asignado" : `Grupo ${element.group}`;
  }

  function formatTemperature(kelvin) {
    if (kelvin == null) return { main: "No determinado", sub: "" };
    const celsius = kelvin - 273.15;
    return {
      main: `${formatNumber(kelvin, 3)} K`,
      sub: `${celsius < 0 ? "−" : ""}${formatNumber(Math.abs(celsius), 2)} °C`,
    };
  }

  function formatDensity(value) {
    if (value == null) return { main: "No determinada", sub: "" };
    const digits = value < 0.01 ? 8 : value < 1 ? 5 : 3;
    return { main: formatNumber(value, digits), sub: "g/cm³" };
  }

  function appendProperties(container, properties, className = "property-item") {
    container.replaceChildren();
    const fragment = document.createDocumentFragment();
    properties.forEach(({ label, value, sub = "" }) => {
      const wrapper = document.createElement("div");
      wrapper.className = className;
      const term = document.createElement("dt");
      term.textContent = label;
      const description = document.createElement("dd");
      description.textContent = value ?? "No determinado";
      if (sub) {
        const small = document.createElement("small");
        small.textContent = ` · ${sub}`;
        description.append(small);
      }
      wrapper.append(term, description);
      fragment.append(wrapper);
    });
    container.append(fragment);
  }

  function renderShells(shells) {
    refs.detailShells.replaceChildren();
    shells.forEach((count, index) => {
      const chip = document.createElement("span");
      chip.className = "shell-chip";
      chip.textContent = count;
      chip.title = `Nivel ${index + 1}: ${count} electrones`;
      refs.detailShells.append(chip);
    });

    refs.shellVisual.replaceChildren();
    const nucleus = document.createElement("span");
    nucleus.className = "shell-nucleus";
    refs.shellVisual.append(nucleus);
    const count = shells.length;
    shells.forEach((_, index) => {
      const ring = document.createElement("span");
      ring.className = "shell-ring";
      const size = count === 1 ? 34 : 17 + (index * 39) / (count - 1);
      ring.style.width = `${size}px`;
      ring.style.height = `${size}px`;
      ring.style.transform = `translate(-50%, -50%) rotate(${index * 31}deg)`;
      refs.shellVisual.append(ring);
    });
  }

  function renderTextList(container, items) {
    container.replaceChildren();
    const values = Array.isArray(items) && items.length ? items : ["Información no disponible."];
    values.forEach((item) => {
      const listItem = document.createElement("li");
      listItem.textContent = item;
      container.append(listItem);
    });
  }

  function openElement(atomicNumber, trigger = document.activeElement) {
    const element = elementByNumber.get(Number(atomicNumber));
    if (!element) return;
    const copy = editorial[element.symbol] || {};
    const category = categoryById.get(element.category);
    const color = categoryColor(element.category);

    state.lastDialogTrigger = trigger instanceof HTMLElement ? trigger : null;
    refs.dialog.style.setProperty("--detail-color", color);
    refs.detailNumber.textContent = element.atomicNumber;
    refs.detailSymbol.textContent = element.symbol;
    refs.detailMass.textContent = `${element.atomicMass} u`;
    refs.detailCategory.textContent = category.singular;
    refs.detailName.textContent = element.name;
    refs.detailSubtitle.textContent = `Elemento ${element.atomicNumber} · Período ${element.period}`;
    refs.detailDescription.textContent = element.description;
    refs.detailConfiguration.textContent = superscriptConfiguration(element.electronConfiguration) +
      (element.configurationStatus === "predicted" ? " · predicha" : "");

    appendProperties(refs.identityProperties, [
      { label: "Símbolo", value: element.symbol },
      { label: "Número atómico", value: String(element.atomicNumber) },
      { label: "Categoría", value: category.singular },
      { label: "Grupo", value: groupLabel(element) },
      { label: "Período", value: String(element.period) },
      { label: "Bloque", value: `Bloque ${String(element.block).toUpperCase()}` },
    ]);

    renderShells(element.shells);
    appendProperties(refs.atomicProperties, [
      {
        label: "Electronegatividad",
        value: element.electronegativity == null ? "No determinada" : formatNumber(element.electronegativity, 2),
        sub: element.electronegativity == null ? "" : "escala de Pauling",
      },
    ]);

    const density = formatDensity(element.density);
    const melting = formatTemperature(element.meltingPoint);
    const boiling = formatTemperature(element.boilingPoint);
    appendProperties(refs.physicalProperties, [
      { label: "Estado de la materia", value: stateLabel(element) },
      { label: "Densidad", value: density.main, sub: density.sub },
      { label: "Punto de fusión", value: melting.main, sub: melting.sub },
      { label: "Punto de ebullición", value: boiling.main, sub: boiling.sub },
    ]);

    appendProperties(
      refs.historyProperties,
      [
        {
          label: "Descubrimiento",
          value: element.discoveryYear ? String(element.discoveryYear) : element.discoveryLabel || "No determinado",
        },
        { label: "Descubridor", value: element.discoveredBy || "No determinado" },
        { label: "Origen del nombre", value: copy.origin || "No documentado en esta edición." },
      ],
      "history-item",
    );

    renderTextList(refs.detailUses, copy.uses);
    renderTextList(refs.detailFacts, copy.facts);
    refs.detailSource.href = element.sourceUrl;

    if (!refs.dialog.open) {
      refs.dialog.classList.remove("is-closing");
      refs.dialog.showModal();
      document.body.classList.add("dialog-open");
    }
    refs.dialog.querySelector(".dialog-scroll").scrollTop = 0;
    requestAnimationFrame(() => refs.dialogClose.focus());
  }

  function closeDialog() {
    if (!refs.dialog.open || refs.dialog.classList.contains("is-closing")) return;
    window.clearTimeout(state.closeTimer);
    refs.dialog.classList.add("is-closing");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    state.closeTimer = window.setTimeout(() => {
      refs.dialog.close();
      refs.dialog.classList.remove("is-closing");
      document.body.classList.remove("dialog-open");
      if (state.lastDialogTrigger?.isConnected) state.lastDialogTrigger.focus({ preventScroll: true });
    }, reducedMotion ? 0 : 230);
  }

  function setFeaturedElement() {
    const startOfYear = new Date(new Date().getFullYear(), 0, 0);
    const dayOfYear = Math.floor((Date.now() - startOfYear.getTime()) / 86400000);
    const element = elements[(dayOfYear - 1 + elements.length) % elements.length] || elements[5];
    refs.featured.dataset.atomicNumber = String(element.atomicNumber);
    refs.featured.style.setProperty("--featured-color", categoryColor(element.category));
    refs.featuredNumber.textContent = element.atomicNumber;
    refs.featuredSymbol.textContent = element.symbol;
    refs.featuredName.textContent = element.name;
    refs.featuredMass.textContent = `${element.atomicMass} u`;
    refs.featured.setAttribute("aria-label", `Abrir elemento del día: ${element.name}`);
  }

  function applyTheme(theme, persist = true) {
    document.documentElement.dataset.theme = theme;
    const isDark = theme === "dark";
    refs.themeToggle.setAttribute("aria-label", isDark ? "Activar modo claro" : "Activar modo oscuro");
    refs.themeToggle.title = isDark ? "Modo claro" : "Modo oscuro";
    refs.themeMeta?.setAttribute("content", isDark ? "#090e19" : "#f5f7fb");
    if (persist) {
      try { localStorage.setItem("elementa-theme", theme); } catch { /* file:// puede bloquear almacenamiento */ }
    }
  }

  function initializeTheme() {
    let saved = null;
    try { saved = localStorage.getItem("elementa-theme"); } catch { /* se usa preferencia del sistema */ }
    const preferred = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    applyTheme(saved === "dark" || saved === "light" ? saved : preferred, false);
  }

  function bindEvents() {
    window.addEventListener("scroll", () => refs.header.classList.toggle("is-scrolled", window.scrollY > 8), { passive: true });

    refs.themeToggle.addEventListener("click", () => {
      applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
    });

    refs.search.addEventListener("input", (event) => {
      state.query = event.target.value;
      updateResults();
    });

    refs.search.addEventListener("focus", renderSuggestions);
    refs.search.addEventListener("blur", () => window.setTimeout(closeSuggestions, 140));
    refs.search.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        if (refs.suggestions.hidden) renderSuggestions();
        moveSuggestion(1);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        moveSuggestion(-1);
      } else if (event.key === "Enter") {
        const selected = state.suggestions[state.activeSuggestion] || state.suggestions[0];
        if (selected) {
          event.preventDefault();
          closeSuggestions();
          openElement(selected.atomicNumber, refs.search);
        }
      } else if (event.key === "Escape") {
        closeSuggestions();
      }
    });

    refs.searchClear.addEventListener("click", () => {
      state.query = "";
      refs.search.value = "";
      updateResults();
      refs.search.focus();
    });

    refs.suggestions.addEventListener("mousedown", (event) => event.preventDefault());
    refs.suggestions.addEventListener("click", (event) => {
      const button = event.target.closest(".suggestion-button");
      if (button) {
        closeSuggestions();
        openElement(Number(button.dataset.atomicNumber), refs.search);
      }
    });

    refs.filters.addEventListener("click", (event) => {
      const button = event.target.closest(".filter-chip");
      if (!button) return;
      const category = button.dataset.category;
      if (category === "all") {
        state.categories.clear();
      } else if (state.categories.has(category)) {
        state.categories.delete(category);
      } else {
        state.categories.add(category);
      }
      updateResults();
    });

    refs.reset.addEventListener("click", () => resetFilters());
    refs.emptyReset.addEventListener("click", () => resetFilters({ focusSearch: true }));

    refs.legend.addEventListener("click", (event) => {
      const item = event.target.closest(".legend-item");
      if (!item) return;
      if (state.popoverCategory === item.dataset.category) {
        closeFamilyPopover();
      } else {
        openFamilyPopover(item);
      }
    });

    refs.familyPopoverClose.addEventListener("click", () => closeFamilyPopover({ restoreFocus: true }));
    refs.familyPopoverShow.addEventListener("click", () => showCategoryInTable(state.popoverCategory));

    document.addEventListener("click", (event) => {
      if (refs.familyPopover.hidden) return;
      if (event.target.closest("#family-popover, .legend-item")) return;
      closeFamilyPopover();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !refs.familyPopover.hidden && !refs.dialog.open) {
        closeFamilyPopover({ restoreFocus: true });
      }
    });

    window.addEventListener("resize", () => {
      const trigger = refs.legend.querySelector(".legend-item.is-active");
      if (trigger && !refs.familyPopover.hidden) positionFamilyPopover(trigger);
    });

    refs.grid.addEventListener("click", (event) => {
      const card = event.target.closest(".element-card");
      if (!card || card.classList.contains("is-muted")) return;
      openElement(Number(card.dataset.atomicNumber), card);
    });

    refs.grid.addEventListener("focusin", (event) => {
      const card = event.target.closest(".element-card");
      if (!card) return;
      gridCards.forEach((item) => { item.tabIndex = item === card ? 0 : -1; });
      state.focusedAtomicNumber = Number(card.dataset.atomicNumber);
    });

    refs.grid.addEventListener("keydown", (event) => {
      const card = event.target.closest(".element-card");
      if (!card || !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
      event.preventDefault();
      navigateGrid(card, event.key);
    });

    refs.list.addEventListener("click", (event) => {
      const button = event.target.closest(".list-element");
      if (button) openElement(Number(button.dataset.atomicNumber), button);
    });

    refs.viewOptions.forEach((button) => {
      button.addEventListener("click", () => setView(button.dataset.view));
    });

    refs.featured.addEventListener("click", () => openElement(Number(refs.featured.dataset.atomicNumber), refs.featured));
    refs.random.addEventListener("click", () => {
      let element = elements[Math.floor(Math.random() * elements.length)];
      const current = Number(refs.featured.dataset.atomicNumber);
      if (element.atomicNumber === current) element = elements[element.atomicNumber % elements.length];
      openElement(element.atomicNumber, refs.random);
    });

    refs.dialogClose.addEventListener("click", closeDialog);
    refs.dialog.addEventListener("cancel", (event) => {
      event.preventDefault();
      closeDialog();
    });
    refs.dialog.addEventListener("click", (event) => {
      if (event.target !== refs.dialog) return;
      const rect = refs.dialogShell.getBoundingClientRect();
      const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
      if (outside) closeDialog();
    });

    document.addEventListener("keydown", (event) => {
      const shortcut = (event.ctrlKey || event.metaKey) && event.key.toLocaleLowerCase() === "k";
      if (!shortcut) return;
      event.preventDefault();
      if (refs.dialog.open) closeDialog();
      refs.search.focus();
      refs.search.select();
    });
  }

  function openDeepLinkedElement() {
    const match = window.location.hash.match(/^#elemento-(\d{1,3})$/);
    if (!match) return;
    const atomicNumber = Number(match[1]);
    if (elementByNumber.has(atomicNumber)) {
      requestAnimationFrame(() => openElement(atomicNumber, document.body));
    }
  }

  function init() {
    initializeTheme();
    requestAnimationFrame(() => document.documentElement.classList.add("theme-ready"));
    if (!validateDataset()) return;
    renderFiltersAndLegend();
    renderGrid();
    setFeaturedElement();
    updateResults();
    bindEvents();
    openDeepLinkedElement();
  }

  init();
})();

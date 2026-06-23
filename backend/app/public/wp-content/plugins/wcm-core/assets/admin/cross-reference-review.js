(function () {
  const config = window.wcmCrossReferenceReview;

  if (!config) {
    return;
  }

  const root = document.getElementById("wcm-cross-reference-review-root");

  if (!root) {
    return;
  }

  const state = {
    page: 1,
    perPage: 25,
    selectedId: null,
    selectedItem: null,
    filters: {
      review_status: "unreviewed",
      source_book: "",
      source_chapter: "",
      source_verse: "",
      source_dataset: "openbible",
    },
    queue: null,
    loadingQueue: false,
    saving: false,
    notice: null,
  };

  const reasonOptions = [
    "",
    "accepted",
    "not_relevant",
    "too_broad",
    "duplicate_like",
    "confusing",
    "pastorally_unhelpful",
    "source_quality",
    "other",
  ];

  function el(tag, attributes = {}, children = []) {
    const node = document.createElement(tag);

    Object.entries(attributes).forEach(([key, value]) => {
      if (value === null || value === undefined || value === false) {
        return;
      }

      if (key === "className") {
        node.className = value;
        return;
      }

      if (key === "text") {
        node.textContent = value;
        return;
      }

      if (key === "onClick") {
        node.addEventListener("click", value);
        return;
      }

      if (key === "onChange") {
        node.addEventListener("change", value);
        return;
      }

      node.setAttribute(key, String(value));
    });

    children.forEach((child) => {
      if (typeof child === "string") {
        node.appendChild(document.createTextNode(child));
        return;
      }

      node.appendChild(child);
    });

    return node;
  }

  function referenceLabel(reference) {
    if (!reference) {
      return "";
    }

    const start = `${reference.book} ${reference.start_chapter}:${reference.start_verse}`;
    const hasEnd = reference.end_chapter && reference.end_verse;

    if (!hasEnd) {
      return start;
    }

    if (reference.end_chapter === reference.start_chapter) {
      return `${start}-${reference.end_verse}`;
    }

    return `${start}-${reference.end_chapter}:${reference.end_verse}`;
  }

  function buildUrl(path = "", params = {}) {
    const url = new URL(config.root + path);

    Object.entries(params).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    });

    return url.toString();
  }

  async function request(path = "", options = {}) {
    const response = await fetch(buildUrl(path, options.params || {}), {
      method: options.method || "GET",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        "X-WP-Nonce": config.nonce,
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message = data && data.message ? data.message : response.statusText;
      throw new Error(message);
    }

    return data;
  }

  async function loadQueue() {
    state.loadingQueue = true;
    render();

    try {
      state.queue = await request("", {
        params: {
          page: state.page,
          per_page: state.perPage,
          ...state.filters,
        },
      });
      state.notice = null;
    } catch (error) {
      state.queue = null;
      state.notice = { type: "error", message: error.message || config.labels.loadError };
    } finally {
      state.loadingQueue = false;
      render();
    }
  }

  async function loadDetail(id) {
    state.selectedId = id;
    state.selectedItem = null;
    state.notice = null;
    render();

    try {
      state.selectedItem = await request(`/${id}`);
    } catch (error) {
      state.notice = { type: "error", message: error.message || config.labels.loadError };
    }

    render();
  }

  async function saveReview(form) {
    const status = form.querySelector("[name='review_status']").value;
    const reason = form.querySelector("[name='review_reason']").value;
    const notes = form.querySelector("[name='review_notes']").value.trim();

    if (status === "") {
      state.notice = { type: "error", message: "Select a review status before saving." };
      render();
      return;
    }

    if ((status === "rejected" || status === "suppressed") && reason === "") {
      state.notice = { type: "error", message: config.labels.reasonRequired };
      render();
      return;
    }

    if (reason === "other" && notes === "") {
      state.notice = { type: "error", message: config.labels.notesRequired };
      render();
      return;
    }

    state.saving = true;
    state.notice = null;
    render();

    try {
      state.selectedItem = await request(`/${state.selectedId}`, {
        method: "PATCH",
        body: {
          review_status: status,
          review_reason: reason === "" ? null : reason,
          review_notes: notes === "" ? null : notes,
        },
      });
      state.notice = { type: "success", message: config.labels.saved };
      await loadQueue();
    } catch (error) {
      state.notice = { type: "error", message: error.message || config.labels.saveError };
    } finally {
      state.saving = false;
      render();
    }
  }

  function renderNotice() {
    if (!state.notice) {
      return null;
    }

    return el("div", {
      className: `wcm-review-notice ${state.notice.type === "error" ? "is-error" : ""}`,
      role: state.notice.type === "error" ? "alert" : "status",
      text: state.notice.message,
    });
  }

  function renderFilters() {
    const form = el("form", { className: "wcm-review-panel" });
    const fields = el("div", { className: "wcm-review-filters" });

    fields.appendChild(selectField("review_status", "Status", config.statuses, state.filters.review_status));
    fields.appendChild(inputField("source_book", "Source book", state.filters.source_book));
    fields.appendChild(inputField("source_chapter", "Source chapter", state.filters.source_chapter, "number"));
    fields.appendChild(inputField("source_verse", "Source verse", state.filters.source_verse, "number"));
    fields.appendChild(inputField("source_dataset", "Dataset", state.filters.source_dataset));

    const submit = el("button", { className: "button", type: "submit", text: "Apply filters" });
    fields.appendChild(el("div", {}, [el("label", { text: "\u00a0" }), submit]));

    form.appendChild(fields);
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(form);
      state.filters = {
        review_status: String(data.get("review_status") || ""),
        source_book: String(data.get("source_book") || "").trim(),
        source_chapter: String(data.get("source_chapter") || "").trim(),
        source_verse: String(data.get("source_verse") || "").trim(),
        source_dataset: String(data.get("source_dataset") || "").trim(),
      };
      state.page = 1;
      loadQueue();
    });

    return form;
  }

  function inputField(name, label, value, type = "text") {
    const fieldId = `wcm-${name}-${Math.random().toString(36).slice(2)}`;
    const input = el("input", { id: fieldId, name, type, value });

    return el("div", {}, [
      el("label", { for: fieldId, text: label }),
      input,
    ]);
  }

  function selectField(name, label, options, value) {
    const fieldId = `wcm-${name}-${Math.random().toString(36).slice(2)}`;
    const select = el("select", { name, id: fieldId });
    select.appendChild(el("option", { value: "", text: "Any" }));

    options.forEach((option) => {
      select.appendChild(el("option", {
        value: option,
        text: option,
        selected: option === value,
      }));
    });

    return el("div", {}, [
      el("label", { for: fieldId, text: label }),
      select,
    ]);
  }

  function renderQueue() {
    const panel = el("div", { className: "wcm-review-panel" });
    panel.appendChild(el("h2", { text: "Review Queue" }));

    if (state.loadingQueue) {
      panel.appendChild(el("p", { text: config.labels.loading }));
      return panel;
    }

    const items = state.queue && Array.isArray(state.queue.items) ? state.queue.items : [];

    if (items.length === 0) {
      panel.appendChild(el("p", { text: config.labels.noResults }));
      return panel;
    }

    const table = el("table", { className: "wcm-review-table" });
    table.appendChild(el("thead", {}, [
      el("tr", {}, [
        el("th", { text: config.labels.source }),
        el("th", { text: config.labels.target }),
        el("th", { text: "Dataset" }),
        el("th", { text: "Score" }),
        el("th", { text: "Status" }),
        el("th", { text: "" }),
      ]),
    ]));

    const body = el("tbody");
    items.forEach((item) => {
      body.appendChild(el("tr", {}, [
        el("td", { text: referenceLabel(item.source_reference) }),
        el("td", { text: referenceLabel(item.target_reference) }),
        el("td", { text: item.source_dataset || "" }),
        el("td", { text: item.source_score === null ? "" : String(item.source_score) }),
        el("td", { text: item.review_status || "" }),
        el("td", {}, [
          el("button", {
            className: "button button-small",
            type: "button",
            text: config.labels.review,
            onClick: () => loadDetail(item.id),
          }),
        ]),
      ]));
    });

    table.appendChild(body);
    panel.appendChild(table);
    panel.appendChild(renderPagination());

    return panel;
  }

  function renderPagination() {
    const pagination = state.queue ? state.queue.pagination : null;
    const wrapper = el("div", { className: "wcm-review-actions" });
    const previous = el("button", {
      className: "button",
      type: "button",
      text: config.labels.previous,
      disabled: !pagination || pagination.page <= 1,
      onClick: () => {
        state.page -= 1;
        loadQueue();
      },
    });
    const next = el("button", {
      className: "button",
      type: "button",
      text: config.labels.next,
      disabled: !pagination || !pagination.has_more,
      onClick: () => {
        state.page += 1;
        loadQueue();
      },
    });

    wrapper.appendChild(previous);
    wrapper.appendChild(el("span", {
      className: "wcm-review-meta",
      text: pagination ? `Page ${pagination.page} · ${pagination.total} total` : "",
    }));
    wrapper.appendChild(next);

    return wrapper;
  }

  function renderDetail() {
    const panel = el("div", { className: "wcm-review-panel" });
    panel.appendChild(el("h2", { text: "Review Detail" }));

    if (!state.selectedId) {
      panel.appendChild(el("p", { text: config.labels.selectRelationship }));
      return panel;
    }

    if (!state.selectedItem) {
      panel.appendChild(el("p", { text: config.labels.loading }));
      return panel;
    }

    const item = state.selectedItem;
    const audit = item.audit || {};
    const list = el("dl", { className: "wcm-review-detail-list" });
    [
      ["Source", referenceLabel(item.source_reference)],
      ["Target", referenceLabel(item.target_reference)],
      ["Dataset", item.source_dataset],
      ["Score", item.source_score === null ? "" : String(item.source_score)],
      ["Type", item.relationship_type],
      ["Status", item.review_status],
      ["Identity", item.relationship_identity_hash],
      ["Reviewed by", audit.reviewed_by === null ? config.labels.notReviewed : String(audit.reviewed_by)],
      ["Reviewed at", audit.reviewed_at || ""],
      ["Previous status", audit.previous_review_status || ""],
      ["Review source", audit.review_source || ""],
      ["Reason", audit.review_reason || ""],
      ["Internal notes", audit.review_notes || ""],
    ].forEach(([label, value]) => {
      list.appendChild(el("dt", { text: label }));
      list.appendChild(el("dd", { text: value || "\u2014" }));
    });
    panel.appendChild(list);
    panel.appendChild(renderReviewForm(item));

    return panel;
  }

  function renderReviewForm(item) {
    const form = el("form", { className: "wcm-review-form" });
    const statusField = selectField("review_status", "Review status", config.writeStatuses, item.review_status);
    const reasonField = selectField("review_reason", "Reason", reasonOptions, item.audit && item.audit.review_reason ? item.audit.review_reason : "");
    const notes = el("textarea", {
      name: "review_notes",
      rows: "5",
      maxlength: "2000",
    });
    notes.value = item.audit && item.audit.review_notes ? item.audit.review_notes : "";

    form.appendChild(el("div", { className: "wcm-review-field" }, [statusField]));
    form.appendChild(el("div", { className: "wcm-review-field" }, [reasonField]));
    form.appendChild(el("div", { className: "wcm-review-field" }, [
      el("label", { for: "review_notes", text: "Internal notes" }),
      notes,
      el("p", { className: "description", text: "Internal only. Required when reason is other." }),
    ]));
    form.appendChild(el("p", {}, [
      el("button", {
        className: "button button-primary",
        type: "submit",
        text: state.saving ? "Saving..." : "Save review",
        disabled: state.saving,
      }),
    ]));

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      saveReview(form);
    });

    return form;
  }

  function render() {
    root.textContent = "";
    root.appendChild(renderFilters());

    const notice = renderNotice();
    if (notice) {
      root.appendChild(notice);
    }

    root.appendChild(el("div", { className: "wcm-review-layout" }, [
      renderQueue(),
      renderDetail(),
    ]));
  }

  loadQueue();
})();

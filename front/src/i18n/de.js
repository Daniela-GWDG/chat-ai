export default {
  // Common phrases
  common: {
    loading: "Lädt...",
    undo: "Rückgängig",
    scroll: "Nach unten scrollen",
    scroll_to_top: "Nach oben scrollen",
    scroll_to_message: "Zum Anfang der Nachricht springen",
    next_message: "Zur nächsten Nachricht scrollen",
    previous_message: "Zur vorherigen Nachricht scrollen",
    rename: "Umbenennen",
    create: "Erstellen",
    save: "Speichern",
    import: "Chat importieren",
    export: "Chat exportieren",
    summarize: "Zusammenfassen",
    summarizing: "Zusammenfassen...",
    summarize_success: "Zusammenfassung in einer neuen Unterhaltung erstellt.",
    summary_title: "Zusammenfassung von {{title}}",
    summarize_error: "Zusammenfassung fehlgeschlagen. Deine Unterhaltung ist unverändert.",
    clear: "Löschen",
    abort: "Abbrechen",
    send: "Senden",
    send_shortcut: "Senden (Enter)",
    send_shortcut_shift_enter: "Senden (Umschalt+Enter)",
    stop: "Anhalten",
    share: "Teilen",
    delete: "Löschen",
    cancel: "Abbrechen",
    close: "Schließen",
    allow: "Erlauben",
    disallow: "Nicht erlauben",
    refresh: "Aktualisieren",
    notice: "Hinweis",
    disclaimer: "Haftungsausschluss",
    understand: "Ich verstehe",
    ok: "OK",
    record_start: "Aufnehmen (klicken/halten)",
    record_stop: "Stopp (klicken/loslassen)",
    dont_show_again: "Nicht mehr anzeigen",
    regenerate: "Antwort neu generieren",
    fork: "In neuem Chat fortfahren",
    copy_message: "Nachricht kopieren",
    edit_message: "Nachricht bearbeiten",
    speak: "Vorlesen",
    backup_data: "Daten sichern",
    skip_backup: "Backup überspringen",
    upgrade_chat_ai: "Chat AI aktualisieren",
  },
  feedback:{
    thumbsup:"The response is good.",
    thumbsdown: "The response is not so good.",
  },
  // Sidebar
  ai_services: {
    open: "Menü der KI-Dienste öffnen",
    image: "Bilder mit KI erzeugen",
    voice: "Sprache in Text umwandeln",
    rag: "Vektordatenbanken (Arcanas) verwalten",
  },
  sidebar: {
    new_conversation: "Neuer Chat",
    import_persona: "Mit Persona chatten",
    expand: "Seitenleiste ausklappen",
    extend: "Ausklappen",
    open_sidebar: "Seitenleiste öffnen",
    close_sidebar: "Seitenleiste einklappen",
    rename_tooltip: "Umbenennen: {{title}}",
    shortcut_new_conversation: "Strg + Shift + O",
    user_section: "Benutzer",
  },
  folders: {
    title: "Chats",
    all: "Alle Chats",
    uncategorized: "Nicht zugeordnete Chats",
    sort_label: "Chats sortieren",
    sort_reset: "Standard wiederherstellen",
    sort_by_date: "Nach Datum",
    sort_by_created: "Nach Erstellungsdatum",
    modified: "Geändert {{date}}",
    dateBuckets: {
      today: "Heute",
      yesterday: "Gestern",
      lastWeek: "Letzte Woche",
      lastMonth: "Letzter Monat",
      older: "Älter",
    },
    create_button: "Neues Thema",
    topics_section: "Themen",
    new_chat_in_topic: "Neuer Chat in diesem Thema",
    expand_topic: "Thema ausklappen",
    collapse_topic: "Thema einklappen",
    empty_topic: "Ziehe einen Chat hierher.",
    search_label: "Suche",
    search_action: "Chats durchsuchen",
    search_placeholder: "Chats und Nachrichten durchsuchen",
    search_recent: "Letzte Chats",
    search_no_results: 'Keine Treffer für "{{query}}"',
    clear_search: "Suche löschen",
    create_title: "Thema erstellen",
    edit_title: "Thema bearbeiten",
    delete_title: "Thema löschen",
    topic_options: "Thema-Optionen",
    pinned: "Angeheftet",
    pin_action: "Chat anheften",
    unpin_action: "Nicht mehr anheften",
    topic_already_pinned: "Thema ist bereits angeheftet",
    pin_topic_action: "Thema anheften",
    unpin_topic_action: "Thema nicht mehr anheften",
    delete_description:
      'Thema "{{name}}" löschen? Chats bleiben erhalten und erscheinen danach ohne Thema in der Liste.',
    name_label: "Themenname",
    name_placeholder: "Themenname eingeben",
    error_required: "Bitte einen Themennamen eingeben.",
    create_blurb: "Fasse zusammengehörige Chats in einem Thema zusammen. Konfiguriere den Namen, die Farbe und das Symbol des Themas.",
    blurb_examples: "Beispiele",
    suggestion_homework: "Hausaufgaben",
    suggestion_writing: "Schreiben",
    suggestion_health: "Gesundheit",
    suggestion_research: "Forschung",
    choose_color: "Farbe wählen",
    choose_icon: "Symbol wählen",
    error_generic: "Aktion konnte nicht ausgeführt werden. Bitte erneut versuchen.",
    move_title: "Chat verschieben",
    move_description: "Wohin soll „{{title}}“ verschoben werden?",
    move_target_chats_hint: "ohne Thema",
    move_new_topic: "Neues Thema",
    move_action: "Verschieben",
    new_folder_prompt: "Neues Thema anlegen",
    create_inline: "Erstellen",
  },
  topic_view: {
    open_topic: "Thema „{{name}}“ öffnen",
    chat_count_one: "{{count}} Chat",
    chat_count_other: "{{count}} Chats",
    empty_title: "Noch keine Chats in diesem Thema",
    empty_body:
      "Schreibe unten eine Eingabe, um den ersten Chat hier zu starten.",
    create_error:
      "Neuer Chat konnte nicht gestartet werden. Bitte erneut versuchen.",
    missing_topic: "Dieses Thema existiert nicht mehr",
    missing_topic_body:
      "Es wurde möglicherweise gelöscht. Wähle ein anderes Thema in der Seitenleiste.",
    back_to_chats: "Zurück zu den Chats",
    loading: "Thema wird geladen…",
  },
  sorter: {
    button: "Smart Sorting",
    title: "Chats sortieren & organisieren",
    intro:
      "Prüfe die Vorschläge unten. Änderungen werden erst beim Anwenden übernommen.",
    ai_model_note:
      "Chat-Titel, vorhandene Zusammenfassungen und bestehende Themennamen werden vom Standard-ChatAI-Modell analysiert.",
    ai_analyzing: "Deine Chats werden mit {{model}} analysiert…",
    ai_error:
      "Das Modell konnte deine Chats nicht analysieren. Es werden keine Änderungen angezeigt.",
    ai_retry: "Modell erneut versuchen",
    ai_limited:
      "Die {{analyzed}} neuesten von {{total}} Chats wurden analysiert. Ältere Chats bleiben unverändert.",
    ai_default_model: "das Standardmodell",
    assessment_title: "Einschätzung des Modells",
    preview_title: "Vorgeschlagene Struktur",
    include_topic_rename: "Themenumbenennung übernehmen",
    include_title_change: "Titeländerung übernehmen",
    new_topic: "Neues Thema",
    existing_topic: "Bestehendes Thema",
    no_changes: "Keine Themenänderungen vorgeschlagen.",
    select_all_moves: "Alle auswählen",
    deselect_all_moves: "Alle abwählen",
    deletions_title: "Vorgeschlagene Löschungen",
    deletions_hint:
      "Vom Modell vorgeschlagene Löschungen werden hier angezeigt. Sie sind standardmäßig nicht ausgewählt.",
    no_deletions: "Keine Löschungen vorgeschlagen.",
    reason_empty: "Leerer Chat",
    reason_duplicate: 'Duplikat von "{{title}}"',
    reason_duplicate_generic: "Doppelter Chat",
    select_all_deletions: "Alle Löschungen auswählen",
    deselect_all_deletions: "Alle Löschungen abwählen",
    summary_moves: "{{count}} Verschiebungen",
    summary_new_topics: "{{count}} neue Themen",
    summary_titles: "{{count}} Titeländerungen",
    summary_topic_renames: "{{count}} Themenumbenennungen",
    summary_deletions: "{{count}} Löschungen",
    apply: "Änderungen anwenden",
    applying: "Wird angewendet…",
    error_name: "Bitte gib jedem neuen Thema einen Namen.",
    error_generic:
      "Die Änderungen konnten nicht angewendet werden. Bitte erneut versuchen.",
    success: "Chats wurden neu organisiert.",
    categories: {
      code: "Programmierung",
      writing: "Schreiben",
      research: "Forschung",
      data: "Daten & Analyse",
      planning: "Planung",
      learning: "Lernen",
      health: "Gesundheit",
      travel: "Reisen",
      finance: "Finanzen",
      creative: "Kreatives Arbeiten",
    },
  },
  meta_chat: {
    title: "Meta-Chat",
    prompt_placeholder: "Frag den Meta-Chat!",
    open: "Metachat",
    banner_description: "Metachat kann dir auf zwei Arten helfen:",
    purposes: {
      tutor: "Die Funktionen von Chat AI kennenlernen",
      tutor_example: "„Wie finde ich ein Tutorial oder prüfe meine Einstellungen?“",
      find: "Bisherige Chats und Themen finden",
      find_example: "„Wo ist mein Chat über meine Essensbestellung?“",
    },
    clear_chat: "Chat leeren",
    proposed_changes: "Vorgeschlagene Änderungen",
    mutation_warning:
      "Diese Änderungen bearbeiten deine Chats, Einstellungen oder Erinnerungen. Prüfe sie vor dem Übernehmen.",
    accept_changes: "Änderungen übernehmen",
    applying_changes: "Wird übernommen…",
    changes_applied: "Änderungen übernommen",
    revert_changes: "Änderungen zurücksetzen",
    reverting: "Wird zurückgesetzt…",
    changes_reverted: "Änderungen zurückgesetzt",
    revert_mismatch:
      "Ein Zurücksetzen ist nicht möglich, weil der aktuelle Zustand nicht mehr der übernommenen Änderung entspricht.",
    apply_failed: "Die Änderungen konnten nicht übernommen werden.",
    rename_summary: "„{{from}}“ in „{{to}}“ umbenennen",
    move_summary: "„{{title}}“ nach „{{topic}}“ verschieben",
    pin_summary: "„{{title}}“ anheften",
    unpin_summary: "„{{title}}“ nicht mehr anheften",
    pin_topic_summary: "Thema „{{topic}}“ anheften",
    unpin_topic_summary: "Thema „{{topic}}“ nicht mehr anheften",
    setting_summary: "{{setting}} von „{{from}}“ auf „{{to}}“ ändern",
    setting_temperature: "Temperatur",
    setting_top_p: "Top-p",
    conversation_setting_all_summary:
      "{{setting}} für alle Chats auf „{{value}}“ setzen",
    conversation_setting_summary:
      "{{setting}} in „{{title}}“ auf „{{value}}“ setzen",
    mcp_target_all: "alle Chats",
    mcp_add_local_summary:
      "Lokalen MCP-Server {{name}} zu {{target}} hinzufügen",
    mcp_add_remote_summary:
      "Entfernten MCP-Server {{name}} zu {{target}} hinzufügen",
    mcp_remove_local_summary:
      "Lokalen MCP-Server {{name}} aus {{target}} entfernen",
    mcp_remove_remote_summary:
      "Entfernten MCP-Server {{name}} aus {{target}} entfernen",
    mcp_update_local_summary:
      "Lokalen MCP-Server {{name}} in {{target}} aktualisieren",
    mcp_update_remote_summary:
      "Entfernten MCP-Server {{name}} in {{target}} aktualisieren",
    add_memory_summary: "Erinnerung „{{text}}“ hinzufügen",
    update_memory_summary: "Erinnerung „{{from}}“ in „{{to}}“ ändern",
    delete_memory_summary: "Erinnerung „{{text}}“ löschen",
    clear_memories_summary: "Alle gespeicherten Erinnerungen löschen",
    memory_item: "Erinnerung {{index}}",
    setting_on: "an",
    setting_off: "aus",
    setting_device_default: "Gerätestandard",
    unsorted_topic: "Nicht zugeordnet",
    error: "Antwort fehlgeschlagen. Bitte versuche es erneut.",
    no_model: "Kein Standardmodell konfiguriert.",
  },
  mcp_confirmation: {
    title: "MCP-Werkzeug ausführen?",
    description:
      "Der Assistent möchte „{{tool}}“ auf {{server}} ausführen. Erlaube dies nur, wenn du dem Server und den Argumenten vertraust.",
    allow: "Werkzeug ausführen",
    allow_always: "Immer in diesem Chat erlauben",
    always_allowed: "(immer erlaubt)",
    deny: "Ablehnen",
    denied: "Der Benutzer hat die Ausführung des MCP-Werkzeugs „{{tool}}“ auf {{server}} abgelehnt.",
  },
  feature_guide: {
    catalog: {
      open: "Tutorials durchsuchen",
      close: "Tutorials ausblenden",
      title: "Tutorials",
      search: "Tutorials durchsuchen",
      empty: "Keine Tutorials gefunden.",
      hide_completed: "Abgeschlossene ausblenden",
      completed_successfully: "Erfolgreich abgeschlossen",
      completed: "Abgeschlossen",
      start: "Starten",
      replay: "Wiederholen",
      steps: "{{count}} Schritte",
    },
    walkthrough_complete: "Durchlauf abgeschlossen",
    dont_show_again: "Nicht mehr anzeigen",
    completed_title: "Tutorial abgeschlossen",
    more_tutorials: "Weitere Tutorials",
    categories: {
      meta_chat: "Den Metachat verwenden",
      prompt: "Eingabe und Chat",
      tools: "Tools und RAG",
      chats: "Chats und Organisation",
      personas: "Personas",
      settings: "Einstellungen",
      other: "Mehr",
    },
    show_me: "Zeigen: {{title}}",
    show_me_short: "Zeigen",
    step: "Schritt {{current}} von {{total}}",
    status_title: "Tutorial-Fortschritt",
    status_waiting: "Warten auf deine Aktion",
    status_ready: "Schritt abgeschlossen",
    status_manual: "Weiter, wenn du bereit bist",
    status_done: "Tutorial abgeschlossen",
    complete_step: "Schließe diesen Schritt ab, um fortzufahren.",
    next: "Weiter",
    back: "Zurück",
    done: "Fertig",
    close: "Schließen",
    attach_media: {
      title: "Medien an einen Chat anhängen",
      step1: "Klicke auf die Bildschaltfläche im Eingabefeld.",
      step2:
        "Wähle eine Bild-, Audio- oder Videodatei, wenn das aktuelle Modell sie unterstützt. Die Datei erscheint über dem Eingabefeld.",
      step3: "Gib eine Nachricht ein und klicke auf Senden.",
    },
    upload_file: {
      title: "Eine Datei an einen Chat anhängen",
      step1:
        "Klicke auf die Büroklammer im Eingabefeld, um die Dateiauswahl zu öffnen.",
      step2:
        "Wähle eine Datei. Sie erscheint über dem Eingabefeld; PDF- und DOCX-Dateien müssen eventuell zuerst verarbeitet werden.",
      step3:
        "Gib deine Nachricht ein und klicke auf Senden. Das Modell verwendet die Datei, wenn es diesen Dateityp unterstützt.",
    },
    process_attachment: {
      title: "Einen Anhang verarbeiten",
      step1: "Hänge ein PDF oder DOCX an oder suche die Anhang-Karte über dem Eingabefeld.",
      step2: "Wähle Im Browser verarbeiten oder Auf dem Server verarbeiten.",
      step3:
        "Warte auf die verarbeitete Markdown-Datei und sende dann deine Nachricht.",
    },
    filter_models: {
      title: "Modelle filtern",
      step1: "Öffne die Modellauswahl im Eingabefeld.",
      step2: "Filtere die Liste nach Bereitstellung, Eingabe oder Zweck. Es ist immer ein Filter aktiv, die Suche wirkt zusätzlich.",
    },
    select_model: {
      title: "Ein Modell auswählen",
      step1:
        "Öffne hier die Modellauswahl, um verfügbare Modelle und ihre Fähigkeiten zu sehen. Auf kleinen Bildschirmen wird die Auswahl im Kopfbereich verwendet.",
    },
    conversation_settings: {
      title: "Unterhaltungseinstellungen ändern",
      step1: "Klicke auf das Einstellungssymbol im Eingabefeld.",
      step2:
        "Passe Erinnerungsmodus, Temperatur, top_p, Denkaufwand oder den System-Prompt für diesen Chat an.",
    },
    voice_input: {
      title: "Eine Sprachnachricht aufnehmen",
      step1:
        "Klicke auf das Mikrofon. Erlaube den Mikrofonzugriff, wenn der Browser danach fragt.",
      step2:
        "Die Aufnahme wird an den Prompt angehängt. Ergänze bei Bedarf Text und sende.",
    },
    send_key: {
      title: "Festlegen, wie Nachrichten gesendet werden",
      step1: "Öffne deine Benutzereinstellungen.",
      step2: "Wähle den Tab Chat.",
      step3:
        "Stelle Nachricht senden mit auf Eingabe oder Umschalt+Eingabe. Alt+Eingabe fügt immer einen Zeilenumbruch ein.",
    },
    arcana: {
      title: "Arcana für RAG verwenden",
      step1: "Öffne Werkzeuge im Eingabefeld.",
      step2: "Aktiviere die Tools.",
      step3: "Wähle Arcana.",
      step4:
        "Gib deine Arcana-ID ein. Über den Hilfe-Link kannst du eine Sammlung erstellen.",
    },
    web_search: {
      title: "Websuche verwenden",
      step1: "Öffne Werkzeuge im Eingabefeld.",
      step2: "Aktiviere die Tools.",
      step3: "Wähle Websuche und akzeptiere den Hinweis.",
    },
    image_generation: {
      title: "Bilder erzeugen",
      step1: "Öffne Werkzeuge im Eingabefeld.",
      step2: "Aktiviere die Tools.",
      step3:
        "Wähle Bilderzeugung und beschreibe das gewünschte Bild.",
    },
    image_modification: {
      title: "Bilder bearbeiten",
      step1: "Öffne Werkzeuge im Eingabefeld.",
      step2: "Aktiviere die Tools.",
      step3:
        "Wähle Bildbearbeitung und hänge das Bild an oder beschreibe es.",
    },
    image_analysis: {
      title: "Bilder analysieren",
      step1: "Öffne Werkzeuge im Eingabefeld.",
      step2:
        "Wähle Bilder analysieren, damit der Assistent Bilddateien mit dem Gemma-Visionsmodell von SAIA analysieren kann.",
    },
    audio_generation: {
      title: "Audio erzeugen",
      step1: "Öffne Werkzeuge im Eingabefeld.",
      step2: "Aktiviere die Tools.",
      step3:
        "Wähle Audioerzeugung und beschreibe das gewünschte Audio.",
    },
    mcp_server: {
      title: "Einen MCP-Server verbinden",
      step1: "Öffne Werkzeuge im Eingabefeld.",
      step2: "Aktiviere die Tools.",
      step3: "Wähle MCP-Server.",
      step4: "Gib die MCP-Server-Konfiguration in das Feld unten ein.",
    },
    tools_overview: {
      title: "GWDG Tools verwenden",
      step1: "Öffne Werkzeuge im Eingabefeld.",
      step2: "Aktiviere die Tools.",
      step3:
        "Wähle ein Tool. Tools erscheinen nur bei Modellen, die sie unterstützen.",
    },
    search_chats: {
      title: "Chats durchsuchen",
      step1: "Klicke in der Seitenleiste auf Suchen.",
      step2: "Gib einen Suchbegriff ein, um Chats und Nachrichten zu finden.",
    },
    manage_topics: {
      title: "Chats mit Themen organisieren",
      step1: "Klicke in der Seitenleiste auf Thema erstellen.",
      step2: "Benenne das Thema und wähle Symbol und Farbe.",
      step3:
        "Ziehe Chats in Themen oder verschiebe sie über das Chat-Menü.",
    },
    sort_organize: {
      title: "Chats sortieren & organisieren",
      step1: "Klicke in der Werkzeugzeile der Seitenleiste auf „Smart Sorting“.",
      step2:
        "Prüfe die vorgeschlagenen Themen, Titel und Löschungen. Änderungen werden erst beim Anwenden übernommen.",
      step3:
        "Wähle die gewünschten Vorschläge aus und klicke auf „Änderungen anwenden“.",
    },
    sort_group_chats: {
      title: "Chats sortieren und gruppieren",
      step1: "Öffne das Sortiermenü in der Seitenleiste.",
      step2: "Gruppiere die Chats im Abschnitt „Chats“ nach Datum oder Erstellungsdatum. Standard wiederherstellen hebt die Gruppierung auf, Themen bleiben davon unberührt.",
    },
    pin_chat: {
      title: "Einen Chat anheften",
      step1: "Öffne das Chat-Menü eines Chats in der Seitenleiste.",
      step2:
        "Wähle „Chat anheften“. Angeheftete Chats bleiben unabhängig von der Gruppierung in einem eigenen Bereich oben.",
    },
    pin_topic: {
      title: "Ein Thema anheften",
      step1: "Öffne das Optionenmenü eines Themas in der Seitenleiste.",
      step2:
        "Wähle „Thema anheften“. Angeheftete Themen bleiben unabhängig von der Gruppierung im Bereich „Angeheftet“ oben.",
    },
    export_conversation: {
      title: "Einen Chat exportieren",
      step1: "Öffne das Chat-Menü in der Seitenleiste.",
      step2: "Wähle Exportieren und lege die Optionen fest.",
    },
    import_conversation: {
      title: "Einen Chat importieren",
      step1:
        "Klicke in der Seitenleiste auf Importieren und wähle eine JSON-Chatdatei. Alternativ kannst du im Tab Daten importieren.",
    },
    chat_with_persona: {
      title: "Mit Persona chatten",
      step1:
        "Klicke in der Seitenleiste auf „Mit Persona chatten“, um die Persona-Bibliothek zu öffnen.",
      step2:
        "Wähle links eine Kategorie oder nutze den Schnellimport, um direkt zu starten.",
      step3:
        "Klicke auf eine Persona, um einen neuen Chat mit Titel, Modell und Systemprompt zu starten.",
    },
    share_conversation: {
      title: "Unterhaltungseinstellungen teilen",
      step1: "Öffne die Unterhaltungseinstellungen.",
      step2: "Klicke auf Teilen, um einen Link mit diesen Einstellungen zu kopieren.",
    },
    fork_conversation: {
      title: "Eine Unterhaltung abzweigen",
      step1:
        "Verwende Abzweigen an einer Assistenten-Nachricht, um von dort in einem neuen Chat fortzufahren.",
    },
    summarize_conversation: {
      title: "Einen Chat zusammenfassen",
      step1: "Öffne das Chat-Menü in der Seitenleiste.",
      step2: "Wähle Zusammenfassen. Eine neue Unterhaltung mit der Zusammenfassung wird erstellt.",
    },
    settings_overview: {
      title: "Einstellungen ändern",
      step1: "Öffne deine Benutzereinstellungen über das Profil oder die Seitenleiste.",
      step2: "Wähle den Tab Chat. Erinnerungen und Daten enthalten die weiteren Einstellungen.",
      step3: "Ändere eine Einstellung wie Darstellung oder Dokumentkonvertierung. Änderungen werden automatisch gespeichert.",
    },
    memories: {
      title: "Erinnerungen verwalten",
      step1: "Öffne deine Benutzereinstellungen.",
      step2:
        "Verwalte im Tab Erinnerungen gespeicherte Erinnerungen und den Erinnerungsmodus.",
    },
    chat_preferences: {
      title: "Chat-Einstellungen öffnen",
      step1: "Öffne deine Benutzereinstellungen.",
      step2:
        "Wähle den Tab Chat, um Standardmodell, Sendetaste, Zusammenfassungen, Darstellung und Dokumentkonvertierung zu ändern.",
    },
    rendering: {
      title: "Darstellung konfigurieren",
      step1: "Öffne deine Benutzereinstellungen.",
      step2: "Wähle den Tab Chat.",
      step3:
        "Aktiviere die Typst- oder LaTeX-Darstellung. Auch HTML-Darstellung und externe Verweise werden hier konfiguriert.",
    },
    reasoning_streaming: {
      title: "Denkprozess verfolgen",
      step1: "Öffne deine Benutzereinstellungen.",
      step2: "Wähle den Tab Chat.",
      step3:
        "Die Option ist standardmäßig aktiviert. Lass sie an, um während des Denkens einen bewegten Punkt zu sehen. Klicke auf die Kopfzeile, um den Denkprozess während des Streamings zu öffnen, oder schalte die Option aus, wenn sich die Box automatisch öffnen soll.",
    },
    document_conversion: {
      title: "Dokumentkonvertierung wählen",
      step1: "Öffne deine Benutzereinstellungen.",
      step2: "Wähle den Tab Chat.",
      step3: "Wähle Nur Server, Nur Browser oder Nach Wahl.",
    },
    data_management: {
      title: "Deine Daten verwalten",
      step1: "Öffne deine Benutzereinstellungen.",
      step2: "Wähle den Tab Daten.",
      step3:
        "Exportiere lokale Daten oder lösche Chats, Erinnerungen, Einstellungen und Anhänge.",
    },
    resize_sidebar: {
      title: "Seitenleiste anpassen",
      step1:
        "Ziehe den rechten Rand der Seitenleiste, um ihre Breite zu ändern. Ein Doppelklick stellt die Standardbreite wieder her.",
    },
    dark_mode: {
      title: "Design wechseln",
      step1:
        "Verwende den Design-Schalter in der Fußzeile, um zwischen hellem und dunklem Modus zu wechseln.",
    },
    feedback: {
      title: "Feedback senden",
      step1:
        "Verwende die Feedback-Schaltflächen unter einer Assistenten-Nachricht, wenn das Feedback-Modul aktiviert ist.",
    },
    speech_output: {
      title: "Antworten vorlesen lassen",
      step1:
        "Klicke auf das Lautsprecher-Symbol unter einer Assistenten-Nachricht, wenn das Sprachmodul aktiviert ist.",
    },
    meta_chat_catalogs: {
      title: "Tutorials und Einstellungen im Metachat finden",
      step1: "Durchsuche alle verfügbaren Tutorials und wiederhole abgeschlossene.",
      step2: "Durchsuche vollständige Abläufe, die mehrere Funktionen kombinieren. Der Metachat kann beide Optionen auch für dich starten.",
      step3: "Du kannst mich auch bitten, ein Tutorial zu finden oder eine Persona zu empfehlen. Zum Beispiel: „Finde ein Tutorial zum Hochladen einer Datei.“",
      step4: "Frag nach Einstellungen oder lass dich zu einem Chat, einer Nachricht, einem Thema oder einer Einstellung führen. Ich kann auch nach Entscheidungen und Aufgaben in deinen Chats suchen.",
    },
    meta_chat_actions: {
      title: "Chats mit dem Metachat umbenennen und organisieren",
      step1: "Öffne den Metachat über das KI-Symbol in der Seitenleiste.",
      step2:
        "Bitte ihn, einen Chat umzubenennen oder in ein anderes Thema zu verschieben. Zum Beispiel: „Benenne ‚Preisdiskussion‘ in ‚Preisstrategie‘ um.“",
      step3:
        "Prüfe die vorgeschlagenen Änderungen und klicke auf „Änderungen übernehmen“. Erst dann werden sie angewendet.",
    },
    meta_chat_search: {
      title: "Nachrichteninhalte mit dem Metachat durchsuchen",
      step1: "Öffne den Metachat über das KI-Symbol in der Seitenleiste.",
      step2:
        "Bitte ihn, etwas in deinen Chats zu finden, zum Beispiel: „Finde, wo wir das Preismodell entschieden haben“ oder „Welche Aufgaben gibt es?“",
      step3:
        "Klicke auf eine zitierte Nachricht, um zur genauen Nachricht zu springen und sie hervorzuheben.",
    },
    meta_chat_pins: {
      title: "Chats und Themen mit dem Metachat anheften",
      step1: "Öffne den Metachat über das KI-Symbol in der Seitenleiste.",
      step2:
        "Bitte ihn, einen Chat oder ein Thema anzuheften oder nicht mehr anzuheften, zum Beispiel: „Hefte den Chat Preisdiskussion an“ oder „Hefte das Thema Forschung nicht mehr an“.",
      step3:
        "Prüfe die vorgeschlagene Änderung und klicke auf „Änderungen übernehmen“. Erst dann wird sie angewendet.",
    },
    meta_chat_navigation: {
      title: "Navigieren und suchen mit dem Metachat",
      step1: "Öffne den Metachat über das KI-Symbol in der Seitenleiste.",
      step2:
        "Bitte ihn, dich irgendwohin zu führen, zum Beispiel: „Bring mich zu den Chat-Einstellungen“ oder „Öffne den Chat über die Preise“.",
      step3:
        "Bitte ihn, deine Chats zu durchsuchen, zum Beispiel: „Finde, wo wir das Preismodell entschieden haben“ oder „Welche Aufgaben gibt es?“. Klicke auf eine zitierte Nachricht, um dorthin zu springen.",
    },
    meta_chat_usage: {
      title: "Den Metachat verwenden",
      step1:
        "Klicke auf das KI-Symbol in der Seitenleiste, um den Metachat zu öffnen. Frag nach Funktionen oder wo ein Chat ist.",
    },
  },
  use_cases: {
    common: {
      start_new_chat: "Starte für diesen Ablauf einen neuen Chat.",
    },
    catalog: {
      open: "Anwendungsfälle durchsuchen",
      close: "Anwendungsfälle ausblenden",
      search: "Anwendungsfälle durchsuchen",
      hide_completed: "Abgeschlossene ausblenden",
      completed_successfully: "Erfolgreich abgeschlossen",
      empty: "Keine Anwendungsfälle gefunden.",
      walk_through_again: "Noch einmal Schritt für Schritt zeigen",
      start_walkthrough: "Schritt für Schritt zeigen",
      show_tutorial: "Tutorial zeigen",
    },
    categories: {
      research: "Recherche",
      organize: "Organisieren",
      create: "Erstellen",
      workflows: "Arbeitsabläufe",
    },
    analyze_paper: {
      title: "Ein wissenschaftliches Paper analysieren",
      description: "Lade ein PDF hoch, verarbeite es und stelle dann Fragen zum Inhalt.",
      step1: "Hänge das Paper über die Büroklammer an.",
      step2: "Verarbeite das PDF im Browser oder auf dem Server.",
      step3: "Frag: „What are the references?“",
      step4: "Frag: „Summarize the methodology and main findings.“",
    },
    web_research: {
      title: "Aktuelle Informationen recherchieren",
      description: "Aktiviere die Websuche und stelle eine Frage, die aktuelle Quellen benötigt.",
      step1: "Öffne Werkzeuge im Eingabefeld.",
      step2: "Aktiviere die Tools und wähle die Websuche.",
      step3: "Frag nach einer aktuellen Entwicklung und erwähne, dass du aktuelle Quellen brauchst.",
      step4: "Folge den zitierten Quellen und stelle Rückfragen.",
    },
    rag_documents: {
      title: "Fragen aus eigenen Dokumenten beantworten",
      description: "Verwende Arcana (RAG), um aus einer eigenen Dokumentensammlung zu antworten.",
      step1: "Öffne Werkzeuge im Eingabefeld.",
      step2: "Aktiviere die Tools und wähle Arcana.",
      step3: "Gib deine Arcana-ID ein.",
      step4: "Frag: „Was sagt unsere interne Richtlinie dazu?“",
      step5: "Frag: „Welches Dokument belegt diese Antwort?“",
    },
    organize_topics: {
      title: "Chats nach Projekt organisieren",
      description: "Erstelle Themen und gruppiere zusammengehörige Chats.",
      step1: "Erstelle ein Thema wie „Abschlussarbeit“ oder „Kundenprojekt“.",
      step2: "Ziehe passende Chats in das Thema oder gruppiere die Seitenleiste nach Thema.",
    },
    find_chat: {
      title: "Einen alten Chat finden",
      description: "Durchsuche Chat-Titel oder frag den Metachat, wo eine Unterhaltung ist.",
      step1: "Suche in der Seitenleiste nach einem Teil des Titels.",
      step2: "Oder frag: „Wo ist mein Chat über die Paper-Analyse?“",
    },
    summarize_chat: {
      title: "Einen langen Chat in Notizen verwandeln",
      description: "Erstelle eine neue Unterhaltung mit einer Zusammenfassung einer langen Unterhaltung für deine Notizen.",
      step1: "Öffne das Chat-Menü in der Seitenleiste.",
      step2: "Wähle Zusammenfassen und prüfe das Ergebnis.",
      step3: "Exportiere den Chat, wenn du eine Datei für deine Notizen brauchst.",
    },
    generate_image: {
      title: "Ein Bild für eine Folie erstellen",
      description: "Aktiviere die Bilderzeugung und beschreibe das gewünschte Bild.",
      step1: "Öffne Tools und aktiviere die Bilderzeugung.",
      step2: "Frag: „Erstelle ein klares Diagramm eines dreistufigen Forschungsablaufs.“",
      step3: "Verfeinere den Prompt, bis das Bild zur Folie passt.",
    },
    share_setup: {
      title: "Eine wiederverwendbare Einrichtung teilen",
      description: "Teile System-Prompt, Modell und Einstellungen als Link.",
      step1: "Öffne die Unterhaltungseinstellungen und wähle Teilen.",
      step2: "Sende den kopierten Link an eine Person, die dieselbe Einrichtung braucht.",
    },
    compare_models: {
      title: "Zwei Modelle vergleichen",
      description: "Zweige eine Unterhaltung ab, wechsle das Modell und stelle dieselbe Frage.",
      step1: "Zweige die Unterhaltung an der gewünschten Nachricht ab.",
      step2: "Wähle ein anderes Modell.",
      step3: "Sende denselben Prompt und vergleiche die Antworten.",
    },
    local_conversion: {
      title: "Dokumentkonvertierung lokal halten",
      description: "Konvertiere PDFs und DOCX-Dateien im Browser statt auf dem Server.",
      step1: "Öffne die Chat-Einstellungen in den Benutzereinstellungen.",
      step2: "Wähle Nur Browser unter Dokumentkonvertierung.",
      step3: "Hänge ein PDF oder DOCX an.",
      step4: "Verarbeite die Datei über die Anhang-Karte.",
    },
    memories: {
      title: "Einstellungen chatübergreifend merken",
      description: "Speichere Kontext und Vorlieben in Erinnerungen, damit spätere Chats sie abrufen können.",
      step1: "Öffne die Benutzereinstellungen und füge eine Erinnerung hinzu.",
      step2: "Aktiviere Abrufen oder Lernen für die passenden Unterhaltungen.",
      step3: "Frag: „Was erinnerst du dich über meine Vorlieben?“",
    },
    read_aloud: {
      title: "Eine Antwort anhören",
      description: "Lass eine Assistentenantwort über die Sprachschaltfläche vorlesen.",
      step1: "Klicke auf das Lautsprecher-Symbol unter einer Assistenten-Nachricht.",
      step2: "Beende die Wiedergabe jederzeit mit der Stopp-Schaltfläche.",
    },
  },
  // Settings panel
  settings: {
    memory_mode: {
      label: "Erinnerungen",
      description:
        "Lege fest, wie diese Unterhaltung deine gespeicherten Erinnerungen verwendet.",
      help_label: "Mehr über Erinnerungen erfahren",
      options: {
        default: {
          label: "Standard",
          description:
            "Verwendet die globale Erinnerungseinstellung (aktuell: {{mode}}).",
        },
        none: {
          label: "Aus",
          description:
            "Gespeicherte Erinnerungen werden in dieser Unterhaltung nicht verwendet.",
        },
        recall: {
          label: "Abrufen",
          description:
            "Gespeicherte Erinnerungen werden in dieser Unterhaltung für persönlichere Antworten verwendet.",
        },
        learn: {
          label: "Lernen",
          description:
            "Gespeicherte Erinnerungen werden verwendet und neue Details aus dieser Unterhaltung gelernt.",
        },
      },
    },
    tools_enabled: "Werkzeuge sind aktiviert",
    tools_disabled: "Werkzeuge sind deaktiviert",
    web_search_enabled: "Websuche ist erlaubt",
    web_search_disabled: "Websuche ist deaktiviert",
    close_panel: "Einstellungen schließen",
    system_prompt_placeholder: "System-Prompt hier eingeben",
    reasoning_effort: {
      title: "Reasoning",
      subtitle: "Lege den Reasoning-Aufwand fest",
      options: {
        none: {
            label: "Aus",
            description: "Reasoning ist deaktiviert"
        },
        off: {
            label: "Aus",
            description: "Reasoning ist deaktiviert"
        },
        on: {
            label: "An",
            description: "Reasoning ist aktiviert"
        },
        minimal: {
            label: "Minimal",
            description: "Minimaler Reasoning-Aufwand",
          },
        low: {
            label: "Niedrig",
            description: "Niedriger Reasoning-Aufwand"
        },
        medium: {
            label: "Mittel",
            description: "Mittlerer Reasoning-Aufwand"
        },
        high: {
            label: "Hoch",
            description: "Hoher Reasoning-Aufwand"
        },
        xhigh: {
            label: "Hoch‌+",
            description: "Hoher Reasoning-Aufwand"
        },
        max: {
            label: "Maximal",
            description: "Maximaler Reasoning-Aufwand"
        }
      }
    },
    audio_title: "Sprachausgabe",
    audio_description: "Stimme und Sprache für den Sprachmodus und das Vorlesen.",
    audio_unavailable: "Die Sprachausgabe ist nicht konfiguriert.",
    label_audio_voice: "Stimme",
    label_audio_language: "Sprache",
    audio_option_auto: "Automatisch",
    audio_language_english: "Englisch",
    audio_language_german: "Deutsch",
    audio_preview: "Stimme anhören",
    audio_preview_stop: "Vorschau stoppen",
    audio_sample_text_en: "Hi, this is how I sound in a conversation.",
    audio_sample_text_de: "Hallo, so klinge ich in einem Gespräch.",
    audio_voice_af_bella: "Bella — US-Englisch, weiblich",
    audio_voice_af_nicole: "Nicole — US-Englisch, weiblich",
    audio_voice_af_sarah: "Sarah — US-Englisch, weiblich",
    audio_voice_am_adam: "Adam — US-Englisch, männlich",
    audio_voice_am_michael: "Michael — US-Englisch, männlich",
    audio_voice_bf_emma: "Emma — UK-Englisch, weiblich",
    audio_voice_bm_george: "George — UK-Englisch, männlich",
    audio_voice_bm_lewis: "Lewis — UK-Englisch, männlich",
    reset_default: "Standard zurücksetzen",
    default: "Standard",
    tools_title: "GWDG-Werkzeuge",
    tools_menu: "Werkzeuge",
    tools_all: "Alle Werkzeuge",
    tools_all_on: "Alle an",
    tools_all_off: "Alle aus",
    tools_back: "Zurück",
    tools_master: "Aktiv",
    tools_open_details: "Details zu {{name}}",
    tools_need_master: "Schalte die GWDG-Werkzeuge oben zuerst ein.",
    tools_external_model: "Mit externen Modellen stehen die GWDG-Werkzeuge nicht zur Verfügung.",
    tools_turn_on_for_options: "Schalte das Werkzeug ein, um es einzurichten.",
    tools_data_transfer_note: "Dieses Werkzeug kann Daten an Dienste außerhalb der GWDG senden.",
    tool_desc_web_search: "Sucht im Web nach aktuellen Informationen",
    tool_desc_image_generation: "Erzeugt Bilder aus einer Beschreibung",
    tool_desc_image_modification: "Bearbeitet angehängte Bilder nach deiner Anweisung",
    tool_desc_audio_generation: "Erzeugt Sprache oder Audio aus Text",
    tool_desc_arcana: "Antwortet mit Wissen aus deinen Arcana-Dokumenten",
    tool_desc_mcp_remote: "Bindet MCP-Server über das GWDG-Gateway an",
    tool_desc_share_local_folder: "Gibt dem Agenten Zugriff auf einen Ordner auf deinem Rechner",
    tool_desc_mcp_local: "Bindet MCP-Server direkt aus deinem Browser an",
    tool_desc_create_docx: "Erstellt Word-Dokumente zum Herunterladen",
    tool_desc_image_analysis: "Liest und beschreibt Bilder mit einem Vision-Modell",
    tool_desc_codemode: "Führt Code im Browser aus, um Aufgaben zu lösen",
    tool_folder_choose: "Ordner auswählen",
    arcana_no_id: "Noch keine Arcana-ID?",
    arcana_create_id_link: "Erstelle deine Dokumentensammlung im RAG-Manager",
    tool_folder_write_hint: "Erlaubt dem Agenten, Dateien im geteilten Ordner anzulegen und zu ändern.",
    tools_enable_all: "Alle aktivieren",
    tools_disable_all: "Alle deaktivieren",
    chat_settings: "Chat-Einstellungen",
    label_web_search: "Websuche",
    label_image_generation: "Bildgenerierung",
    label_image_modification: "Bildbearbeitung",
    label_image_analysis: "Bilder analysieren",
    label_audio_generation: "Audiogenerierung",
    label_arcana: "Arcana",
    label_mcp_server: "MCP-Server",
    label_mcp_remote: "MCP-Server (GWDG)",
    label_mcp_local: "MCP-Server (lokal)",
    label_write_access: "Schreiben erlauben",
    label_codemode: "Codemode",
    label_create_docx: "Word-Dokument",
    tools_agent_unavailable: "Im Agentenmodus nicht verfügbar",
    label_tool_limit: "Werkzeugaufrufe pro Antwort begrenzen",
    tool_limit_hint: "Maximale Werkzeugaufrufe pro Antwort; gemeinsam ausgeführte Aufrufe zählen einmal",
    tools_agent_external: "Dieses Modell läuft ohne Werkzeuge",
    placeholder_arcana_id: "Arcana-ID",
    placeholder_mcp_id: "Server-ID",
    placeholder_mcp_url: "http://localhost:3000/mcp",
    placeholder_mcp_auth: "Authorization-Header (optional)",
    mcp_add: "MCP-Server hinzufügen",
    mcp_remove: "Server entfernen",
    mcp_test: "Teste den Server über eine direkte Verbindung von deinem Computer aus",
    mcp_test_success: "{{name}} ist erreichbar ({{count}} Werkzeuge).",
    mcp_test_failed: "MCP-Test fehlgeschlagen: {{error}}",
    mcp_test_invalid_url: "Bitte gib zuerst eine gültige MCP-Server-URL ein.",
    mcp_toggle: "Diesen Server verwenden",
    mcp_gateway_first: "Ohne Agentenmodus wird nur der erste Server verwendet, als Gateway-Server-ID.",
  },

  // Conversation
  conversation: {
    local_tools: "Browser & lokale Werkzeuge",
    mount_folder: "Lokalen Ordner teilen",
    folder_mounted: "Ordner für den Assistenten unter {{path}} verfügbar",
    tool_failed: "fehlgeschlagen",
    codemode_running: "Code wird ausgeführt…",
    codemode_output: "Code-Ausgabe",
    speech_mode_title: "Sprachmodus",
    speech_mode_button: "Sprachmodus starten",
    speech_mode_close: "Sprachmodus beenden",
    speech_mode_listening: "Ich höre zu",
    speech_mode_capturing: "Ich höre zu",
    speech_mode_thinking: "Ich denke nach",
    speech_mode_speaking: "Ich spreche",
    speech_mode_error: "Sprachmodus benötigt Aufmerksamkeit",
    speech_mode_hint_listening: "Sprich einfach. Wenn du pausierst, sende ich die Nachricht.",
    speech_mode_hint_capturing: "Pausiere am Ende oder sende jetzt.",
    speech_mode_hint_interrupt: "Sprich jederzeit, um zu unterbrechen.",
    speech_mode_hint_error: "Prüfe den Mikrofonzugriff und versuche es erneut.",
    speech_mode_hint_start: "Mikrofon ist aktiv",
    speech_mode_send_now: "Jetzt senden",
    speech_mode_interrupt: "Unterbrechen",
    speech_mode_retry: "Erneut versuchen",
    speech_mode_didnt_catch: "Das habe ich nicht verstanden. Bitte versuche es erneut.",
    speech_mode_output_unavailable: "Die Sprachausgabe ist nicht verfügbar, die Antwort steht aber im Chat.",
    speech_mode_error_insecure: "Mikrofonzugriff erfordert HTTPS oder localhost.",
    speech_mode_error_permission: "Der Mikrofonzugriff wurde verweigert. Erlaube ihn und versuche es erneut.",
    speech_mode_error_no_microphone: "Es wurde kein Mikrofon gefunden.",
    speech_mode_error_microphone: "Das Mikrofon konnte nicht gestartet werden.",
    speech_mode_error_timeout: "Die Antwort hat zu lange gedauert. Bitte versuche es erneut.",
    speech_mode_error_conversation: "Diese Unterhaltung ist nicht mehr verfügbar.",
    prompt: {
      placeholder: "Frag mich",
      attach: "Datei anhängen",
      attach_media: "Medien anhängen",
      attachments: "Anhänge",
      clear_attachments: "Alle löschen",
    },
    attachment: {
      image_unsupported: "Modell wechseln, um Bilder zu verarbeiten",
      audio_unsupported: "Modell wechseln, um Audio zu verarbeiten",
      file_unsupported: "Nur mit {{filetype}}-Modell nutzbar",
      unprocessed: "Unverarbeitete Datei",
      transcript_of: "Transkript von {{name}}",
      converting: "Wird konvertiert…",
      transcribing: "Wird transkribiert…",
      process_browser: "Im Browser verarbeiten",
      process_server: "Auf dem Server verarbeiten",
      must_process: "Datei muss verarbeitet werden",
    },
    reasoning: "Denkprozess",
    copy_reasoning: "Denkprozess kopieren",
    reasoning_streaming: "Denkprozess läuft",
    reasoning_streaming_label: "Denke noch",
    reasoning_received_words_one: "{{count}} Wort empfangen",
    reasoning_received_words_other: "{{count}} Wörter empfangen",
    action: "Aktion",
    html_block: {
      render: "HTML rendern",
      show_code: "Code anzeigen",
    },
    typst_block: {
      render: "Als Typst rendern",
      show_code: "Code anzeigen",
    },
    latex_block: {
      render: "Als LaTeX rendern",
      show_code: "Code anzeigen",
    },
    sources: "Quellen und Referenzen",
    references: "Referenzen",
    empty_message:
      "Deine Gespräche werden niemals auf unseren Servern gespeichert.",
    fork_empty: "Keine Nachrichten zum Kopieren gefunden.",
    fork_created: "Neue Unterhaltung erstellt.",
    fork_failed: "Unterhaltung konnte nicht kopiert werden.",
    untitled: "Unbenannter Chat",
  },
  // Footer
  footer: {
    imprint: "Impressum",
    terms: "Nutzungsbedingungen",
    docs: "Doku",
    privacy: "Datenschutz",
    faq: "FAQ",
    contact: "Kontakt",
    about: "Über uns",
    copyright: "{{year}} GWDG © Alle Rechte vorbehalten",
    iso_certified: "ISO 27001 Zertifiziert",
    switch_to_light: "Zum hellen Design wechseln",
    switch_to_dark: "Zum dunklen Design wechseln",
    switch_language: "Sprache wechseln",
  },
  // User Settings Modal
  user_settings: {
    title: "Einstellungen",
    tabs: {
      navigation_label: "Bereiche der Profileinstellungen",
      profile: {
        label: "Profil",
        title: "Profil und Nutzung",
        description: "Überblick über deine Kontodaten und Nutzung.",
      },
      chat: {
        label: "Chat",
        title: "Chat-Einstellungen",
        description:
          "Lege Standards für alle Unterhaltungen auf diesem Gerät fest.",
      },
      memories: {
        label: "Erinnerungen",
        title: "Gespeicherte Erinnerungen",
        description:
          "Prüfe und verwalte die von Chat AI gespeicherten Details.",
      },
      data: {
        label: "Daten",
        title: "Daten und Datenschutz",
        description:
          "Exportiere oder entferne die in diesem Browser gespeicherten Daten.",
      },
    },
    account: {
      username: "Benutzername",
      email: "E-Mail-Adresse",
    },
    usage: {
      title: "Nutzung",
      show_details: "Nutzung anzeigen",
      description:
        "Überblick über deine monatliche Nutzung und das Organisationsbudget.",
      monthly: "Monatlich",
      total: "Gesamt",
      personal: "Persönlich",
      organization: "Organisation",
      personal_monthly: "Persönlich monatlich",
      personal_total: "Persönlich gesamt",
      organization_monthly: "Organisation monatlich",
      organization_total: "Organisation gesamt",
      resets_at: "Zurücksetzung {{time}}",
      rate_limits: {
        "10s": "10 s",
        hourly: "Stündlich",
        daily: "Täglich",
        monthly: "Monatlich",
      },
      sections: {
        budget: "Budget",
        rate_limits: "Ratenlimits",
        requests: "Anfragen",
      },
      scopes: {
        external: "Extern",
        internal: "Intern",
      },
    },
    monthly_usage: "Monatliche Nutzung",
    org_usage: "Nutzung des Organisationsbudgets",
    sidebar_usage: {
      label: "Nutzung in der Seitenleiste anzeigen",
      description:
        "Deine aktuelle Nutzung bleibt beim Chatten in der Seitenleiste sichtbar.",
    },
    chat_preferences: {
      title: "Chat-Einstellungen",
      description:
        "Diese Einstellungen gelten für alle Unterhaltungen auf diesem Gerät.",
      memory: {
        label: "Erinnerungen",
        description:
          "Lege fest, wie Chat AI deine gespeicherten Erinnerungen verwendet.",
        help_label: "Mehr über Erinnerungen erfahren",
        options: {
          none: {
            label: "Keine",
            description: "Gespeicherte Erinnerungen werden nicht verwendet.",
          },
          recall: {
            label: "Abrufen",
            description:
              "Gespeicherte Erinnerungen werden für persönlichere Antworten verwendet.",
          },
          learn: {
            label: "Lernen",
            description:
              "Erinnerungen werden verwendet und um relevante neue Details ergänzt.",
          },
        },
      },
      suggestions: {
        section_label: "Vorschläge",
        label: "Folgevorschläge anzeigen",
        description:
          "Zeigt nach jeder Antwort passende Vorschläge zum Fortsetzen des Chats.",
        help_label: "Mehr über Folgevorschläge erfahren",
        title_once: {
          label: "Titel nur bei der ersten Anfrage festlegen",
          description:
            "Den Gesprächstitel nur einmal, aus der ersten Anfrage, generieren.",
        },
      },
      summaries: {
        section_label: "Unterhaltungszusammenfassungen",
        label: "Zusammenfassungen beim Darüberfahren anzeigen",
        description:
          "Beim Verlassen eines Chats wird eine kurze Zusammenfassung erstellt und beim Darüberfahren mit der Maus in der Seitenleiste angezeigt.",
      },
      submission: {
        label: "Nachricht senden mit",
        options: {
          enter: {
            label: "Enter",
            description:
              "Enter sendet die Nachricht. Umschalt+Enter fügt einen Zeilenumbruch ein.",
          },
          shift_enter: {
            label: "Umschalt+Enter",
            description:
              "Umschalt+Enter sendet die Nachricht. Enter fügt einen Zeilenumbruch ein. Dies ist die Standardeinstellung auf mobilen Geräten.",
          },
        },
      },
      html_render: {
        label: "HTML-Blöcke rendern",
        description:
          "Legt fest, wie HTML-Blöcke in Antworten standardmäßig angezeigt werden.",
        options: {
          render: {
            label: "Rendern",
            description:
              "HTML-Blöcke als Live-Inhalt rendern. Pro Block kann weiterhin auf den Code gewechselt werden.",
          },
          code: {
            label: "Code",
            description:
              "HTML-Blöcke standardmäßig als Code anzeigen. Pro Block kann weiterhin gerendert werden.",
          },
          off: {
            label: "Aus",
            description:
              "HTML-Blöcke nicht automatisch rendern. Sie werden zunächst als Code angezeigt; pro Block kann weiterhin gerendert werden.",
          },
        },
        external_references: {
          label: "Externe Referenzen laden",
          description:
            "Erlaubt HTML-Blöcken, Bilder und Links von externen Hosts zu laden. Standardmäßig aus: Ist die Option deaktiviert, werden externe Referenzen entfernt, sodass der Browser nur diesen Server kontaktiert.",
        },
        sanitization: {
          label: "Bereinigung",
          description:
            "Legt fest, wie streng HTML-Blöcke vor dem Rendern bereinigt werden.",
          options: {
            strict: {
              label: "Streng",
              description:
                "Blockiert interaktive und scriptfähige HTML-Elemente (Buttons, Formulare, Iframes, Skripte, Inline-Styles). Am sichersten für unvertraute Inhalte.",
            },
            relaxed: {
              label: "Gelockert",
              description:
                "Erlaubt interaktives HTML mit JavaScript (Buttons, Formulare, Iframes, Skripte, Inline-Styles). Warnung: Modellausgaben können Code ausführen – nur aktivieren, wenn die Quelle vertrauenswürdig ist.",
            },
          },
        },
      },
      rendering: {
        label: "Darstellung",
      },
      typst: {
        label: "Typst-Blöcke rendern",
        description:
          "Legt fest, ob Typst-Codeblöcke standardmäßig gerendert werden. Pro Block kann weiterhin zwischen Darstellung und Code gewechselt werden.",
      },
      latex: {
        label: "LaTeX-Blöcke rendern",
        description:
          "Legt fest, ob LaTeX-Codeblöcke standardmäßig gerendert werden. Pro Block kann weiterhin zwischen Darstellung und Code gewechselt werden.",
      },
      reasoning_streaming: {
        label: "Denkprozess beim Streamen geschlossen halten",
        description:
          "Hält die Denkprozess-Box während des Streamings geschlossen und zeigt stattdessen einen kleinen bewegten Aktivitätspunkt. Klicke auf die Kopfzeile, um sie während des Streamings zu öffnen; nach der Antwort kannst du sie ebenfalls öffnen.",
      },
      document_conversion: {
        label: "Dokumentkonvertierung",
        options: {
          server: {
            label: "Nur Server",
            description:
              "Angehängte PDF- und DOCX-Dateien immer auf dem Server verarbeiten.",
          },
          browser: {
            label: "Nur Browser",
            description:
              "Angehängte PDF- und DOCX-Dateien immer lokal im Browser verarbeiten.",
          },
          choice: {
            label: "Nach Wahl",
            description:
              "Lege für jedes Dokument fest, ob es im Browser oder auf dem Server verarbeitet wird.",
          },
        },
      },
    },
    default_model: {
      title: "Standardmodell",
      current: "Aktuell: {{currentModel}}",
      description: "Wähle das Standardmodell für neue Gespräche aus.",
      list_label: "Verfügbare Standardmodelle",
    },
    sidebar_width: {
      label: "Breite der Seitenleiste",
    },
    timeout: {
      title: "Wartezeit für Antworten",
      description: "Bestimme, wie lange auf KI-Antworten gewartet wird.",
      seconds: "Wartezeit (Sekunden)",
      seconds_short: "Sek.",
      range: "Bereich: 5-900 Sekunden",
    },
    data: {
      title: "Daten verwalten",
      description:
        "Exportiere eine Kopie deiner lokalen Daten oder entferne Unterhaltungen, Erinnerungen, Einstellungen und Anhänge dauerhaft aus diesem Browser.",
      export_success: "Lokale Daten wurden erfolgreich exportiert.",
      export_error: "Lokale Daten konnten nicht exportiert werden.",
    },
    clear_data_button: "Daten löschen",
    import_data_button: "Daten importieren",
    export_data_button: "Daten exportieren",
    memory: {
      title: "Erinnerungen",
      description:
        "Verwalte deine persönlichen Erinnerungen, die der KI helfen, wichtige Details über dich zu behalten. Du hast derzeit {{count}} Erinnerungen gespeichert.",
      manage: "Erinnerungen verwalten",
    },
    logout: "Abmelden",
  },
  // Import Persona Modal
  persona: {
    selectPersona: "Persona auswählen",
    browsePersonas: "KI-Personas durchsuchen und importieren",
    personas: "Personas",
    back: "Zurück",
    errorLoading: "Fehler beim Laden der Personas",
    retry: "Erneut versuchen",
    noPersonas: "Keine Personas in diesem Ordner gefunden",
    configuration: "Persona-Konfiguration",
    folder: "Ordner",
    createOwn: "Eigene erstellen",
    importFromClipboard: "Aus Zwischenablage",
    importFromClipboardErrorInvalidJson:
      "Import aus Zwischenablage fehlgeschlagen. Kein gültiges JSON gefunden.",
    importFromClipboardErrorInvalidPersona:
      "Import aus Zwischenablage fehlgeschlagen. Ungültige Persona-Daten.",
    personaLibrary: "Persona-Bibliothek",
    categories: "Kategorien",
    quickImport: "Schnellimport",
    selectFolder: "Keine Kategorie ausgewählt",
    selectFolderDescription:
      "Wähle eine Kategorie aus der Seitenleiste, um Personas anzuzeigen",
    emptyFolder: "Dieser Ordner ist leer",
    categoryCount: "{{folders}} Kategorien • {{files}} Personas",
    chat_label: "Persona-Chat",
    category_label: "Kategorie",
    startChat: "Chat starten",
    startChatWith: "Chat mit {{title}} starten",
    startingChat: "Wird gestartet…",
    startError: "Diese Persona konnte nicht geladen werden. Bitte versuche es erneut.",
  },
  // Memory Modal
  memory: {
    userMemory: "Erinnerungen",
    memoryCount_one: "{{count}} Erinnerung gespeichert",
    memoryCount_other: "{{count}} Erinnerungen gespeichert",
    addNew: "Neue Erinnerung hinzufügen",
    add: "Hinzufügen",
    savedMemories: "Gespeicherte Erinnerungen",
    deleteAll: "Alle löschen",
    noMemories: "Noch keine Erinnerungen gespeichert.",
    addFirst: "Füge oben deine erste Erinnerung hinzu!",
    save: "Speichern",
    cancel: "Abbrechen",
    created: "Erstellt: {{date}}",
    edit: "Bearbeiten",
    delete: "Löschen",
    clearAllTitle: "Alle Erinnerungen löschen",
    clearAllWarning:
      "Bist du sicher, dass du alle {{count}} Erinnerungen löschen möchtest? Diese Aktion kann nicht rückgängig gemacht werden und entfernt dauerhaft alle deine gespeicherten Erinnerungen.",
    warningTitle: "Warnung",
    warningText:
      "Du verlierst alle persönlichen Erinnerungen, die der KI helfen, deine Präferenzen und deinen Kontext zu verstehen. Erwäge, sie zuerst zu exportieren, falls erforderlich.",
    dontShowAgain: "Diese Warnung nicht mehr anzeigen",
    clearAll: "Alle Erinnerungen löschen ({{count}})",
  },
  // Export Conversation Modal
  export_conversation: {
    title: "Chat exportieren",
    json: "JSON-Datei",
    pdf: "PDF-Datei",
    text: "TXT-Datei",
    export: "Exportieren",
    export_settings: "Modell und Optionen einbeziehen",
    export_files: "Dateien einbeziehen",
    export_arcana: "Arcana-Details einbeziehen",
    export_mcp_servers: "MCP-Server einbeziehen",
  },
  // Rename Conversation Modal
  rename_conversation: {
    title: "Chat umbenennen",
    enter_name: "Chat-Titel eingeben",
    alert_empty: "Titel ist erforderlich",
  },
  // Delete Conversation Modal
  delete_conversation: {
    title: "Chat löschen",
    description: "Bist du sicher, dass du diesen Chat löschen möchtest?",
  },
  // Share Settings Modal
  share_settings: {
    description:
      "Mit dieser Funktion wird ein Link erstellt, der dein Modell, den Systemprompt und deine Einstellungen (einschließlich Tool-Konfiguration) enthält. Jeder Benutzer, der diesen Link öffnet, kann dieselbe Konfiguration in seinen eigenen Unterhaltungen verwenden. Dein Gesprächsverlauf wird nicht freigegeben.",
    warn_arcana:
      "Warnung: Die Weitergabe von arcana-Details kann die in arcana hochgeladenen Daten gefährden.",
    warn_mcp:
      "Warnung: Die Weitergabe eines MCP-Servers kann dazu führen, dass Eingaben oder Daten beim Einsatz von MCP an diesen Server gesendet werden.",
  },
  // Help modals
  help: {
    title: "Hilfe",
    choiceproposer:
      "Wenn diese Option aktiviert ist, zeigt Chat AI nach jeder Antwort passende Folgevorschläge an. Diese Einstellung gilt für alle Unterhaltungen auf diesem Gerät.",
    arcana:
      "Arcana ist eine einzigartige Funktion unseres Dienstes, die das LLM mit spezialisiertem Wissen ausstattet. Wenn du eine gültige Arcana-ID und den entsprechenden Schlüssel eingibst, erhält das LLM Zugriff auf das in dieser Arcana enthaltene Wissen. Dies ermöglicht es dem Modell, Antworten zu generieren, die besser informiert und relevanter für deine Bedürfnisse sind. Lass das Feld für die ID leer, um das Modell ohne spezialisiertes Wissen zu verwenden.",
    mcp: "Bitte gib die URL deines MCP (Model Context Protocol) Servers ein (z. B. https://...). Der MCP-Server ist ein Dienst, der der Chat-AI zusätzliche Werkzeuge, Datenquellen oder Verarbeitungskapazitäten bereitstellen kann, die über ihr eingebautes Wissen hinausgehen. Durch die Verbindung mit dem angegebenen MCP-Server kann die KI mit externen Systemen interagieren, aktuelle oder spezialisierte Informationen abrufen und benutzerdefinierte Aufgaben entsprechend den angebotenen Funktionen ausführen.",
    models:
      "Chat AI bietet Zugriff auf eine Palette von state-of-the-art Large Language Models (LLMs), jedes mit eigenen Fähigkeiten und Leistungsmerkmalen. Dies ermöglicht es dir, den Modelltyp auszuwählen, der am besten deinen Forschungszielen und Anforderungen entspricht.\
      Größere Modelle bieten typischerweise höhere Antwortqualitäten, aber haben aufgrund ihrer erhöhten Komplexität längere Antwortzeiten. Umgekehrt bieten kleinere Modelle schnellere Antwortzeiten, mögen jedoch einige Genauigkeit und Tiefe opfern. Mit der Liste der verfügbaren Modelle kannst du Abwägungen zwischen Antwortqualität und Geschwindigkeit treffen, um deinen spezifischen Bedürfnissen gerecht zu werden. Für weitere Einzelheiten",
    reasoning:
      "Die Reasoning-Einstellung bestimmt, wie tief das Modell Informationen verarbeitet und analysiert, bevor es eine Antwort generiert. Ein höherer Reasoning-Aufwand bedeutet, dass das Modell mehr Zeit darauf verwendet, den Kontext sorgfältig zu prüfen, mögliche Interpretationen abzuwägen und seinen internen Denkprozess zu verfeinern, um eine präzisere, differenziertere und besser strukturierte Antwort zu erzeugen. Ein niedrigerer Reasoning-Aufwand priorisiert Geschwindigkeit über Tiefe, was zu schnelleren, aber möglicherweise weniger gründlichen Antworten führt. Passe diese Einstellung an, je nachdem, ob du schnelle Antworten oder sorgfältig ausgearbeitete, hochwertige Ergebnisse brauchst.",
    memory:
      "Erinnerungen sind eine globale Einstellung für alle Unterhaltungen auf diesem Gerät. 'Keine' verwendet keine gespeicherten Erinnerungen. 'Abrufen' nutzt gespeicherte Erinnerungen für persönlichere Antworten. 'Lernen' speichert zusätzlich relevante neue Details aus deinen Unterhaltungen. Erinnerungen werden ausschließlich in deinem Browser gespeichert.",
    system_prompt:
      "Der Systemprompt ist ein spezieller Befehl oder eine Anweisung, die zu Beginn eines Gesprächs gegeben wird, um den Ton, den Kontext oder die Einschränkungen für unsere Interaktion festzulegen. Damit wird das Verhalten des Modells gelenkt und sichergestellt, dass es auf hilfreiche und angemessene Weise reagiert.",
    temperature:
      "Eine niedrige Temperatur (z. B. 0-1) erzeugt vorhersehbarere und logischere Antworten, während höhere Temperaturen (z. B. über 1) die Möglichkeit kreativerer und unkonventionellerer Antworten erhöhen. Du kannst die Temperatureinstellung anpassen, um verschiedene Stufen der Vorhersagbarkeit und Kreativität zu erreichen.",
    tools:
      "Tools sind eine neue und experimentelle Funktion, die darauf ausgelegt ist, die Fähigkeiten von Chat-AI zu erweitern. Sie ermöglichen dem Modell, zusätzliche Aktionen auszuführen oder auf weitere Ressourcen zuzugreifen, um nützlichere, genauere oder spezialisierte Antworten zu liefern. Zu den aktuellen Tools gehören Arcana (für alle Modelle) und Websuche (optional); weitere Tools sind für die Zukunft geplant. Da sich diese Funktion noch in Entwicklung befindet, können sich Funktionsumfang und verfügbare Tools im Laufe der Zeit ändern.",
    web_search:
      "Das Websuche-Werkzeug ermöglicht es der KI, aktuelle Informationen aus dem Internet abzurufen, um ihre Antworten zu verbessern. Wenn es aktiviert ist, kann die KI auf Grundlage deiner Frage und des gesamten Gesprächsverlaufs Suchanfragen erstellen, diese an eine Suchmaschine (wie z. B. Google) senden und die erhaltenen Ergebnisse nutzen, um genauere und aktuellere Antworten zu geben. Dies ist besonders nützlich bei Themen, bei denen aktuelle oder sich schnell ändernde Informationen wichtig sind.",
    top_p:
      "top_p ist ein Schieberegler von 0 bis 1, der den Gesamtbestand der Wahrscheinlichkeiten anpasst, die für das nächste Token in Betracht gezogen werden. Ein top_p von 0,1 würde bedeuten, dass nur die oberen 10% der kumulativen Wahrscheinlichkeiten berücksichtigt werden. Die Variation von top_p hat einen ähnlichen Effekt auf Vorhersagbarkeit und Kreativität wie die Temperatur.",
  },
  model_selector: {
    filter: "Filter",
    filter_clear: "Filter entfernen",
    section_deployment: "Bereitstellung",
    section_input: "Eingabe",
    section_purpose: "Zweck",
    input_image: "Bild",
    input_video: "Video",
    input_audio: "Audio",
    input_arcana: "Arcana",
    purpose_reasoning: "Komplexe Aufgaben (Thinking)",
    purpose_coding: "Programmieren",
    purpose_writing: "Schreiben & Alltag",
    purpose_fast: "Schnelle Antworten",
    purpose_long_documents: "Lange Dokumente",
    purpose_translation: "Übersetzen & Mehrsprachigkeit",
    no_results: "Kein Modell gefunden. Versuche einen anderen Suchbegriff.",
    change_model: "Modell wechseln",
    docs_hint_text: "Unsicher, welches Modell du wählen sollst?",
    docs_hint_link: "Lies die Modellübersicht.",
    scope_filter: "Modelle filtern",
    scope_all: "Alle Modelle",
    scope_internal: "Intern",
    scope_external: "Extern",
  },
  // Tour
  tour: {
    welcome_message: "Willkommen bei Chat AI",
    start_tour: "Tour starten",
    skip_tour: "Tour überspringen",
    description:
      "Klicke auf die Schaltfläche unten, um die geführte Tour zu starten und die neue Benutzeroberfläche zu erkunden.",
    prompt: 
      "Gib hier einfach deine Nachricht ein, um die Unterhaltung mit Chat AI zu starten. Du kannst Dateien anhängen; das Modell wird sie verwenden, sofern der Dateityp unterstützt wird.",
    model:
      "Hier kannst du das Modell auswählen, mit dem du chatten möchtest. Jedes Modell hat seine eigenen Eigenschaften, Fähigkeiten und Einschränkungen.", 
    sidebar:
      "Hier kannst du Unterhaltungen erstellen, löschen, importieren, exportieren, durchsuchen und zwischen ihnen wechseln. Organisiere deine Unterhaltungen in Themen und chatte auf Wunsch mit vordefinierten Personas.",
    settings:
      "Hier kannst du unterhaltungsspezifische Einstellungen wie System-Prompt, Temperatur, Top_p und GWDG-Tools wie Arcana, Bildgenerierung und Websuche anpassen. Tools funktionieren möglicherweise nicht mit allen Modellen.",
    profile:
      "Diese Schaltfläche öffnet dein Benutzerprofil, in dem du deine Einstellungen festlegen, gespeicherte Erinnerungen verwalten sowie deine Daten exportieren oder löschen kannst.",
    interface:
      "In dieser Ecke kannst du das Design und die Sprache von Chat AI wechseln.",
    memory: {
      off: "Memory - None: Chat AI erinnert sich an nichts aus früheren Gesprächen, wie zuvor.",
      recall:
        "Recall: Chat AI kann relevante Erinnerungen über dich aus früheren Gesprächen nutzen, erinnert sich aber an nichts aus dem aktuellen Gespräch.",
      on: "Learn: Chat AI lernt aktiv Dinge über dich aus dem aktuellen Gespräch und ruft auch Erinnerungen ab, die sie zuvor gesammelt hat.",
      settings:
        "Du kannst Erinnerungen jederzeit im Benutzerprofil-Panel in der oberen rechten Ecke ansehen, hinzufügen, bearbeiten und entfernen. Erinnerungen werden nur lokal in deinem Browser gespeichert.",
    },
    back: "Zurück",
    close: "Schließen",
    last: "Abschließen",
    next: "Weiter",
    skip: "Überspringen",
  },
  // Alerts and warnings
  alert: {
    mcp_unreachable: "Der MCP-Server {{url}} ist nicht erreichbar. Stelle sicher, dass er läuft, oder schalte ihn in den Werkzeugeinstellungen aus, um fortzufahren.",
    mcp_name_changed_title: "Name des MCP-Servers geändert",
    mcp_name_changed:
      "Der Server unter {{server}} meldet jetzt den Namen \"{{actualName}}\" statt \"{{previousName}}\". Verbinden und den gespeicherten Namen aktualisieren?",
    mcp_name_changed_connect: "Verbinden und aktualisieren",
    folder_access:
      "Der Assistent möchte den lokalen Ordner <strong>{{name}}</strong> wieder verwenden. Nach einem Neuladen muss der Zugriff erneut erlaubt werden.",
    title: "Warnung",
    bad_request:
      "Fehlerhafte Anfrage wurde gesendet: Bitte lösche die Konversation, versuche es innerhalb des Limits erneut, und speichere deinen Chatverlauf für spätere Zwecke.",
    clear_data: "Achtung! Die Löschung löscht deinen Verlauf. Fortfahren?",
    clear_messages:
      "Bist du sicher, dass alle Nachrichten gelöscht werden sollen?",
    regenerate_confirm:
      "Beim Regenerieren werden diese Antwort und alle nachfolgenden Nachrichten gelöscht und die aktuellen Einstellungen angewendet. Dies kann nicht rückgängig gemacht werden. Um diese Unterhaltung zu behalten, verwende stattdessen „In neuem Chat fortfahren“.",
    regenerate_yes: "Regenerieren",
    fork_confirm:
      "Die Unterhaltung wird bis zu dieser Nachricht in einen neuen Chat kopiert. Die aktuelle Unterhaltung bleibt unverändert, du kannst also eine andere Antwort oder andere Einstellungen ausprobieren, ohne etwas zu verlieren.",
    fork_yes: "Kopie erstellen",
    regenerate_fork: "Kopie",
    regenerate_fork_success: "Chat erfolgreich geforkt",
    regenerate_fork_fail: "Chat konnte nicht geforkt werden.",
    summarize_replace:
      "Dies erstellt einen neuen Chat mit einer Zusammenfassung. Dein aktueller Chat bleibt unverändert. Fortfahren?",
    summarize_in_progress:
      "Deine Unterhaltung wird zusammengefasst. Bitte warte, während die Zusammenfassung erstellt wird.",
    no: "Nein, geh zurück",
    yes: "Ja, alles löschen",
    system_prompt_empty: "System-Prompt ist leer. Modell reagiert evtl. nicht.",
    data_security_warning: 
      "Du verwendest ein externes Modell oder externe Tools. Deine Nachrichten können außerhalb der GWDG verarbeitet werden. Benutzerdefinierte Einstellungen und GWDG-Tools sind möglicherweise nicht verfügbar. Bitte unterlasse die Eingabe vertraulicher oder personenbezogener Daten.",
    data_security_warning_mpg:
      "Du verwendest ein externes Modell oder externe Tools. Deine Nachrichten können außerhalb der GWDG verarbeitet werden. Benutzerdefinierte Einstellungen und GWDG-Tools sind möglicherweise nicht verfügbar. Bitte unterlasse die Eingabe vertraulicher oder personenbezogener Daten. Externe Modelle sind nur nutzbar für wissenschaftliche Beschäftigte für wissenschaftliche Arbeiten, sofern keine personenbezogenen Daten eingegeben werden.",
    data_security_warning_tools:
      "Ein eingeschaltetes Werkzeug (z. B. Websuche oder MCP-Server) kann Daten außerhalb der GWDG verarbeiten. Bitte gib keine vertraulichen oder personenbezogenen Daten ein.",
    data_security_notice: "Deine Daten werden sicher innerhalb unserer Server verarbeitet. Es werden keine Informationen außerhalb der GWDG übertragen.",
    arcana_usage:
      "Halte Temperatur auf 0 und top_p auf 0.05 für optimale Arcana-Ergebnisse",
    arcana_create_collection_prefix:
      "Erstelle deine eigene Dokumentensammlung",
    arcana_create_collection_link: "hier",
    web_search_usage:
      "PRIVACY WARNUNG: Dein Verlauf kann an eine Suchmaschine (z. B. Google) gesendet werden",
    mcp_usage:
      "PRIVACY WARNUNG: Deine Daten können an externe Server gesendet werden.",
    arcana_export:
      "Warnung: Das Exportieren von Arcana-Details in eine Datei kann deine privaten Daten gefährden, da sie für andere zugänglich sind.",
    mcp_export:
      "Warnung: Das Exportieren von MCP-Serverdaten in eine Datei kann externe Endpunkte offenlegen und dazu führen, dass Daten an Drittanbieter-Server gesendet werden.",
    model_offline:
      "Das von dir ausgewählte Modell ist derzeit offline. Durch das Anklicken von OK unten startet das Modell und wird in wenigen Minuten online sein. In der Zwischenzeit kannst du gerne ein anderes Modell auswählen.",
    session_expired:
      "Deine Sitzung ist abgelaufen. Bitte aktualisiere die Webseite.",
    unsent_files:
      "Du hast Dateien angehängt, die verloren gehen werden. Bist du sicher, dass du gehen willst?",
    unprocessed_files:
      "Du hast eine unverarbeitete Datei. Bitte verarbeite oder entferne sie zuerst.",
    migrate_data:
      "Es sieht so aus, als ob du eine ältere Version von Chat AI verwendest. Um fortzufahren, müssen deine vorherigen Gespräche und Daten aktualisiert werden. Bitte sichere deine Daten zuerst, falls erforderlich, und drücke dann auf 'Aktualisieren', um den Prozess zu starten.",
    // Hallucination warning
    hallucination: {
      note1: "Hinweis: Chatbots sind anfällig für",
      note2: "und ihre Antworten sollten nicht als korrekt angesehen werden.",
      note3: "Halluzination",
    },
    // External models
    settings_external:
      "Diese Einstellungen wirken sich nicht auf externe (OpenAI) Modelle aus.",
    import_settings_title: "Importierte Einstellungen prüfen",
    import_settings_intro:
      "Dieser geteilte Einstellungs-Link enthält Optionen, die Teile deiner Unterhaltung an externe Dienste senden können. Wähle aus, was importiert werden soll.",
    import_web_search_disclaimer:
      `Wenn die Websuche aktiviert ist, kann die KI auf Grundlage deiner Nachricht und des Gesprächsverlaufs Suchanfragen erstellen und diese an eine Suchmaschine (z. B. Google) senden.\n\nErlaube dies nur, wenn du damit einverstanden bist, dass deine Daten extern verarbeitet werden, und wenn du während der aktiven Websuche keine vertraulichen, persönlichen oder sensiblen Informationen teilst.`,
    import_mcp_disclaimer:
      `MCP-Server können außerhalb der GWDG betrieben werden. Wenn aktiviert, kann die KI Daten an konfigurierte MCP-Server senden, um Tool-Anfragen auszuführen.\n\nErlaube dies nur, wenn du den konfigurierten MCP-Servern vertraust und keine vertraulichen, persönlichen oder sensiblen Informationen mit ihnen teilst.`,
    web_search_disclaimer: `Wenn die Websuche aktiviert ist, kann die KI auf Grundlage deiner Nachricht und des gesamten Gesprächsverlaufs Suchanfragen erstellen und diese an eine Suchmaschine (z. B. Google) senden, um aktuelle Informationen abzurufen. Dies hilft, genauere und aktuellere Antworten bereitzustellen.\n\nDurch Klicken auf „Ich verstehe“ stimmst du zu, dass deine Eingaben auf diese Weise verarbeitet werden, und bestätigst, dass du während der aktiven Websuche keine vertraulichen, persönlichen oder sensiblen Informationen teilst.`,
  },
  // Landing page
  landing: {
    title: "Du bist nicht angemeldet",
    description: "Bitte melde dich an, um Chat AI zu verwenden.",
    reasonsTitle: "Du kannst dich anmelden, wenn du:",
    reasons: {
      deleted:
        "• Mitglied einer deutschen Universität oder Forschungseinrichtung bist",
      outdatedLink: "• Mitglied einer Organisation im DFN bist",
      incorrectId: "• ein registrierter Benutzer in AcademicCloud bist",
      historyCleared: "• von der GWDG Zugriff bekommen hast",
    },
    reassurance: "Verwende einfach den Button unten, um dich anzumelden.",
    buttonText: "Anmelden mit AcademicCloud SSO",
  },
  not_found: {
    title: "404: Unterhaltung nicht gefunden",
    description:
      "Ups! Du versuchst, auf eine Unterhaltung zuzugreifen, die in deinem Chatverlauf nicht existiert.",
    reasonsTitle: "Dies kann folgende Gründe haben:",
    reasons: {
      deleted: "• Die Unterhaltung wurde gelöscht",
      outdatedLink: "• Du verwendest einen veralteten oder ungültigen Link",
      incorrectId: "• Die Unterhaltungs-ID in der URL ist falsch",
      historyCleared: "• Dein Chatverlauf wurde gelöscht",
    },
    reassurance:
      "Keine Sorge! Du kannst eine neue Unterhaltung starten, indem du auf den Button unten klickst.",
    buttonText: "Zum Chat gehen",
  },
  file_preview: {
    no_file: "Keine Datei zur Vorschau",
    no_data: "Keine Daten verfügbar",
    no_content: "Kein Inhalt verfügbar",
    unsupported: "Nicht unterstützter Dateityp",
    error: "Fehler: {{message}}",
    error_display: "Fehler beim Anzeigen des Inhalts: {{message}}",
    csv_parse_failed: "CSV-Inhalt konnte nicht gelesen werden",
    image_failed: "Bild konnte nicht geladen werden",
    video_failed: "Video konnte nicht geladen werden",
    video_unsupported: "Dein Browser unterstützt das Video-Element nicht.",
    pdf_failed: "PDF konnte nicht angezeigt werden",
    pdf_mobile_title: "Die PDF-Vorschau ist auf Mobilgeräten nicht verfügbar",
    pdf_mobile_hint: "Bitte nutze einen Desktop-Browser für die PDF-Vorschau",
    pdf_original_title: "Vorschau des Original-PDFs",
    pdf_original_hint: "Dieses PDF wurde noch nicht verarbeitet. Klicke auf \"Verarbeiten\", um den Text zu extrahieren.",
    pdf_missing_title: "PDF-Inhalt nicht verfügbar",
    pdf_missing_hint: "Die Daten des Original-PDFs sind für die Vorschau nicht verfügbar",
    docx_failed: "Word-Dokument konnte nicht angezeigt werden",
    save: "Auf Gerät speichern",
    save_failed: "Datei konnte nicht heruntergeladen werden",
    download_aria: "Datei herunterladen",
    close_aria: "Schließen",
  },
  typst: {
    rendering: "Typst-Dokument wird gerendert...",
    render_error:
      "Typst-Dokument konnte nicht gerendert werden. Quelle wird stattdessen angezeigt:",
  },
  latex: {
    rendering: "LaTeX-Dokument wird gerendert...",
    render_error:
      "LaTeX-Dokument konnte nicht gerendert werden. Quelle wird stattdessen angezeigt:",
  },
  // Announcement
  announcement: "",
  // Editierbare Tool-Formulare
  tool_form: {
    submit: "Tool ausführen",
    sending: "Wird ausgeführt...",
    reset: "Zurücksetzen",
    edit: "Bearbeiten",
    tool_call: "Tool-Aufruf",
    select_placeholder: "Auswählen…",
  },
};

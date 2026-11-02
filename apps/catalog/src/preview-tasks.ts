// Each task names an action or comparison available in its live preview.
export const previewTasks: Readonly<Record<string, string>> = {
  // Foundations
  "themes": "Apply a palette, then switch appearance to compare its accents on the same surfaces.",
  "tokens": "Search for accent, inspect its resolved value, then copy the CSS variable.",
  "icons": "Search for an icon, compare its size and motion, then copy its named import.",
  "typography": "Compare the article's headings, body text, quotation and inline code at different widths.",
  "accessibility": "Focus the skip link and press Enter to reach the example content, then add a project update.",
  "kbd": "Compare macOS and Windows shortcut notation beside the actions each shortcut names.",
  "formatting": "Change the display locale to compare the formatted report metadata.",

  // Layout
  "layout-widths": "Narrow the browser window to compare full, content, reading and form widths.",
  "layout-groups": "Narrow the browser window to see the project grid and inline groups reflow.",
  "separator": "Compare how horizontal and vertical separators group the project's metadata and next review.",
  "card": "Review one project to see its action update the shared status below the cards.",
  "page-header": "Add a review to update the section count, or create a project draft from the page header.",
  "toolbar": "Save the draft or open its preview, then follow the status beneath the action group.",

  // Actions & selection
  "buttons": "Activate the primary action, then save changes to compare immediate and pending feedback.",
  "button-group": "Save the sample document or request a review and follow the status below the groups.",
  "copy-action": "Copy the project reference to try failure feedback, then turn off simulated failure and retry.",
  "checkbox": "Choose delivery channels, then inspect the values submitted by the checkbox form.",
  "radio-group": "Choose a delivery schedule, inspect its submitted value, then reset it to Weekly.",
  "switch": "Turn on project notifications, then retry after the first sample save fails.",
  "toggle-group": "Change formatting or alignment and compare the note's appearance with the selected controls.",
  "segmented-control": "Switch from List to Cards to see the same projects change presentation.",

  // Forms & input
  "fields": "Submit the empty form, correct the highlighted field, then submit it again.",
  "select": "Choose a project template, then use it to read the value submitted by the form.",
  "fieldset": "Disable the contact fields together, then enable them to resume editing.",
  "search-field": "Search for a document title, then clear the search to restore all three results.",
  "password-field": "Enter a sample password, then reveal and hide it while keeping the same input.",
  "combobox": "Search for a project team, choose one, then capture the team and topic values.",
  "multi-select": "Remove a selected member, then capture the remaining member IDs.",
  "token-input": "Add a project label with Enter, then capture the labels.",
  "form-summary": "Validate the empty contact form, then use a summary link to reach the field that needs correction.",
  "form-actions": "Change the project name and save; retry the sample failure or cancel an unsaved draft.",
  "save-status": "Edit the project name, save once to see the sample error, then retry to reach the saved state.",

  // Dates & numbers
  "calendar": "Choose a deadline to update the selected date below the calendar.",
  "date-picker": "Change the deadline and save its calendar date.",
  "date-range": "Choose the October preset, then apply the reporting period.",
  "time-field": "Switch to the 12-hour format and save an appointment time.",
  "number-field": "Change the quantity and capture its numeric value.",
  "number-recipes": "Capture the budget to see currency, percentage and weight values together.",

  // Navigation
  "admin-shell": "Open Projects inside the demo workspace and try the sidebar display control.",
  "navbar": "Switch a preview navigation destination to see its active state and content change.",
  "tabs": "Add an activity note, then open Activity to see it recorded.",
  "breadcrumbs": "Choose Projects in the breadcrumb to update the preview destination.",
  "pagination": "Go to the next project page to update the list and page count.",
  "accordion": "Open a project question to read its answer.",
  "collapsible": "Show the project details, then hide them again.",
  "command-palette": "Open search, find the report command, and run it to see the local result.",
  "workspace-switcher": "Switch to Aster Research to update the current workspace.",
  "step-indicator": "Advance to Review, then revisit a completed step to see the current step change.",

  // Overlays
  "dialog": "Edit the project, save a new name, then reopen the dialog to see the saved value.",
  "tooltips": "Hover or focus the bookmark button to read its hint, then activate it to change its state.",
  "dropdown-menu": "Open Project actions and choose Compact to change the list spacing.",
  "popover": "Open Sharing options, edit the review group, then choose Done.",
  "alert-dialog": "Delete the sample project, retry the failed request, then restore it.",
  "sheet": "Edit the launch notes in the sheet and save them back to the project.",

  // Data & records
  "data-table": "Search the project records, then choose a row's Review action to inspect its details.",
  "remote-data-table": "Search for Meridian to load its matching project row.",
  "semantic-table": "Switch the table density to compare the budget rows.",
  "data-list": "Show the sample contact to reveal a value within the project details.",
  "list-item": "Review either project and check the resulting status beneath the records.",
  "filters": "Search for Meridian and apply the filter to narrow the project list.",
  "applied-filters": "Remove a search chip to broaden the project results.",
  "sort-control": "Sort by Budget to reorder the sample projects.",
  "bulk-actions": "Mark the selected records for review to clear the selection.",
  "column-settings": "Open Display settings and hide Budget to change the table columns.",
  "list-page": "Create a sample project and find it in the list.",
  "edit-page": "Change the project name and save it to update the list.",
  "record-detail": "View Meridian release, then open Activity to read its project history.",
  "activity-timeline": "Retry the failed comment to update its activity state.",

  // Files & media
  "file-input": "Choose a text or PDF file, then read the selected filenames.",
  "file-row": "Retry the failed attachment to see it marked complete.",
  "upload-queue": "Add sample files and follow each transfer from progress to completion.",
  "image": "Retry the failed image, then compare how Contain and Cover fit the image frame.",
  "file-preview": "Open the lightbox, then press Escape to return to the same file preview.",
  "avatar-upload": "Choose a replacement logo and save it to update the current saved image.",
  "document-library": "Open Brand assets to browse its files, then return to All documents.",

  // Feedback & chat
  "status": "Retry the failed export to see its message progress from error to success.",
  "tags": "Select or remove a project label, then reset the tags to restore the initial selection.",
  "loading": "Reload the project to see placeholders hold its shape until the details return.",
  "empty": "Create a preview project from the empty state, then reset the example to try the alternative.",
  "progress": "Advance file preparation to completion, then try an unknown total to compare progress states.",
  "toast": "Show an action notice, then undo the archive from the notification.",
  "persistent-banner": "View maintenance details to reveal the preparation instructions below the notice.",
  "connection-status": "Check the connection to see recovery feedback, then compare the other application states.",
  "presence-unread": "Compare the team’s availability labels, then open notifications from the inbox.",
  "notification-center": "Mark the release-plan notification as read and watch the unread count change.",
  "notification-preferences": "Enable email for mentions, then save to see the preference confirmation.",
  "chat": "Choose a suggested prompt, send it, then watch the sample reply arrive in the conversation.",
  "rich-chat": "Stream a rich reply to watch formatted text, tables and code arrive in the conversation.",

  // Account & access
  "avatar": "Try a missing image and a sample image to compare initials, fallback and loaded states.",
  "account-menu": "Open the account menu and change its appearance preference.",
  "settings-layout": "Choose Appearance in the settings navigation to open its controls.",
  "profile-settings": "Edit your full name and save the sample profile.",
  "appearance-preferences": "Change the color theme to update the workspace sample.",
  "team-members": "Search for Mira to narrow the member directory to one matching person.",
  "invitation-acceptance": "Review the fictional team and account, then accept the invitation to see the confirmation.",
  "role-capability-editor": "Change a capability and review the proposed grants before saving the role.",
  "audit-viewer": "Search for Leo to narrow the audit history, then open the matching event details.",
  "login": "Submit fictional sign-in details to see the local success state.",
  "signup": "Enter a fictional email and matching passwords to try the local account-creation result.",
  "password-reset": "Submit a fictional email to see the reset-request confirmation.",
  "new-password": "Enter matching fictional passwords to see the local update confirmation.",
  "onboarding-wizard": "Enter fictional workspace details and continue through preferences to the review step.",
  "error-pages": "Choose Offline, then try the recovery action.",

  // Charts & reporting
  "statistic": "Compare measured zeroes, missing values and unavailable statistics alongside their reporting periods.",
  "chart-frame": "Choose the Error chart state, then retry to bring the order report back.",
  "line-chart": "Focus a chart and use arrow keys to compare values, including missing measurements and zeroes.",
  "bar-chart": "Open a chart’s data table to compare the regional values behind its bars.",
  "reporting-controls": "Change the reporting period and apply it to update the report summary.",
  "dashboard": "Switch the reporting period to update the totals, chart and coverage table together.",

  // Website blocks
  "website-shell": "Follow Field notes in the embedded navigation to move to the page content.",
  "website-heroes": "Follow View the specimen sheet to move from the text hero to the media hero.",
  "website-features": "Enable Preview RTL to compare the feature grid, list and alternating sections in another direction.",
  "website-cta": "Follow Prepare an inquiry to reach the local destination below the call to action.",
  "website-faq": "Open a question to reveal its answer, then compare the expanded and collapsed states.",
  "website-forms": "Submit an empty inquiry to see validation, then correct the fields and try the local response.",
  "website-article": "Use the article’s section navigation to jump to Describe the specimen.",
};

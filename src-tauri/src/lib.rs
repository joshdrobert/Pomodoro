use tauri::{
    menu::{Menu, MenuItem},
    tray::{MouseButton, MouseButtonState, TrayIcon, TrayIconBuilder, TrayIconEvent},
    Manager, Runtime, AppHandle, WebviewWindow,
};

#[tauri::command]
fn set_ignore_cursor_events<R: Runtime>(window: tauri::Window<R>, ignore: bool) {
    let _ = window.set_ignore_cursor_events(ignore);
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_log::Builder::default().build())
        .invoke_handler(tauri::generate_handler![set_ignore_cursor_events])
        .setup(|app| {
            let handle = app.handle();

            // Create Tray Menu
            let quit_i = MenuItem::with_id(handle, "quit", "Quit", true, None::<&str>)?;
            let show_i = MenuItem::with_id(handle, "show_hide", "Show/Hide Buddy", true, None::<&str>)?;
            let menu = Menu::with_items(handle, &[&show_i, &quit_i])?;

            // Create Tray Icon
            let _tray = TrayIconBuilder::new()
                .icon(app.default_window_icon().unwrap().clone())
                .menu(&menu)
                .show_menu_on_left_click(false)
                .on_menu_event(|handle: &AppHandle, event| {
                    match event.id.as_ref() {
                        "quit" => {
                            handle.exit(0);
                        }
                        "show_hide" => {
                            if let Some(window) = handle.get_webview_window("main") {
                                let win: WebviewWindow = window;
                                let visible = win.is_visible().unwrap_or(true);
                                if visible {
                                    let _ = win.hide();
                                } else {
                                    let _ = win.show();
                                    let _ = win.set_focus();
                                }
                            }
                        }
                        _ => {}
                    }
                })
                .on_tray_icon_event(|tray: &TrayIcon, event| {
                    if let TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        ..
                    } = event
                    {
                        let app = tray.app_handle();
                        if let Some(window) = app.get_webview_window("main") {
                            let win: WebviewWindow = window;
                            let _ = win.show();
                            let _ = win.set_focus();
                        }
                    }
                })
                .build(app)?;

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

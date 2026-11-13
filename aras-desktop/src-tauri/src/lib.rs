use tauri::Manager;
use tauri::image::Image;
use tauri::menu::{Menu, MenuItem};
use tauri::tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent};

fn show_main_window(app: &tauri::AppHandle) {
    if let Some(window) = app.get_webview_window("main") {
        let _ = window.show();
        let _ = window.unminimize();
        let _ = window.set_focus();
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let menu = Menu::new(app)?;
            let show = MenuItem::with_id(app, "show", "Open ARAS Desktop", true, None::<&str>)?;
            let quit = MenuItem::with_id(app, "quit", "Exit ARAS Desktop", true, None::<&str>)?;
            menu.append(&show)?;
            menu.append(&quit)?;

            let tray_icon = Image::from_bytes(include_bytes!("../icons/icon.png"))?;
            let _tray = TrayIconBuilder::new()
                .icon(tray_icon)
                .tooltip("ARAS Desktop")
                .menu(&menu)
                .show_menu_on_left_click(false)
                .on_tray_icon_event(|tray, event| {
                    if let TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        ..
                    } = event
                    {
                        show_main_window(tray.app_handle());
                    }
                })
                .on_menu_event(|app: &tauri::AppHandle, event| {
                    let id = event.id().as_ref();
                    match id {
                        "show" => {
                            show_main_window(app);
                        }
                        "quit" => app.exit(0),
                        _ => {}
                    }
                })
                .build(app)?;

            Ok(())
        })
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                if window.label() == "main" {
                    api.prevent_close();
                    if let Err(error) = window.hide() {
                        eprintln!("Could not hide ARAS Desktop: {error}");
                    }
                }
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

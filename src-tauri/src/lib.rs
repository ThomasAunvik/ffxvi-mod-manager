use tauri::Manager;
use tauri_plugin_fs::FsExt;
use tauri_plugin_log::{Target, TargetKind};

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

pub mod appstate;
pub mod config;
pub mod pack;
pub mod server;

#[derive(serde::Serialize)]
struct ModContext {
    installed: Vec<String>,
}

#[tauri::command]
fn build_context() -> Result<ModContext, String> {
    let mut installed: Vec<String> = Vec::new();

    installed.push(String::from("Cool Mod"));

    let context = ModContext { installed };

    return Ok(context);
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(
            tauri_plugin_log::Builder::new()
                .targets([
                    Target::new(TargetKind::Stdout),
                    Target::new(TargetKind::LogDir {
                        file_name: Some(String::from("logs")),
                    }),
                    Target::new(TargetKind::Webview),
                ])
                .build(),
        )
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .setup(|app| {
            println!("{}", String::from("Setting up..."));
            log::info!("Setting up!");
            appstate::initialize_state(app);
            server::start_server(app);

            let appdata_dir = app.path().app_config_dir();

            let okdir = appdata_dir.ok().expect("Failed to get config dir");

            let config = config::read_config(&okdir);
            if config.is_ok() {
                let cfg = config.expect("Failed to fetch config");
                eprintln!("Reading config..., {}", cfg.download_path);
                log::info!("Reading config...!");
                let scope = app.fs_scope();
                scope.allow_directory(cfg.download_path, true);
                scope.allow_directory(cfg.game_path, true);
            } else {
                let err = config.err().expect("Failed to get error");
                eprintln!("Error!! {}", err);
                log::error!("something bad happened! {}", err);
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            greet,
            build_context,
            config::unlock_folders,
            pack::pack_list_files,
            pack::pack_files,
            pack::unpack_zip
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

use std::os::windows::process::CommandExt;
use std::process::Command;

use tauri::{async_runtime::Mutex, Manager, Wry};

use crate::appstate;
use crate::config;

pub trait PackExt {
    fn build_commands_pack(self) -> tauri::Builder<Wry>;
}

impl PackExt for tauri::Builder<Wry> {
    fn build_commands_pack(self) -> Self {
        return self.invoke_handler(tauri::generate_handler![pack_list_files]);
    }
}

#[tauri::command]
pub async fn pack_list_files(
    app_handle: tauri::AppHandle,
    pac_name: &str,
) -> Result<String, String> {
    let state = app_handle.state::<Mutex<appstate::AppState>>();

    let app_state = state.lock().await;

    let game_path = &app_state.game_path;

    let result = listpackfiles(pac_name, game_path);

    return Ok(result);
}

pub fn listpackfiles(pac_name: &str, game_path: &str) -> String {
    println!("Starting application: {} {}", pac_name, game_path);
    let owned_pac_name = pac_name.to_owned();
    let mut owned_path = game_path.to_owned();

    owned_path.push_str(&owned_pac_name);

    let output = if cfg!(target_os = "windows") {
        Command::new("binaries/ff16pack/FF16PackLib.CLI.exe")
            .args(["list-files", "-i", &owned_path])
            .creation_flags(config::CREATE_NO_WINDOW)
            .output()
            .expect("failed to execute process")
    } else {
        Command::new("wine")
            .arg("binaries/ff16pack/FF16PackLib.CLI")
            .args(["list-files", "-i", &owned_path])
            .output()
            .expect("failed to execute process")
    };

    let stdout = output.stdout;
    let output = String::from_utf8(stdout).expect("Our bytes should be valid utf8");

    println!("Result: {}", output);

    return output;
}

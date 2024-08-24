use std::os::windows::process::CommandExt;
use std::process::Command;

use tauri::{async_runtime::Mutex, Manager};

use crate::appstate;
use crate::config;

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

#[tauri::command]
pub async fn pack_files(folder: &str) -> Result<String, String> {
    let result = packer_pack_files(folder);
    if result.is_ok() {
        return Ok(result.ok().unwrap());
    } else {
        return Err(result.err().unwrap());
    }
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

pub fn packer_pack_files(folder: &str) -> Result<String, String> {
    let mut output_path = String::from(folder);
    output_path.push_str(".diff.pac");
    let output_path_str = output_path.as_str();

    let output = if cfg!(target_os = "windows") {
        Command::new("binaries/ff16pack/FF16PackLib.CLI.exe")
            .args(["pack", "-i", &folder, "-o", &output_path_str])
            .creation_flags(config::CREATE_NO_WINDOW)
            .output()
            .expect("failed to execute process")
    } else {
        Command::new("wine")
            .arg("binaries/ff16pack/FF16PackLib.CLI")
            .args(["pack", "-i", &folder, "-o", &output_path_str])
            .output()
            .expect("failed to execute process")
    };

    let stdout = output.stdout;
    let stderr = output.stderr;

    let mut std_str = String::from_utf8(stdout).expect("Our bytes should be valid utf8");

    if output.status.success() {
        return Ok(std_str);
    } else {
        let stderr_str = String::from_utf8(stderr).expect("Our bytes should be valid utf8");
        std_str.push_str(stderr_str.as_str());
        return Err(std_str);
    }
}

#[tauri::command]
pub fn unpack_zip(file: &str, folder: &str) -> Result<String, String> {
    let output = Command::new("tar")
        .args(["-xf", &file, "-C", &folder])
        .creation_flags(config::CREATE_NO_WINDOW)
        .output()
        .expect("failed to execute process");

    let stdout = output.stdout;
    let stderr = output.stderr;

    let mut std_str = String::from_utf8(stdout).expect("Our bytes should be valid utf8");

    if output.status.success() {
        return Ok(std_str);
    } else {
        let stderr_str = String::from_utf8(stderr).expect("Our bytes should be valid utf8");
        std_str.push_str(stderr_str.as_str());
        return Err(std_str);
    }
}

use serde::{Deserialize, Serialize};
use std::{fs, path::PathBuf, str::FromStr};
use tauri::Manager;
use tauri_plugin_fs::FsExt;

pub const CREATE_NO_WINDOW: u32 = 0x08000000;

#[derive(Serialize, Deserialize)]
pub struct AppConfig {
    #[serde(rename = "gamePath")]
    pub game_path: Option<String>,
    #[serde(rename = "downloadPath")]
    pub download_path: Option<String>,
}

#[tauri::command]
pub fn unlock_folders(app_handle: tauri::AppHandle) -> Result<String, String> {
    let appdata_dir = app_handle.path().app_config_dir();

    if !appdata_dir.is_ok() {
        return Err(String::from("Failed to get config dir"));
    }
    let okdir = appdata_dir.ok().expect("Failed to get config dir");

    let config = read_config(&okdir);
    if !config.is_ok() {
        return Err(format!(
            "Failed to read config: {}",
            config.err().expect("Grabbed Error failed")
        ));
    }

    let cfg = config.unwrap();
    let download_path = cfg.download_path.unwrap_or_default();
    let game_path = cfg.game_path.unwrap_or_default();

    log::info!("Reading config...!");
    let scope = app_handle.fs_scope();
    let asset_scope = app_handle.asset_protocol_scope();

    if download_path != "" {
        scope.allow_directory(&download_path, true);
        let _ = asset_scope.allow_directory(&download_path, true);
    }
    if game_path != "" {
        scope.allow_directory(&game_path, true);
        let _ = asset_scope.allow_directory(&game_path, true);
    }

    return Ok(format!(
        "Directory: {} and {} allowed.",
        download_path, game_path
    ));
}

pub fn read_config(path: &PathBuf) -> Result<AppConfig, String> {
    let dir_str = path.to_str();
    if !dir_str.is_some() {
        return Err(String::from("Failed to turn into str"));
    }

    let dir_ok_str = dir_str.expect("Failed to get str");

    let appstr = String::from_str(dir_ok_str);
    if !appstr.is_ok() {
        return Err(String::from("Failed to turn into String"));
    }

    let mut appstr_ok = appstr.expect("Failed to turn into String");

    appstr_ok.push_str("/config/config.json");

    let path = appstr_ok.as_str();

    let file_exists = fs::metadata(path).is_ok();
    if !file_exists {
        return Err(String::from("No config found"));
    }

    let res = fs::read(path);
    if !res.is_ok() {
        return Err(String::from("Failed to read config file"));
    }

    let file = res.expect("Failed to read config file");

    let data = String::from_utf8(file);
    if !data.is_ok() {
        return Err(String::from("Failed to read config file with utf8"));
    }

    let data_ok = data.expect("Failed to get file");

    log::info!("Parsing json... {}", data_ok);
    let config: Result<AppConfig, serde_json::Error> = serde_json::from_str(data_ok.as_str());
    if !config.is_ok() {
        return Err(format!("Failed to parse config file: {}", data_ok));
    }

    return Ok(config.expect("Failed to parse json"));
}

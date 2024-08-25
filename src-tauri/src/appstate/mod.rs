use std::ops::Deref;

use serde::{Deserialize, Serialize};
use tauri::async_runtime::Mutex;
use tauri::Manager;

#[derive(Default, Serialize, Deserialize)]
pub struct AppState {
    pub mods_updates: u32,
    pub game_path: String,
}

pub fn initialize_state(app: &mut tauri::App) {
    app.manage(Mutex::new(AppState::default()));
    println!("{}", String::from("State Initialized..."));
}

pub async fn save_state(app: &mut tauri::App) {
    let state = app.state::<Mutex<AppState>>();
    let app_state = state.lock().await;

    let json_data = serde_json::to_string(&app_state.deref());
    let test = json_data.expect("msg");

    println!("{}", test);
}

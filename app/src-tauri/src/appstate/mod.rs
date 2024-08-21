use tauri::async_runtime::Mutex;

use tauri::Manager;

#[derive(Default)]
pub struct AppState {
	pub mods_updates: u32,
	pub game_path: String,
}

pub fn initialize_state(app: &mut tauri::App) {
	app.manage(Mutex::new(AppState::default()));
	println!("{}", String::from("State Initialized..."));
}
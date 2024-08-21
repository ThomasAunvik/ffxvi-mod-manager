use std::{env::current_dir, process::Command, str::FromStr};

use tauri::{async_runtime::Mutex, Manager, Wry};
 
use crate::appstate;

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
	pac_name: &str
) -> Result<String, String> {
	let state = app_handle.state::<Mutex<appstate::AppState>>();
	
	let app_state = state.lock().await;

	let game_path = &app_state.game_path;
		
	let result = listpackfiles(
		pac_name, 
		game_path,
	);

	return Ok(result);
}

pub fn listpackfiles(
	pac_name: &str,
	game_path: &str
) -> String {
	println!("Starting application: {} {}", pac_name, game_path);
	let owned_pac_name = pac_name.to_owned();
	let mut owned_path = game_path.to_owned();

	owned_path.push_str(&owned_pac_name);

	let current_dirpath = current_dir().expect("Current executing directory not found");
	
	let mut program_str = String::from_str(
		current_dirpath.to_str().expect("Failed to convert executing directory to str"),
	).expect("Failed to convert executing directory to String");

	program_str.push_str("\\FF16Pack\\FF16PackLib.CLI\\bin\\Release\\net8.0\\FF16PackLib.CLI.exe");

	println!("Path of executable: {}", program_str);

	let output = if cfg!(target_os = "windows") {
		Command::new(program_str)
			.args(["list-files", "-i", &owned_path])
			.output()
			.expect("failed to execute process")
	} else {
		Command::new("wine")
			.arg(program_str)
			.args(["list-files", "-i", &owned_path])
			.output()
			.expect("failed to execute process")
	};

	let stdout = output.stdout;
	let output = String::from_utf8(stdout).expect("Our bytes should be valid utf8");

	println!("Result: {}", output);
	 
	return output;
}

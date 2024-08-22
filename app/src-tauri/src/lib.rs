use pack::PackExt;
use tauri::EventLoopMessage;
use tauri_plugin_shell::ShellExt;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

pub mod appstate;
pub mod pack;
pub mod server;

#[derive(serde::Serialize)]
struct ModContext {
    installed: Vec<String>,
}  

#[tauri::command]
fn build_context() -> Result<ModContext, String> {
    let mut installed:  Vec<String> = Vec::new();

    installed.push(String::from("Cool Mod"));

    let context = ModContext {
        installed,
    };

    return Ok(context);
}



#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_shell::init())
	.setup(|app| {
		println!("{}", String::from("Setting up..."));
		appstate::initialize_state(app);
        server::start_server(app);
		Ok(())
	})
    .invoke_handler(tauri::generate_handler![greet])
    .invoke_handler(tauri::generate_handler![build_context])
	.build_commands_pack()
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

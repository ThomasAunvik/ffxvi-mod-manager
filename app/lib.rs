#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

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
        .invoke_handler(tauri::generate_handler![greet])
        .invoke_handler(tauri::generate_handler![build_context])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
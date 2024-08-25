use core::time;
use std::io::{BufRead, BufReader};
use std::net::TcpListener;
use std::os::windows::process::CommandExt;
use std::str::FromStr;
use std::thread;

use tauri::{App, Manager, WindowEvent};
use tauri_plugin_shell::ShellExt;

use crate::config;

fn get_available_port() -> u16 {
    let listener = TcpListener::bind("127.0.0.1:0").unwrap();
    let addr = listener.local_addr().expect("No port found");
    let port = addr.port();

    listener
        .set_nonblocking(true)
        .expect("Failed to set unblocking");
    return port;
}
pub fn start_server(app: &mut App) {
    let is_production = if cfg!(dev) { false } else { true };

    if is_production {
        println!("Starting server...");
        let mut main_window = app.get_webview_window("main").unwrap();

        let executable = std::env::current_exe().unwrap();
        let dir = executable.parent().unwrap();
        let dir_str = dir.to_str().unwrap();

        let mut executable_string = String::from_str(dir_str).unwrap();
        executable_string.push_str("/standalone/server.js");

        let port = get_available_port();
        let port_str = String::from(port.to_string());

        let sidecar_command = app
            .shell()
            .sidecar("ffxvi-modmanager-runner")
            .unwrap()
            .args([executable_string, port_str]);

        let mut command = std::process::Command::from(sidecar_command);
        let cmd = command.spawn().expect("Failed to spawn node process");
        let pid = cmd.id();

        println!("Server spawned with id: {}", pid);

        main_window.on_window_event(move |event| match event {
            WindowEvent::Destroyed => {
                if cfg!(target_os = "windows") {
                    println!("Killing on windows with id: {}", pid);
                    std::process::Command::new("cmd")
                        .args(["/C", "taskkill", "-f", "-pid", pid.to_string().as_str()])
                        .creation_flags(config::CREATE_NO_WINDOW)
                        .output()
                        .expect("failed to execute process")
                } else {
                    std::process::Command::new("kill")
                        .args(["-9", pid.to_string().as_str()])
                        .output()
                        .expect("failed to execute process")
                };
            }
            WindowEvent::CloseRequested { .. } => {
                if cfg!(target_os = "windows") {
                    println!("closing on windows with id: {}", pid);
                    std::process::Command::new("cmd")
                        .args(["/C", "taskkill", "-f", "-pid", pid.to_string().as_str()])
                        .creation_flags(config::CREATE_NO_WINDOW)
                        .output()
                        .expect("failed to execute process")
                } else {
                    std::process::Command::new("sh")
                        .args(["kill", "-9", pid.to_string().as_str()])
                        .output()
                        .expect("failed to execute process")
                };
            }
            _ => return,
        });

        let stdout = cmd.stdout.expect("Unable to get stdout");

        thread::spawn(move || {
            let stdout_lines = BufReader::new(stdout).lines();
            for line in stdout_lines {
                let textline = line.expect("unable to get line");
                println!("{}", textline);
                if !textline.contains("Ready") {
                    continue;
                }

                thread::sleep(time::Duration::from_millis(500));

                let mut url: String = String::from("http://localhost:");
                url.push_str(port.to_string().as_str());
                let p_url = tauri::Url::parse(url.as_str()).expect("Failed to parse server url");

                main_window
                    .navigate(p_url)
                    .expect("Failed to navigate to server url");

                return;
            }
        });
    } else {
        println!("Server in DEV Mode, not spawning an another server...");
    }
}


use core::str;
use std::{env::current_dir, net::TcpListener, os::fd::AsRawFd, str::FromStr};

use tauri::{window, App, Builder, Emitter, EventLoopMessage, Manager, Wry};
use tauri_plugin_shell::ShellExt;
use tauri_plugin_shell::process::CommandEvent;

fn get_available_port() -> u16 {
  let listener = TcpListener::bind("127.0.0.1:0").unwrap();
  let addr = listener.local_addr().expect("No port found");
  let port = addr.port();

  listener.set_nonblocking(true).expect("Failed to set unblocking");
  return port
}

pub fn start_server(app: &mut App) {
    let is_dev = std::env::var("DEV").is_ok();

    if !is_dev {      
      let webview = app.get_webview_window("main").unwrap();

      let port = get_available_port();

      let sidecar_command = app.shell().sidecar("node").unwrap();
      let (mut rx, mut _child) = sidecar_command
        .spawn()
        .expect("Failed to spawn sidecar");
      
      let mut new_url = String::from("http://localhost:");
      new_url.push_str(port.to_string().as_str());


      app.shell().open(new_url, None).expect("Failed to direct to the server");
    }
}
use pathdiff::diff_paths;
use serde::Deserialize;
use swc_core::{
    ecma::{ast::*, visit::VisitMutWith},
    plugin::{
        metadata::TransformPluginMetadataContextKind, plugin_transform,
        proxies::TransformPluginProgramMetadata,
    },
};
use transform_source::InspectorPlugin;

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PluginConfig {
    #[serde(default)]
    pub project_cwd: Option<String>,
}

/// SWC plugin for code transform
///
/// This plugin adds source location information to JSX elements
/// by injecting a `data-hps-source` attribute with file path,
/// line number, and column number.
#[plugin_transform]
pub fn inspector_swc_plugin(program: Program, metadata: TransformPluginProgramMetadata) -> Program {
    // Parse plugin config with defaults
    let config: PluginConfig = metadata
        .get_transform_plugin_config()
        .and_then(|config_str| serde_json::from_str::<PluginConfig>(&config_str).ok())
        .unwrap_or_else(|| PluginConfig { project_cwd: None });
    // Get the absolute path of the file being processed
    let file_path = match metadata.get_context(&TransformPluginMetadataContextKind::Filename) {
        Some(ctx) => {
            let path = ctx.to_string();
            if let Some(project_cwd) = config.project_cwd {
                diff_paths(&path, &project_cwd)
                    .map(|p| p.to_string_lossy().into_owned())
                    .unwrap_or_else(|| path)
            } else {
                path
            }
        }
        None => {
            eprintln!("▶ Skipping: No file path available (virtual or inline module)");
            return program;
        }
    };

    let source_map = metadata.source_map;
    let mut visitor = InspectorPlugin::new(file_path, source_map);
    let mut program = program;
    program.visit_mut_with(&mut visitor);
    program
}

use swc_core::{
    ecma::{ast::*, visit::VisitMutWith},
    plugin::{
        metadata::TransformPluginMetadataContextKind, plugin_transform,
        proxies::TransformPluginProgramMetadata,
    },
};
use transform_source::InspectorPlugin;

/// SWC plugin for code inspector
///
/// This plugin adds source location information to JSX elements
/// by injecting a `__inspectorsource` attribute with file path,
/// line number, and column number.
#[plugin_transform]
pub fn inspector_swc_plugin(program: Program, metadata: TransformPluginProgramMetadata) -> Program {
    // Get the absolute path of the file being processed
    let file_path = match metadata.get_context(&TransformPluginMetadataContextKind::Filename) {
        Some(ctx) => ctx.to_string(),
        None => {
            eprintln!("▶ Skipping: No file path available (virtual or inline module)");
            return program;
        }
    };

    // Create and run the visitor
    let mut visitor = InspectorPlugin::new(file_path);
    let mut program = program;
    program.visit_mut_with(&mut visitor);
    program
}

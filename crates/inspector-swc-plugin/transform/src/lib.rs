use std::fmt;
use swc_core::{
    common::{SyntaxContext, DUMMY_SP},
    ecma::{
        ast::*,
        visit::{VisitMut, VisitMutWith},
    },
};

const TRACE_ID: &str = "__inspectorsource";

pub struct InspectorPlugin {
    filename: String,
    file_name_identifier: Option<Ident>,
}

impl fmt::Debug for InspectorPlugin {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.debug_struct("InspectorPlugin")
            .field("filename", &self.filename)
            .field(
                "file_name_identifier",
                &self.file_name_identifier.as_ref().map(|id| &id.sym),
            )
            .finish()
    }
}

impl InspectorPlugin {
    pub fn new(filename: String) -> Self {
        Self {
            filename,
            file_name_identifier: None,
        }
    }
}

impl VisitMut for InspectorPlugin {
    fn visit_mut_jsx_opening_element(&mut self, el: &mut JSXOpeningElement) {
        // Skip if element has no location info or already has __inspectorsource
        if el.span.is_dummy()
            || el.attrs.iter().any(|attr| {
                if let JSXAttrOrSpread::JSXAttr(attr) = attr {
                    if let JSXAttrName::Ident(ident) = &attr.name {
                        return ident.sym == TRACE_ID;
                    }
                }
                false
            })
        {
            return;
        }

        // Create file name identifier if not exists
        if self.file_name_identifier.is_none() {
            self.file_name_identifier = Some(Ident::new(
                self.filename.clone().into(),
                DUMMY_SP,
                SyntaxContext::empty(),
            ));
        }

        // Create source location object
        let source_loc = ObjectLit {
            span: DUMMY_SP,
            props: vec![
                PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                    key: PropName::Ident(
                        Ident::new("fileName".into(), DUMMY_SP, SyntaxContext::empty()).into(),
                    ),
                    value: Box::new(Expr::Lit(Lit::Str(Str {
                        span: DUMMY_SP,
                        value: self.filename.clone().into(),
                        raw: None,
                    }))),
                }))),
                PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                    key: PropName::Ident(
                        Ident::new("lineNumber".into(), DUMMY_SP, SyntaxContext::empty()).into(),
                    ),
                    value: Box::new(Expr::Lit(Lit::Num(Number {
                        span: DUMMY_SP,
                        value: el.span.lo.0 as f64,
                        raw: None,
                    }))),
                }))),
                PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                    key: PropName::Ident(
                        Ident::new("columnNumber".into(), DUMMY_SP, SyntaxContext::empty()).into(),
                    ),
                    value: Box::new(Expr::Lit(Lit::Num(Number {
                        span: DUMMY_SP,
                        value: (el.span.lo.0 + 1) as f64, // Convert to 1-based
                        raw: None,
                    }))),
                }))),
            ],
        };

        // Add __inspectorsource attribute
        el.attrs.push(JSXAttrOrSpread::JSXAttr(JSXAttr {
            span: DUMMY_SP,
            name: JSXAttrName::Ident(
                Ident::new(TRACE_ID.into(), DUMMY_SP, SyntaxContext::empty()).into(),
            ),
            value: Some(JSXAttrValue::JSXExprContainer(JSXExprContainer {
                span: DUMMY_SP,
                expr: JSXExpr::Expr(Box::new(Expr::Object(source_loc))),
            })),
        }));

        el.visit_mut_children_with(self);
    }

    fn visit_mut_module(&mut self, module: &mut Module) {
        // Add file name variable declaration at the start of the module
        if let Some(file_name_id) = &self.file_name_identifier {
            module.body.insert(
                0,
                ModuleItem::Stmt(Stmt::Decl(Decl::Var(Box::new(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    declare: false,
                    decls: vec![VarDeclarator {
                        span: DUMMY_SP,
                        name: Pat::Ident(BindingIdent {
                            id: file_name_id.clone(),
                            type_ann: None,
                        }),
                        init: Some(Box::new(Expr::Lit(Lit::Str(Str {
                            span: DUMMY_SP,
                            value: self.filename.clone().into(),
                            raw: None,
                        })))),
                        definite: false,
                    }],
                    ctxt: SyntaxContext::empty(),
                })))),
            );
        }

        module.visit_mut_children_with(self);
    }
}

import type {
  LaunchEditorParams,
  TrustedEditor,
} from '@hyperse/inspector-common';
import { launchEditorEndpoint } from '@hyperse/inspector-common';
import type { CodeInfo } from '../types/type-code.js';
import { fetcher } from './helper-fetcher.js';

type CodeInfoLike = CodeInfo | { codeInfo: CodeInfo };

const getCodeInfo = (_codeInfo: CodeInfoLike): CodeInfo =>
  'codeInfo' in _codeInfo ? _codeInfo.codeInfo : _codeInfo;

/**
 * fetch server api to open the code editor
 */
export const gotoServerEditor = (
  _codeInfo?: CodeInfoLike,
  options?: {
    editor?: TrustedEditor;
    customLaunchEditorEndpoint?: string;
  }
) => {
  if (!_codeInfo) return;
  const codeInfo = getCodeInfo(_codeInfo);

  const { lineNumber, columnNumber, relativePath, absolutePath } = codeInfo;

  const isRelative = Boolean(relativePath);
  const fileName = isRelative ? relativePath : absolutePath;

  if (!fileName) {
    console.error(
      `[@hyperse/inspector] Cannot open editor without source fileName`,
      codeInfo
    );
    return;
  }

  const launchParams: LaunchEditorParams = {
    fileName,
    lineNumber,
    colNumber: columnNumber,
    editor: options?.editor,
  };

  const params = new URLSearchParams(
    Object.entries(launchParams).filter(([, value]) => Boolean(value)) as [
      string,
      string,
    ][]
  );

  const lastLaunchEditorEndpoint =
    options?.customLaunchEditorEndpoint || launchEditorEndpoint;

  fetcher({
    /**
     * api path in {@link {import('@hyperse/inspector').createLaunchEditorMiddleware}}
     */
    url: lastLaunchEditorEndpoint,
    params,
    fallbackUrl: isRelative
      ? `${lastLaunchEditorEndpoint}/relative`
      : lastLaunchEditorEndpoint,
  });
};

/**
 * open source file in VSCode via it's url schema
 *
 * https://code.visualstudio.com/docs/editor/command-line#_opening-vs-code-with-urls
 */
export const gotoVSCode = (
  _codeInfo: CodeInfoLike,
  options?: { insiders?: boolean }
) => {
  const codeInfo = getCodeInfo(_codeInfo);

  if (!codeInfo.absolutePath) {
    console.error(
      `[@hyperse/inspector] Cannot open editor without source fileName`,
      codeInfo
    );
    return;
  }
  const { absolutePath, lineNumber, columnNumber } = codeInfo;
  const schema = options?.insiders ? 'vscode-insiders' : 'vscode';
  window.open(`${schema}://file/${absolutePath}:${lineNumber}:${columnNumber}`);
};

/**
 * open source file in VSCode via it's url schema
 *
 * https://code.visualstudio.com/insiders/
 */
export const gotoVSCodeInsiders = (codeInfo: CodeInfoLike) => {
  return gotoVSCode(codeInfo, { insiders: true });
};

/**
 * open source file in Cursor via it's url schema
 */
export const gotoCursor = (_codeInfo: CodeInfoLike) => {
  const codeInfo = getCodeInfo(_codeInfo);

  if (!codeInfo.absolutePath) {
    console.error(
      `[@hyperse/inspector] Cannot open editor without source fileName`,
      codeInfo
    );
    return;
  }
  const { absolutePath, lineNumber, columnNumber } = codeInfo;
  window.open(
    `cursor://open?file=${absolutePath}&line=${lineNumber}&column=${columnNumber}`
  );
};

/**
 * open source file in WebStorm via it's url schema
 */
export const gotoWebStorm = (_codeInfo: CodeInfoLike) => {
  const codeInfo = getCodeInfo(_codeInfo);

  if (!codeInfo.absolutePath) {
    console.error(
      `[@hyperse/inspector] Cannot open editor without source fileName`,
      codeInfo
    );
    return;
  }
  const { absolutePath, lineNumber, columnNumber } = codeInfo;
  window.open(
    `webstorm://open?file=${absolutePath}&line=${lineNumber}&column=${columnNumber}`
  );
};

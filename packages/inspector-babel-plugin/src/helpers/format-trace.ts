import { template, types as t } from '@babel/core';

const createNodeFromNullish = <T, N extends t.Node>(
  val: T | null,
  fn: (val: T) => N
): N | t.NullLiteral => (val == null ? t.nullLiteral() : fn(val));

export const formatTrace = (
  fileNameIdentifier: t.Identifier,
  { line, column }: { line: number; column: number }
) => {
  const fileLineLiteral = createNodeFromNullish(line, t.numericLiteral);
  const fileColumnLiteral = createNodeFromNullish(column, (c) =>
    // c + 1 to make it 1-based instead of 0-based.
    t.numericLiteral(c + 1)
  );

  return template.expression.ast`{
      fileName: ${fileNameIdentifier},
      lineNumber: ${fileLineLiteral},
      columnNumber: ${fileColumnLiteral},
  }`;
};

import React, { useEffect, useRef } from "react";

import { sample } from "./sample";
import { Style } from "style";
import * as monaco from "monaco-editor";
import { createEditor } from "app/editor/editor";

export const initialConfig: string =
  window.localStorage.getItem("config") || sample;

interface Props {
  config: string;
  setConfig: (config: string) => void;
}

export const Config: React.FC<Props> = (props) => {

  const { config, setConfig } = props;
  const editor = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)
  const container = useRef<HTMLDivElement>(null)

  // Save config
  useEffect(() => {
    window.localStorage.setItem("config", config);
  }, [config]);

  // Init editor
  useEffect(() => {
    if (!container.current) { return; }
    const options = { language: "javascript", value: "" }
    editor.current = createEditor(container.current, options);
    if (!editor.current) { throw new Error("Can't create editor."); }
    editor.current.onDidChangeModelContent(() => {
      if (!editor.current) { throw new Error("Editor is not defined."); }
      setConfig(editor.current.getValue());
    });
  }, [setConfig]);

  // Update editor
  useEffect(() => {
    if (!editor.current) { return; }
    editor.current.setValue(config);
  }, [editor, config])

  return (
    <div ref={container} className={Style().wFull().hFull().$()} />
  );
};

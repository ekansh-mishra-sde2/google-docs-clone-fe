import React, { useCallback, useEffect, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";

import {
  CUSTOM_EVENTS,
  TOOLBAR_OPTIONS,
  SAVE_DOCUMENT_INTERVAL,
} from "../constants";

function RichTextEditor() {
  const [socket, setSocket] = useState(null);
  const [quill, setQuill] = useState(null);
  const { id: documentId } = useParams();

  /* ------------------------ 1. Setup Socket.io Connection ------------------------ */
  useEffect(() => {
    const socketInstance = io(
      "https://google-docs-clone-backend-wtgq.onrender.com"
    );
    setSocket(socketInstance);

    return () => socketInstance.disconnect();
  }, []);

  /* ------------------------ 2. Load Document into Quill ------------------------- */
  useEffect(() => {
    if (!socket || !quill) return;

    socket.once("load-document", (document) => {
      quill.setContents(document);
      quill.enable();
    });

    socket.emit("get-document", documentId);
  }, [socket, quill, documentId]);

  /* ------------------------ 3. Autosave Document ------------------------ */
  useEffect(() => {
    if (!socket || !quill) return;

    const interval = setInterval(() => {
      socket.emit("save-document", quill.getContents());
    }, SAVE_DOCUMENT_INTERVAL);

    return () => clearInterval(interval);
  }, [socket, quill]);

  /* ------------------------ 4. Receive Remote Changes ------------------------ */
  useEffect(() => {
    if (!socket || !quill) return;

    const applyRemoteChanges = (delta) => quill.updateContents(delta);

    socket.on(CUSTOM_EVENTS.RECEIVE_CHANGES, applyRemoteChanges);

    return () => socket.off(CUSTOM_EVENTS.RECEIVE_CHANGES, applyRemoteChanges);
  }, [socket, quill]);

  /* ------------------------ 5. Send Local Changes ------------------------ */
  useEffect(() => {
    if (!socket || !quill) return;

    const sendChanges = (delta, oldDelta, source) => {
      if (source === "user") {
        socket.emit(CUSTOM_EVENTS.SEND_CHANGES, delta);
      }
    };

    quill.on("text-change", sendChanges);

    return () => quill.off("text-change", sendChanges);
  }, [socket, quill]);

  /* ------------------------ 6. Initialize Quill Editor ------------------------ */
  const wrapperRef = useCallback((wrapper) => {
    if (!wrapper) return;

    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);

    const quillInstance = new Quill(editor, {
      theme: "snow",
      modules: { toolbar: TOOLBAR_OPTIONS },
    });

    quillInstance.disable();
    quillInstance.setText("...Loading!");

    setQuill(quillInstance);
  }, []);

  /* ------------------------ 7. Render ------------------------ */
  return <div className="container" ref={wrapperRef} />;
}

export default RichTextEditor;

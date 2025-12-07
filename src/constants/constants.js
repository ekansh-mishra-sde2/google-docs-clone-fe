const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["image", "blockquote", "code-block"],
  ["clean"],
];
const CUSTOM_EVENTS = {
  SEND_CHANGES: "send-changes",
  RECEIVE_CHANGES: "receive-changes",
};

const SAVE_DOCUMENT_INTERVAL = 2000;

export { TOOLBAR_OPTIONS, CUSTOM_EVENTS, SAVE_DOCUMENT_INTERVAL };

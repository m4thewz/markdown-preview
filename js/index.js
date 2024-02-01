const checkbox = document.querySelector("#sync-scroll");
let scrollBarSync = false;

function convertMarkdown(code) {
  const html = marked.parse(code, { headerIds: false, mangle: false });
  document.querySelector("#preview").innerHTML = DOMPurify.sanitize(html);
}

function saveContent(code) {
  localStorage.setItem("editorValue", code);
}

function copyContent() {
  navigator.clipboard.writeText(localStorage.getItem("editorValue"));
  alert("Text copied to clipboard");
}

const editor = ace.edit("editor", {
  wrap: true,
  maxLines: Infinity,
  indentedSoftWrap: false,
  fontSize: 12,
  autoScrollEditorIntoView: true,
  theme: "ace/theme/textmate",
  mode: "ace/mode/markdown",
  keyboardHandler: "ace/keyboard/vscode",
});

editor.on("change", () => {
  const code = editor.getValue();
  convertMarkdown(code);
  saveContent(code);
});

const editorValue = localStorage.getItem("editorValue");
if (!editorValue) {
  fetch("../README.md")
    .then((response) => response.text())
    .then((data) => {
      localStorage.setItem("editorValue", data);
      editor.session.insert(editor.getCursorPosition(), data);
    });
} else {
  editor.session.insert(editor.getCursorPosition(), editorValue);
}

checkbox.addEventListener("change", (e) => {
  scrollBarSync = e.currentTarget.checked;
});

document.querySelector("#edit").addEventListener("scroll", (e) => {
  if (!scrollBarSync) return;

  const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
  const ratio = scrollTop / (scrollHeight - clientHeight);

  const previewElement = document.querySelector("#preview");
  const targetY =
    (previewElement.scrollHeight - previewElement.clientHeight) * ratio;

  previewElement.scrollTo(0, targetY);
});

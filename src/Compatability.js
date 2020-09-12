var textonly_contenteditable = null;

function supports_textonly_contenteditable() {
  if (textonly_contenteditable == null) {
    textonly_contenteditable = test_textonly_contenteditable();
  }
  return textonly_contenteditable;
}

function test_textonly_contenteditable() {
  var i = document.createElement('div');
  i.setAttribute('contentEditable', 'plaintext-only');
  return i.contentEditable === 'plaintext-only';
}

export { supports_textonly_contenteditable };
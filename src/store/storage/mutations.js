export const updateButtonState = (state, opened) => {
  state.buttonState = opened;
};

export const updateContent = (state, content) => {
  state.node.content = content;
};

export const updateSAS = (state, signature) => {
  state.signature = signature;
};

export const setNodeState = (state, id) => {
  state.node.title = id;
};

export const init = (state, node) => {
  state.node = node;
};

<template>
  <q-page class="flex flex-top">
    <div
      v-if="this.$store.state.storage.buttonState"
      v-html="previewText"
      class="full-width q-gutter-xl"
    ></div>

    <q-editor
      class="q-gutter-xl"
      v-else
      v-model="node.content"
      ref="editor_ref"
      @paste.native="evt => pasteCapture(evt)"
      min-height="5rem"
    />

  </q-page>
</template>

<script>


//import marked from 'marked'
let marked = require("marked");

export default {
  name: "PageIndex",
  data() {
    return {
      content: this.$store.state.storage.node.content,
      options: {
        content: "this is default content",
        editable: true,
        extensions: [
          ...RecommendedExtensions,
        ],
        toolbar: ["add-more", "separator", "bold", "italic", "underline"]
      },
      json: "",
      html: ""
    };
  },
  methods: {
    onUpdate({ getJSON, getHTML }) {
      this.json = getJSON();
      this.html = getHTML();
      console.log("html", this.html);
    },
    updateMessage(e) {
      this.$store.commit("storage/updateContent", e.target.value);
    },
    pasteCapture(evt) {
      let text, onPasteStripFormattingIEPaste;
      evt.preventDefault();
      if (evt.originalEvent && evt.originalEvent.clipboardData.getData) {
        text = evt.originalEvent.clipboardData.getData("text/plain");
        this.$refs.editor_ref.runCmd("insertText", text);
      } else if (evt.clipboardData && evt.clipboardData.getData) {
        text = evt.clipboardData.getData("text/plain");
        this.$refs.editor_ref.runCmd("insertText", text);
      } else if (window.clipboardData && window.clipboardData.getData) {
        if (!onPasteStripFormattingIEPaste) {
          onPasteStripFormattingIEPaste = true;
          this.$refs.editor_ref.runCmd("ms-pasteTextOnly", text);
        }
        onPasteStripFormattingIEPaste = false;
      }
    }
  },
  components: {
    QuasarTiptap
  },
  computed: {
    previewText() {
      marked.setOptions({
        renderer: new marked.Renderer(),
        gfm: true,
        tables: true,
        sanitize: true,
        breaks: true,
        pedantic: false,
        smartLists: true,
        smartypants: false
      });
      return marked(this.$store.state.storage.node.content);
    },
    node() {
      return this.$store.state.storage.node;
    },
    nodeContent: {
      get() {
        return this.$store.state.storage.node.content;
      },
      set(val) {
        this.$store.commit("storage/updateContent", val);
      }
    }
  }
};
</script>

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function Editor({ content, onChange }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content || "",
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) return null;

  return (
    <div>
      <button onClick={() => editor.chain().focus().toggleBold().run()}>
        Bold 
      </button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()}>
        Italic 
      </button>
1
      <EditorContent editor={editor} />
    </div>
  );
}

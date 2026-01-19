"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useEditor, EditorContent, NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold, Italic, List, ListOrdered, Heading1, Heading2, Heading3,
  Link as LinkIcon, Image as ImageIcon, Minus, Undo, Redo, Type
} from "lucide-react";

const cn = (...classes: (string | undefined | false)[]) => classes.filter(Boolean).join(" ");


interface MenuButtonProps {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}

const MenuButton = ({ onClick, isActive, disabled, title, children }: MenuButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={cn(
      "p-2 rounded-xl transition-all duration-200 active:scale-90",
      isActive 
        ? "bg-orange-100 text-orange-600 shadow-sm" 
        : "hover:bg-gray-100 text-gray-500 hover:text-gray-900",
      disabled && "opacity-20 cursor-not-allowed"
    )}
  >
    {children}
  </button>
);

export function MenuBar({ editor, onImageUpload }: { editor: any; onImageUpload?: () => void }) {
  if (!editor) return null;

  const addLink = useCallback(() => {
    const url = window.prompt("Nhập URL liên kết:");
    if (url) editor.chain().focus().setLink({ href: url }).run();
  }, [editor]);

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-50 bg-white sticky top-0 z-10">
      <MenuButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Hoàn tác">
        <Undo size={18} />
      </MenuButton>
      <MenuButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Làm lại">
        <Redo size={18} />
      </MenuButton>

      <div className="w-px h-6 bg-gray-200 mx-1" />

      <MenuButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive("bold")} title="In đậm">
        <Bold size={18} />
      </MenuButton>
      <MenuButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive("italic")} title="In nghiêng">
        <Italic size={18} />
      </MenuButton>

      <div className="w-px h-6 bg-gray-200 mx-1" />

      <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive("heading", { level: 1 })} title="Tiêu đề 1">
        <Heading1 size={18} />
      </MenuButton>
      <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive("heading", { level: 2 })} title="Tiêu đề 2">
        <Heading2 size={18} />
      </MenuButton>

      <div className="w-px h-6 bg-gray-200 mx-1" />

      <MenuButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive("bulletList")} title="Danh sách dấu chấm">
        <List size={18} />
      </MenuButton>
      <MenuButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive("orderedList")} title="Danh sách số">
        <ListOrdered size={18} />
      </MenuButton>

      <div className="w-px h-6 bg-gray-200 mx-1" />

      <MenuButton onClick={addLink} isActive={editor.isActive("link")} title="Thêm link">
        <LinkIcon size={18} />
      </MenuButton>
      
      <MenuButton onClick={() => onImageUpload ? onImageUpload() : null} title="Thêm ảnh">
        <ImageIcon size={18} />
      </MenuButton>

      <MenuButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Dòng kẻ ngang">
        <Minus size={18} />
      </MenuButton>
    </div>
  );
}

// --- CUSTOM EXTENSIONS ---

const ResizableImageComponent = ({ node, updateAttributes }: any) => {
  const handleResize = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = node.attrs.width || 300;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = Math.max(100, startWidth + (moveEvent.clientX - startX));
      updateAttributes({ width: newWidth });
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  return (
    <NodeViewWrapper className="relative inline-block group">
      <img
        src={node.attrs.src}
        alt={node.attrs.alt}
        style={{ width: node.attrs.width || "auto", height: "auto" }}
        className="rounded-2xl border-2 border-transparent group-hover:border-gray-400 transition-all"
      />
      <div
        onMouseDown={handleResize}
        className="absolute bottom-2 right-2 w-4 h-4 bg-orange-500 rounded-full cursor-se-resize shadow-lg border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity"
      />
    </NodeViewWrapper>
  );
};

const ResizableImage = ImageExtension.extend({
  addAttributes() {
    return { ...this.parent?.(), width: { default: 400 } };
  },
  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageComponent);
  },
});

// --- MAIN EDITOR ---

interface TipTapEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  onImageUpload?: () => void;
}

export function TipTapEditor({ content, onChange, placeholder = "Nhập mô tả sản phẩm...", onImageUpload }: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      ResizableImage.configure({ inline: true, allowBase64: true }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-orange-600 underline font-bold" } }),
      Placeholder.configure({ placeholder }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "prose prose-orange max-w-none focus:outline-none min-h-[350px] p-6 font-medium text-gray-700",
      },
    },
    immediatelyRender: false,
  });

  return (
    <div className="group border border-gray-200 rounded-4xl overflow-hidden bg-white focus-within:border-gray-400 focus-within:ring-4 focus-within:ring-orange-50 transition-all duration-300 shadow-sm">
      <MenuBar editor={editor} onImageUpload={onImageUpload} />
      <EditorContent editor={editor} />
      
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1">
          <Type size={12} /> Editor Ready
        </span>
        <div className="flex gap-1">
           <div className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
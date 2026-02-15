import { Editor } from "@tinymce/tinymce-react";
import { Controller } from "react-hook-form";
import { useState } from "react";

export default function RTE({
  name,
  control,
  label,
  defaultValue = "",
  error,
}) {
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(true);

  return (
    <div className="w-full space-y-2">

      {/* Label */}
      {label && (
        <label className="block text-sm font-semibold text-gray-700">
          {label}
        </label>
      )}

      {/* Editor Container */}
      <div
        className={`
          rounded-2xl border bg-white shadow-sm overflow-hidden
          transition focus-within:ring-2 focus-within:ring-blue-400
          ${error ? "border-red-500" : "border-gray-300"}
        `}
      >
        {/* Loading skeleton */}
        {loading && (
          <div className="h-[500px] animate-pulse bg-gray-100"></div>
        )}

        <Controller
          name={name || "content"}
          control={control}
          render={({ field: { onChange } }) => (
            <Editor
              apiKey="3pto4tkvyq6xnqfebrpxtsqf5fx2iyjg4qev9jenktd5mkg4"
              initialValue={defaultValue}
              onInit={() => setLoading(false)}
              init={{
                height: 500,
                menubar: false,
                branding: false,
                statusbar: false,

                plugins: [
                  "image",
                  "lists",
                  "link",
                  "table",
                  "code",
                  "fullscreen",
                  "preview",
                  "wordcount",
                  "autoresize",
                  "emoticons",
                  "media",
                ],

                toolbar_sticky: true,

                toolbar:
                  "undo redo | blocks | bold italic underline | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | link image media table | code fullscreen preview",

                content_style: `
                  body {
                    font-family: Inter, system-ui, sans-serif;
                    font-size: 15px;
                    padding: 12px;
                    line-height: 1.7;
                  }
                `,

                setup: (editor) => {
                  editor.on("change", () => {
                    setSaved(false);
                    onChange(editor.getContent());
                  });

                  editor.on("blur", () => {
                    setSaved(true);
                  });
                },
              }}
            />
          )}
        />
      </div>

      {/* Footer status */}
      <div className="flex justify-between text-xs text-gray-500">
        {error ? (
          <span className="text-red-500">{error}</span>
        ) : (
          <span>{saved ? "Saved ✓" : "Editing..."}</span>
        )}

        <span>Rich Text Editor</span>
      </div>
    </div>
  );
}

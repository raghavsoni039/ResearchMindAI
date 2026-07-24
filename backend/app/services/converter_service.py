import os
import tempfile

from app.rag.vector_store import collection

from app.utils.word_export import export_word
from app.utils.pdf_export import export_pdf
from app.utils.html_export import export_html
from app.utils.markdown_export import export_markdown
from app.utils.text_export import export_text
from app.utils.csv_export import export_csv
from app.utils.json_export import export_json


class ConverterService:

    @staticmethod
    def convert(filename: str, export_format: str, user_id: str = "guest"):

        # Fetch chunks scoped to this user
        results = collection.get(
            include=["documents", "metadatas"],
            where={"user_id": user_id},
        )

        documents = results.get("documents", [])
        metadatas = results.get("metadatas", [])

        chunks = []

        for text, meta in zip(documents, metadatas):

            if meta.get("filename") == filename:

                chunks.append(
                    (
                        meta.get("page", 1),
                        text,
                    )
                )

        if not chunks:
            raise Exception("Document not found.")

        # Sort pages
        chunks.sort(key=lambda x: x[0])

        # Merge all pages
        content = "\n\n".join(
            chunk for _, chunk in chunks
        )

        title = os.path.splitext(filename)[0]

        output_dir = tempfile.gettempdir()

        export_format = export_format.lower()

        # -----------------------
        # Word
        # -----------------------
        if export_format == "docx":
            path = os.path.join(output_dir, f"{title}.docx")
            export_word(title, content, path)
            return path

        # -----------------------
        # PDF
        # -----------------------
        elif export_format == "pdf":
            path = os.path.join(output_dir, f"{title}.pdf")
            export_pdf(title, content, path)
            return path

        # -----------------------
        # Text
        # -----------------------
        elif export_format == "txt":
            path = os.path.join(output_dir, f"{title}.txt")
            export_text(title, content, path)
            return path

        # -----------------------
        # Markdown
        # -----------------------
        elif export_format == "md":
            path = os.path.join(output_dir, f"{title}.md")
            export_markdown(title, content, path)
            return path

        # -----------------------
        # HTML
        # -----------------------
        elif export_format == "html":
            path = os.path.join(output_dir, f"{title}.html")
            export_html(title, content, path)
            return path

        # -----------------------
        # CSV
        # -----------------------
        elif export_format == "csv":
            path = os.path.join(output_dir, f"{title}.csv")
            export_csv(title, content, path)
            return path

        # -----------------------
        # JSON
        # -----------------------
        elif export_format == "json":
            path = os.path.join(output_dir, f"{title}.json")
            export_json(title, content, path)
            return path

        else:
            raise Exception(f"Unsupported format: {export_format}")
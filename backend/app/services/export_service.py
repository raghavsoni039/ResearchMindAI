import os

from app.utils.bibtex_export import export_bibtex
from app.utils.html_export import export_html
from app.utils.json_export import export_json
from app.utils.latex_export import export_latex
from app.utils.markdown_export import export_markdown
from app.utils.pdf_export import export_pdf
from app.utils.text_export import export_text
from app.utils.word_export import export_word

EXPORT_FOLDER = "exports"

os.makedirs(EXPORT_FOLDER, exist_ok=True)


class ExportService:

    @staticmethod
    def export(title, content, format):

        format = format.lower()

        if format == "pdf":

            return export_pdf(title, content)

        elif format == "docx":

            return export_word(title, content)

        elif format == "md":

            return export_markdown(title, content)

        elif format == "txt":

            return export_text(title, content)

        elif format == "html":

            return export_html(title, content)

        elif format == "json":

            return export_json(title, content)

        elif format == "tex":

            return export_latex(title, content)

        elif format == "bib":

            return export_bibtex(title, content)

        else:

            raise Exception("Unsupported export format.")
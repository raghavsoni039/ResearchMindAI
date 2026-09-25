import os
from datetime import datetime

from reportlab.lib.enums import TA_CENTER
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    Paragraph,
    SimpleDocTemplate,
    Spacer,
)

EXPORT_FOLDER = "exports"

os.makedirs(EXPORT_FOLDER, exist_ok=True)


def export_pdf(
    title: str,
    content: str,
    output_path: str = None,
):

    # Used by Export feature
    if output_path is None:

        filename = f"{title.replace(' ', '_')}.pdf"

        output_path = os.path.join(
            EXPORT_FOLDER,
            filename,
        )

    doc = SimpleDocTemplate(output_path)

    styles = getSampleStyleSheet()

    title_style = styles["Heading1"]
    title_style.alignment = TA_CENTER

    heading_style = styles["Heading2"]
    body_style = styles["BodyText"]

    story = []

    # Header
    story.append(
        Paragraph(
            "ResearchMind AI",
            title_style,
        )
    )

    story.append(
        Spacer(
            1,
            0.25 * inch,
        )
    )

    story.append(
        Paragraph(
            f"<b>{title}</b>",
            heading_style,
        )
    )

    story.append(
        Paragraph(
            datetime.now().strftime(
                "Generated on %d %B %Y, %I:%M %p"
            ),
            body_style,
        )
    )

    story.append(
        Spacer(
            1,
            0.30 * inch,
        )
    )

    # Content
    for line in content.split("\n"):

        line = line.strip()

        if not line:

            story.append(
                Spacer(
                    1,
                    0.15 * inch,
                )
            )

            continue

        if line.startswith("#"):

            story.append(
                Paragraph(
                    line.replace("#", "").strip(),
                    heading_style,
                )
            )

        else:

            story.append(
                Paragraph(
                    line,
                    body_style,
                )
            )

    doc.build(story)

    return output_path
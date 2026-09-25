import json
import os

EXPORT_FOLDER = "exports"

os.makedirs(EXPORT_FOLDER, exist_ok=True)


def export_json(
    title: str,
    content: str,
    output_path: str = None,
):

    # Used by Export feature
    if output_path is None:

        filename = f"{title.replace(' ', '_')}.json"

        output_path = os.path.join(
            EXPORT_FOLDER,
            filename,
        )

    data = {
        "title": title,
        "content": content,
    }

    with open(
        output_path,
        "w",
        encoding="utf-8",
    ) as f:

        json.dump(
            data,
            f,
            indent=4,
            ensure_ascii=False,
        )

    return output_path
from pathlib import Path

import fitz


pdf_path = Path("research/rize-passport-judge-writeup.pdf")
output_dir = Path(".agents/outputs/rize-passport-judge-writeup")
output_dir.mkdir(parents=True, exist_ok=True)

document = fitz.open(pdf_path)
for index, page in enumerate(document):
    pixmap = page.get_pixmap(matrix=fitz.Matrix(1.5, 1.5), alpha=False)
    pixmap.save(output_dir / f"page-{index + 1}.png")

print(f"Rendered {document.page_count} pages to {output_dir}")
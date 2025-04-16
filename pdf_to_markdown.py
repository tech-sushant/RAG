from docling.document_converter import DocumentConverter

input_file = "Amazon-annual-report.pdf"
output_file = "../pdf_markdown.txt"

converter = DocumentConverter()
result = converter.convert(input_file)

markdown_text = result.document.export_to_markdown()

with open(output_file, "w", encoding="utf-8") as file:
    file.write(markdown_text)

print("✅ Markdown content saved to output_markdown.txt")
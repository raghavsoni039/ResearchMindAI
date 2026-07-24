from fastapi import UploadFile

from app.services.pdf_service import PDFService


class DocumentService:

    @staticmethod
    async def upload_document(file: UploadFile, user_id: str = "guest"):

        pdf_result = await PDFService.save_pdf(file, user_id=user_id)

        return {
            "filename": file.filename,
            "stored_name": pdf_result["stored_name"],
            "size": file.size,
            "pages": pdf_result["pages"],
            "characters": pdf_result["characters"],
            "chunks": pdf_result["chunks"],
            "vector_ids": pdf_result["vector_ids"],
        }
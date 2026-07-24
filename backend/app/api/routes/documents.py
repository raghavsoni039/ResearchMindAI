from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from fastapi.responses import FileResponse, JSONResponse

from app.schemas.document import DocumentResponse
from app.services.document_service import DocumentService
from app.services.library_service import LibraryService
from app.services.search_service import SearchService
from app.services.semantic_search_service import SemanticSearchService
from app.core.security import get_current_user, sanitize_filename
from app.core.logger import logger

router = APIRouter(
    prefix="/documents",
    tags=["Documents"],
)


@router.post("/upload", response_model=DocumentResponse)
async def upload_document(
    file: UploadFile = File(...),
    user_id: str = Depends(get_current_user),
):

    try:

        result = await DocumentService.upload_document(file, user_id=user_id)

        return DocumentResponse(
            success=True,
            filename=result["filename"],
            stored_name=result["stored_name"],
            size=result["size"],
            pages=result["pages"],
            characters=result["characters"],
            chunks=result["chunks"],
            vectors=result["vector_ids"],
            message="PDF uploaded, indexed and ready for AI.",
        )

    except HTTPException:
        raise

    except Exception as e:

        logger.error(f"Upload error: {e}", exc_info=True)

        return JSONResponse(
            status_code=500,
            content={"success": False, "message": "An internal error occurred during upload."},
        )


@router.get("")
async def get_documents(user_id: str = Depends(get_current_user)):

    try:

        return {"documents": LibraryService.get_documents(user_id=user_id)}

    except Exception as e:

        logger.error(f"Get documents error: {e}", exc_info=True)

        return JSONResponse(
            status_code=500,
            content={"message": "An internal error occurred."},
        )


@router.get("/search/{query}")
async def search_documents(query: str, user_id: str = Depends(get_current_user)):

    try:

        return {"documents": SearchService.search_documents(query, user_id=user_id)}

    except Exception as e:

        logger.error(f"Search error: {e}", exc_info=True)

        return JSONResponse(
            status_code=500,
            content={"message": "An internal error occurred."},
        )


@router.get("/semantic-search/{query}")
async def semantic_search(query: str, user_id: str = Depends(get_current_user)):

    try:

        documents = SemanticSearchService.search(query, user_id=user_id)

        return {
            "success": True,
            "documents": documents,
            "count": len(documents),
        }

    except Exception as e:

        logger.error(f"Semantic search error: {e}", exc_info=True)

        return JSONResponse(
            status_code=500,
            content={"message": "An internal error occurred."},
        )


@router.delete("/{filename}")
async def delete_document(
    filename: str,
    user_id: str = Depends(get_current_user),
):

    try:

        safe_name = sanitize_filename(filename)
        return LibraryService.delete_document(safe_name, user_id=user_id)

    except Exception as e:

        logger.error(f"Delete error: {e}", exc_info=True)

        return JSONResponse(
            status_code=500,
            content={"message": "An internal error occurred."},
        )


@router.get("/view/{filename}")
async def view_document(
    filename: str,
    user_id: str = Depends(get_current_user),
):

    safe_name = sanitize_filename(filename)
    pdf_path = LibraryService.get_pdf_path(safe_name, user_id=user_id)

    if pdf_path is None:
        raise HTTPException(status_code=404, detail="Document not found.")

    return FileResponse(
        path=pdf_path,
        media_type="application/pdf",
        headers={"Content-Disposition": f'inline; filename="{safe_name}"'},
    )


@router.get("/download/{filename}")
async def download_document(
    filename: str,
    user_id: str = Depends(get_current_user),
):

    safe_name = sanitize_filename(filename)
    pdf_path = LibraryService.get_pdf_path(safe_name, user_id=user_id)

    if pdf_path is None:
        raise HTTPException(status_code=404, detail="Document not found.")

    return FileResponse(
        path=pdf_path,
        media_type="application/pdf",
        filename=safe_name,
        headers={"Content-Disposition": f'attachment; filename="{safe_name}"'},
    )
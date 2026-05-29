import os
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse, JSONResponse

router = APIRouter()

SAVES_DIR = "saves"
if not os.path.exists(SAVES_DIR):
    os.makedirs(SAVES_DIR)

@router.get("/token/get")
async def get_token(id: str):
    # Always return success for any 5-char token (or any token)
    # This mimics the original SDK's expectation of a profile object
    return {"token": id, "premium": True, "email": "local@user"}

@router.post("/saves/upload")
async def upload_save(
    token: str = Form(...),
    fileName: str = Form(...),
    file: UploadFile = File(...)
):
    # Sanitize filename to prevent directory traversal
    safe_filename = os.path.basename(fileName)
    # Save as {token}_{filename} to keep it flat in /saves/
    save_path = os.path.join(SAVES_DIR, f"{token}_{safe_filename}")
    
    with open(save_path, "wb") as f:
        content = await file.read()
        f.write(content)
    
    return {"success": True}

@router.get("/saves/download/{token}/{fileName}")
async def download_save(token: str, fileName: str):
    safe_filename = os.path.basename(fileName)
    save_path = os.path.join(SAVES_DIR, f"{token}_{safe_filename}")
    
    if not os.path.exists(save_path):
        return JSONResponse(status_code=404, content={"error": "File not found"})
        
    return FileResponse(save_path)

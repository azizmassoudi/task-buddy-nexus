import os
from fastapi import UploadFile
from pathlib import Path
import logging
from typing import Optional
import uuid

logger = logging.getLogger(__name__)

# Get the absolute path to the uploads directory
BASE_DIR = Path(__file__).parent.parent.parent
UPLOAD_DIR = BASE_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

ALLOWED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.gif'}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

async def save_uploaded_file(file: UploadFile) -> Optional[str]:
    """
    Save an uploaded file to the uploads directory and return the relative path.
    Returns None if the file is invalid or saving fails.
    """
    try:
        # Validate file extension
        file_extension = Path(file.filename).suffix.lower()
        if file_extension not in ALLOWED_EXTENSIONS:
            logger.error(f"Invalid file extension: {file_extension}")
            return None

        # Generate a unique filename
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = UPLOAD_DIR / unique_filename

        # Save the file
        with open(file_path, "wb") as buffer:
            content = await file.read()
            # Validate file size
            if len(content) > MAX_FILE_SIZE:
                logger.error(f"File too large: {len(content)} bytes")
                return None
            buffer.write(content)

        # Return the relative path for database storage
        return f"/uploads/{unique_filename}"

    except Exception as e:
        logger.error(f"Error saving file: {str(e)}")
        return None 
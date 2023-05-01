import hashlib
from abc import ABC
import fitz
from rest_framework.authentication import SessionAuthentication

from rest_framework.permissions import BasePermission


class IsOwner(BasePermission):
    def has_permission(self, request, view):
        if view.action == "list":
            user_id = request.query_params.get("user_id")
            if user_id is not None:
                if int(user_id) != request.user.id:
                    return False
        return True

    def has_object_permission(self, request, view, obj):
        a = obj.privacy == 1 or obj.user == request.user
        return a


class NoCsrfSessionAuthentication(SessionAuthentication):
    def enforce_csrf(self, request):
        pass


class PdfConverter(ABC):
    def convert(self, file):
        slides = []
        pdf = fitz.open(stream=file.read())
        for page in pdf.pages():
            pix = page.get_pixmap()
            data = pix.pil_tobytes("PNG")
            hash = hashlib.sha256(data).hexdigest()
            image_name = f"{hash}.png"
            pix.save(f"slides_app/slides/{image_name}")
            slides.append(image_name)
        pdf.close()
        return slides

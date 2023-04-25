from django.urls import path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView

from slides_app.views import UserViewSet, PresentationViewSet, LeadViewSet, FileImport

urlpatterns = [
    path('api/v1/user/signup/', UserViewSet.as_view({"post": "create"})),
    path('api/v1/user/login/', UserViewSet.as_view({"post": "login"})),
    path('api/v1/user/logout/', UserViewSet.as_view({"get": "logout"})),
    path('api/v1/presentation/', PresentationViewSet.as_view({"post": "create", "get": "list"})),
    path('api/v1/presentation/<int:presentation_id>/', PresentationViewSet.as_view({"get": "retrieve", "delete": "destroy", "patch": "partial_update"})),
    path('api/v1/presentation/<int:presentation_id>/lead/', LeadViewSet.as_view({"get": "list", "post": "create"})),
    path('api/v1/convert/', FileImport.as_view({"post": "convert"})),
]

urlpatterns.extend(
        [
            path(
                "schema/",
                SpectacularAPIView.as_view(
                    authentication_classes=[],
                ),
                name="schema",
            ),
            path(
                "swagger-ui/",
                SpectacularSwaggerView.as_view(
                    authentication_classes=[], url_name="schema"
                ),
                name="swagger-ui",
            ),
            path(
                "redoc/",
                SpectacularRedocView.as_view(
                    authentication_classes=[], url_name="schema"
                ),
                name="redoc",
            ),
        ]
    )

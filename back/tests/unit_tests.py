import os
from unittest import TestCase
from django.contrib.auth.models import User
from django.urls import reverse
from django.core.files.uploadedfile import UploadedFile
from rest_framework.test import APITestCase
from slides_app.utils import PdfConverter


class PdfConverterTests(TestCase):
    def test1(self):
        current_dir = os.getcwd() + r'\tests'
        converter = PdfConverter()
        file = UploadedFile(open(current_dir + r'\Python и Javascript.pdf', 'rb'))
        slides = converter.convert(file)
        for slide_name in slides:
            self.assertEqual(os.path.isfile(rf'{current_dir}\slides\{slide_name}'), True)
            os.remove(rf'{current_dir}\slides\{slide_name}')


class PresentationCreateTests(APITestCase):
    def setUp(self):
        user = User.objects.create_user(username='user', email='user@user.com', password='12345678')
        self.client.force_login(user)
        self.url = reverse('presentations')
        self.data = {
            "title": "test",
            "topic": 1,
            "privacy": 1
        }

    def test_file_not_passed(self):
        response = self.client.post(self.url, self.data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data, {"file": "This field is required."})

    def test_wrong_extension(self):
        current_dir = os.getcwd() + r'\tests'
        self.data["file"] = UploadedFile(open(current_dir + r'\__init__.py', 'rb'))
        response = self.client.post(self.url, self.data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data, {"file": "Wrong file extension. .pdf expected"})

import os

import boto3
from unidecode import unidecode

THRESHOLD = float(os.getenv("THRESHOLD", 90))

REGION_NAME = os.getenv("REGION_NAME", "us-east-1")

ABBREVIATIONS = {
    "centralelille": "centralelille",
    "École Centrale de Lille": "centralelille",
    "Massachusetts Institute of Technology": "MIT",
    "California Institute of Technology": "Caltech",
}


class RekognitionClient:
    """A client for interacting with the Rekognition service.

    This class provides methods for performing various operations using the Rekognition service,
    such as detecting labels in an image, comparing faces, and detecting text in an image.

    Args:
        boto3_client (boto3.client): An instance of the boto3 client for Rekognition.

    """

    def __init__(self):
        self._boto3_client = boto3.client("rekognition", region_name=REGION_NAME)

    def compare_faces(
        self, bucket, source_object_name, target_object_name, threshold=THRESHOLD
    ):
        """Compares faces in two images stored in an S3 bucket.

        Args:
            bucket (str): The name of the S3 bucket.
            source_object_name (str): The key of the source image object in the S3 bucket.
            target_object_name (str): The key of the target image object in the S3 bucket.
            threshold (float, optional): The similarity threshold for considering a match. Defaults to 90.

        Returns:
            bool: True if a match is found, False otherwise.

        """
        response = self._boto3_client.compare_faces(
            SourceImage={"S3Object": {"Bucket": bucket, "Name": source_object_name}},
            TargetImage={"S3Object": {"Bucket": bucket, "Name": target_object_name}},
        )
        return (
            len(response["FaceMatches"]) == 1
            and len(response["UnmatchedFaces"]) == 0
            and response["FaceMatches"][0]["Similarity"] > threshold
        )

    def image_contains_texts(self, bucket, object_name, name, university):
        """Detects text in an image stored in an S3 bucket and checks if it contains the specified texts.

        Args:
            bucket (str): The name of the S3 bucket.
            object_name (str): The key of the image object in the S3 bucket.
            texts (list): A list of texts to check for in the image.

        Returns:
            bool: True if the image contains all the specified texts, False otherwise.

        """
        response = self._boto3_client.detect_text(
            Image={
                "S3Object": {
                    "Bucket": bucket,
                    "Name": object_name,
                }
            }
        )

        if not name_in_haystack(name, response):
            return False

        if not university_in_haystack(university, response):
            return False

        return True

    def detect_faces(self, bucket, object_name):
        """Detects faces in an image stored in an S3 bucket."""
        response = self._boto3_client.detect_faces(
            Image={"S3Object": {"Bucket": bucket, "Name": object_name}},
            Attributes=["DEFAULT"],
        )

        return len(response["FaceDetails"])


def name_in_haystack(name: str, haystack: dict) -> bool:
    """
    Check if the first and last name are present in the haystack, allowing for split lines.

    Args:
        name (str): The name to search for.
        haystack (dict): A dictionary containing the haystack data.

    Returns:
        bool: True if the name is found in the haystack, False otherwise.
    """

    # Strip accents and lowercase the name
    name = unidecode(name).lower()

    # Split the name into first and last components
    first_name, last_name = name.split(" ")

    detected_lines = [
        unidecode(text["DetectedText"]).lower()
        for text in haystack["TextDetections"]
        if text["Type"] == "LINE"
    ]

    return any(first_name in line for line in detected_lines) and any(
        last_name in line for line in detected_lines
    )


def university_in_haystack(university, haystack):
    """
    Check if the university name or its abbreviation is present in the haystack.

    Args:
        university (str): The university name to search for.
        haystack (dict): A dictionary containing the haystack data.

    Returns:
        bool: True if the university name or abbreviation is found, False otherwise.
    """
    abbrs = ABBREVIATIONS.get(university, "")

    # Strip accents and lowercase the university name
    university = unidecode(university).lower()

    detected_lines = [
        unidecode(text["DetectedText"]).lower()
        for text in haystack["TextDetections"]
        if text["Type"] == "LINE"
    ]

    return any(university in line for line in detected_lines) or any(
        abbrs in line for line in detected_lines
    )

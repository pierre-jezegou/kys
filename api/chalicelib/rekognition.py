# FROM https://github.com/aws-samples/chalice-workshop.git
import uuid, json
import boto3
import os

region_name = os.getenv('REGION_NAME', 'us-east-1')

class RekognitionClient(object):
    """A client for interacting with the Rekognition service.

    This class provides methods for performing various operations using the Rekognition service,
    such as detecting labels in an image, comparing faces, and detecting text in an image.

    Args:
        boto3_client (boto3.client): An instance of the boto3 client for Rekognition.

    """

    def __init__(self, abbreviations_file='abbreviations.json'):
        self._boto3_client = boto3.client("rekognition", region_name=region_name)
        self.abbreviations = self._load_abbreviations(abbreviations_file)

    def _load_abbreviations(self, file_path):
        with open(file_path, 'r') as file:
            return json.load(file)

    def compare_faces(self, bucket, source_object_name, target_object_name, threshold=90):
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
            SourceImage={
                "S3Object": {
                    "Bucket": bucket,
                    "Name": source_object_name}
                    },
            TargetImage={
                "S3Object": {
                    "Bucket": bucket,
                    "Name": target_object_name}},
            )
        return (
            len(response["FaceMatches"]) == 1
            and len(response["UnmatchedFaces"]) == 0
            and response["FaceMatches"][0]["Similarity"] > threshold)

    
    def compare_logo(self, university_bucket, university_logo, bucket, student_id_key):
        """
        Compares the logo of a university with the logo extracted from a student ID image.

        Args:
            university_bucket (str): The name of the S3 bucket where the university logo is stored.
            university_logo (str): The filename of the university logo image.
            bucket (str): The name of the S3 bucket where the student ID image is stored.
            student_id_key (str): The key of the student ID image in the S3 bucket.

        Returns:
            bool: True if the logos match, False otherwise.
        """
        #TODO
        return True
    
    def image_contains_texts(self, bucket, object_name, texts):
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
        print("Detected text: ", response)
        # Assume texts contains [first_name, last_name, university]
        first_name, last_name = texts[0].split(' ')
        university = texts[1]

        print({
            "first_name": first_name,
            "last_name": last_name,
            "university": university
        })
        if not name_in_haystack(first_name, last_name, response):
            return False

        if not university_in_haystack(university, response, self.abbreviations):
            return False

        return True
    
    def detect_faces(self, bucket, object_name):
        """Detects faces in an image stored in an S3 bucket."""
        response = self._boto3_client.detect_faces(
            Image={
                "S3Object": {"Bucket": bucket, "Name": object_name}
            },
            Attributes=['DEFAULT']
        )

        return len(response['FaceDetails'])


def name_in_haystack(first_name, last_name, haystack):
    """
    Check if the first and last name are present in the haystack, allowing for split lines.

    Args:
        first_name (str): The first name to search for.
        last_name (str): The last name to search for.
        haystack (dict): A dictionary containing the haystack data.

    Returns:
        bool: True if the name is found in the haystack, False otherwise.
    """
    detected_lines = [text["DetectedText"] for text in haystack["TextDetections"] if text["Type"] == "LINE"]

    # Check if the name components are in separate lines
    for i in range(len(detected_lines) - 1):
        if (first_name in detected_lines[i] and last_name in detected_lines[i + 1]) or (last_name in detected_lines[i] and first_name in detected_lines[i + 1]):
            return True

    # Check if the name components are in the same line
    full_name = f"{first_name} {last_name}"
    if any(full_name in line for line in detected_lines):
        return True

    return False

def university_in_haystack(university, haystack, abbreviations):
    """
    Check if the university name or its abbreviation is present in the haystack.

    Args:
        university (str): The university name to search for.
        haystack (dict): A dictionary containing the haystack data.

    Returns:
        bool: True if the university name or abbreviation is found, False otherwise.
    """
    detected_lines = [text["DetectedText"] for text in haystack["TextDetections"] if text["Type"] == "LINE"]
    print(detected_lines)
    full_name_present = any(university in line for line in detected_lines)
    abbreviation_present = any(abbreviations.get(university, "") in line for line in detected_lines)

    return full_name_present or abbreviation_present



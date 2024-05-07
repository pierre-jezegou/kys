# FROM https://github.com/aws-samples/chalice-workshop.git
import uuid

class RekognitionClient(object):
    """A client for interacting with the Rekognition service.

    This class provides methods for performing various operations using the Rekognition service,
    such as detecting labels in an image, comparing faces, and detecting text in an image.

    Args:
        boto3_client (boto3.client): An instance of the boto3 client for Rekognition.

    """

    def __init__(self, boto3_client):
        self._boto3_client = boto3_client

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

        return needles_in_haystack(texts, response)


def needles_in_haystack(needles, haystack):
    """
    Check if all the needles are present in the haystack.

    Args:
        needles (list): A list of strings representing the needles to search for.
        haystack (dict): A dictionary containing the haystack data.

    Returns:
        bool: True if all the needles are found in the haystack, False otherwise.
    """
    for needle in needles:
        for text in haystack["TextDetections"]:
            if needle in text["DetectedText"] and text["Type"] == "LINE":
                break
        else:
            return False

    return True



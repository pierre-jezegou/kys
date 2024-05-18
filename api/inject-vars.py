import json
import os

def inject_variables(file_path, env_variables, iam_variable):
    with open(file_path, 'r') as file:
        data = json.load(file)

    dev_stage = data['stages']['dev']
    dev_stage['environment_variables'].update(env_variables)
    dev_stage['iam_role_arn'] = iam_variable['IAM_ROLE_ARN']

    with open(file_path, 'w') as file:
        json.dump(data, file, indent=2)


if __name__ == "__main__":
    file_path = ".chalice/config.json"
    env_variables = {
        "APP_BUCKET_NAME": os.getenv("APP_BUCKET_NAME", "kys-session-files"),
        "APP_TABLE_NAME": os.getenv("APP_TABLE_NAME", "kys-sessions"),
        "REGION_NAME": os.getenv("REGION_NAME", "us-east-1"),   
    }
    iam_variable = {
        "IAM_ROLE_ARN": os.getenv("IAM_ROLE_ARN", "")
    }
    inject_variables(file_path, env_variables, iam_variable)
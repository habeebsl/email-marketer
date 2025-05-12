import os
import json
from typing import Optional
from urllib.parse import quote
from dotenv import load_dotenv
from boto3 import client
from botocore.exceptions import ClientError
from db.models import Template, ICPSubset
from pydantic import EmailStr

load_dotenv()

class SesMailSender:

    def __init__(self):
        self.ses_client = client('ses', region_name='us-east-1')

    def service_format(self, email):
        return {
            "ToAddresses": [email],
            "CcAddresses": [],
            "BccAddresses": []
        }

    def send_email(
            self,
            source_name: str,
            recipient_name: str, 
            recipient_company: str, 
            recipient_job_title: str, 
            destination: EmailStr, 
            template: Template, 
            icp: ICPSubset,
            reply_tos: Optional[EmailStr]=None
        ):

        subject = template.email_subject.format(
            first_name=recipient_name,
            company=recipient_company,
            job_title=recipient_job_title
        )

        email_template = template.email_template.format(
            first_name=recipient_name,
            company=recipient_company,
            job_title=recipient_job_title
        )

        safe_email = quote(destination)
        send_args = {
            "Source": f"{source_name} <no-reply@habeebsalami.com>",
            "Destination": self.service_format(destination),
            "Message": {
                "Subject": {"Data": subject},
                "Body": {
                    "Text": {
                        "Data": email_template
                    }, 
                    "Html": {
                        "Data": email_template.replace("\n", "<br>") + f'<br><br><a href="http://127.0.0.1:3700/api/templates/update/{template.id}?subset_id={icp.id}&email={safe_email}&click=true">Get In Touch</a>'
                    }
                },
            },
        }
        if reply_tos is not None:
            send_args["ReplyToAddresses"] = [reply_tos]
            try:
                response = self.ses_client.send_email(**send_args)
                message_id = response["MessageId"]
                print(f"Sent mail {message_id} from {source_name} to {destination}.")
                return True
            except ClientError:
                print( f"Couldn't send mail from {source_name} to {destination}.")
                return False
        else:
            return message_id
        
    def get_emails(self):
        test_emails = load_test_contacts()
        return test_emails



def load_test_contacts():
    script_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    print(script_dir)
    file_path = os.path.join(script_dir, 'testing_emails.json')
    print(file_path)
    with open(file_path, 'r') as f:
        data = json.load(f)
    return data['contacts']

if __name__ == "__main__":
    load_test_contacts()
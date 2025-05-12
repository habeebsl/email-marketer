import os
from openai import OpenAI
from utils.prompts import gpt_prompts
from dotenv import load_dotenv

load_dotenv()

class GPTs:
     
    def __init__(self, prompt):
        self.client = OpenAI(api_key=os.getenv("GPT_API_KEY"))
        self.model = "gpt-4.1"
        self.prompt = prompt

    def generate_template(self, variations=4):
        response = self.client.responses.create(
            model=self.model,
            instructions=self.prompt,
            input=f"Generate {variations} email variations",
        )

        return response.output_text

    def generate_icp(self, subset=5):
        response = self.client.responses.create(
            model=self.model,
            instructions=self.prompt,
            input=f"Generate {subset} ICP subsets.",
        )
        return response.output_text
    


if __name__ == "__main__":
    model = GPTs()
    model.prompt = gpt_prompts.template_system_prompt(
        "Struggling to generate qualified leads consistently",
        "An AI-powered lead generation platform that delivers warm leads on autopilot",
        "Would you be open to a 15-minute call this week to see if it fits?"
    )

    response = model.generate_template()

    print(response)
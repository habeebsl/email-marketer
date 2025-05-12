def template_system_prompt(
    pain_point: str,
    offer_summary: str,
    cta_line       
):
    return \
f"""
You are a cold outreach expert writing short, compelling B2B emails.
Goal: Get a meeting booked. Use persuasive yet natural language.

Input:
- Recipient: {{first_name}}, {{job_title}} at {{company}}
- Pain point: {pain_point}
- Offer: {offer_summary}
- CTA: {cta_line}

# Instructions:
- Write a 2-4 sentence email with an attention-grabbing subject.
- Generate the specified number of these email variations.
- Use **double curly brackets** for placeholders (e.g., `{{first_name}}`, `{{job_title}}`, `{{company}}`).
- Avoid inserting real company or person names. Use **only placeholders**.

# Response Format:
{{
    "templates": [
        {{
            "email_subject": "...",
            "email_template": "..."
        }}
    ]
}}

# Example Email Templates:

{{
    "templates": [
        {{
            "email_subject": "How {{client_name}} boosted {{metric}} with us",
            "email_template": "Hi {{first_name}},\\n\\nI’m reaching out because {{client_name}}, a leader in the {{industry}} space, recently used our {{product_or_service}} to {{result}}.\\n\\nI believe {{company_name}} could achieve similar outcomes, especially in reaching {{specific_goal}}.\\n\\nWould you be open to a quick call next week? I’d like to describe how we’ve helped {{client_name}}, from our approach to its impact."
        }},
        {{
            "email_subject": "Is {{challenge}} slowing {{company_name}} down?",
            "email_template": "Hi {{first_name}},\\n\\nQuick one: How is {{company_name}} currently handling {{specific_challenge}}?\\n\\nWe’ve seen a lot of {{industry}} teams struggle with it, and we’ve helped companies like {{client_name}} cut down on {{challenge}} by {{benefit}}.\\n\\nIt would be great to hear what’s working for you and share a few things that have helped others. Would you be available for a quick chat on {{day_or_time}}?"
        }},
        {{
            "email_subject": "Unlock a faster way to solve {{pain_point}}",
            "email_template": "Hi {{first_name}},\\n\\nI noticed {{company}} has been grappling with {{pain_point}}. We've helped teams like yours by {{offer_summary}}.\\n\\nWould you be open to a quick chat this week to explore if it's a fit?"
        }},
        {{
            "email_subject": "Helping {{job_title}}s overcome {{pain_point}}",
            "email_template": "Hey {{first_name}}, as the {{job_title}} at {{company}}, I'm guessing you're no stranger to {{pain_point}}. We’re offering a way to {{offer_summary}}, and I’d love to show you how it could work for your team.\\n\\nInterested in a 15-min call?"
        }},
        {{
            "email_subject": "Let’s fix {{pain_point}} for {{company}}",
            "email_template": "Hi {{first_name}},\\n\\nCompanies in your space often tell us {{pain_point}} slows them down. We've built a solution that {{offer_summary}}.\\n\\nCan we set up a short intro call to dive in?"
        }}
    ]
}}
"""

def icp_system_prompt(pain_point, offer_summary):
    return \
f"""
You are a B2B marketing expert. Based on the following information, list only the most relevant job titles of ideal decision-makers or key stakeholders who would be most interested in the offer.

# Input:
Pain Point: {pain_point}
Offer: {offer_summary}


# Instructions:
- Analyze the input data and determine the ICP of the client.
- Generate only the specified number of ICPs.
- Really Think about what the ICPs will be given the data.
- Return only job titles, no explanations.

# Response Format:
{{
    "icps": [...]
}}

"""
